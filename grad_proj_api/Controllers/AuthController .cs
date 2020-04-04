using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Data;
using grad_proj_api.DTOs;
using grad_proj_api.Exceptions;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers {
    [Route ("api/[controller]")]
    [ApiController]

    //Inheriting from ControllerBase gives us the ability to use http responses in our return values
    //and it helps with validation where without it we would have needed to use [FromBody] before our parameters and ModelState
    public class AuthController : ControllerBase {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthController (IAuthRepository repo, IConfiguration configuration, IMapper mapper) {
            _repo = repo;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpPost ("sign-up")]
        public async Task<IActionResult> SignUp (UserForSignUpDTO userForSignUpDTO) {

            try {
                userForSignUpDTO.Username = userForSignUpDTO.Username.ToLower ();

                if (await _repo.UserExists (userForSignUpDTO.Username))
                    throw new UsernameUsedException (ExceptionsEnum.EMAIL_USED_EXCEPTION.ToString ());

                if (await _repo.EmailExists (userForSignUpDTO.Email))
                    throw new EmailUsedException (ExceptionsEnum.EMAIL_USED_EXCEPTION.ToString ());

                var userTobeCreated = _mapper.Map<User> (userForSignUpDTO);

                var createdUser = await _repo.SignUp (userTobeCreated, userForSignUpDTO.Password);

                var userToReturn = _mapper.Map<UserToReturnDTO> (createdUser);

                return CreatedAtRoute ("get-user", new { controller = "user", id = createdUser.Id }, userToReturn);

            } catch (Exception exception) {
                if (exception.InnerException is EmailUsedException || exception.InnerException is UsernameUsedException)
                    return StatusCode (422, exception.Message);

                return StatusCode (400, exception.Message);
            }

        }

        [HttpPost ("sign-in")]
        public async Task<IActionResult> SignIn (UserForSignInDTO userForSignInDTO) {
            try {
                User user = user = await _repo.SignIn (userForSignInDTO.Username.ToLower (), userForSignInDTO.Password);

                if (user == null)
                    return Unauthorized ();
                var tokenDescriptor = CreateSecurityTokenDescriptor (user);

                var tokenHandler = new JwtSecurityTokenHandler ();

                var token = tokenHandler.CreateToken (tokenDescriptor);

                var userToReturn = _mapper.Map<UserToReturnDTO> (user);

                return Ok (new {
                    token = tokenHandler.WriteToken (token),
                        info = userToReturn
                });
            } catch (Exception exception) { return StatusCode (400, exception.Message); }

        }

        [HttpPost ("sign-in/Google")]
        public async Task<IActionResult> GoogleSignIn (UserForGoogleSignInDTO userForGoogleSignInDTO) {
            try {
                GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings ();

                settings.Audience = new List<string> () { _configuration.GetSection ("Authentication:Google:ClientId").Value };

                var payload = GoogleJsonWebSignature.ValidateAsync (userForGoogleSignInDTO.IdToken, settings).Result;

                var user = await _repo.GoogleSignIn (payload);

                var tokenDescriptor = CreateSecurityTokenDescriptor (user);

                var tokenHandler = new JwtSecurityTokenHandler ();

                var token = tokenHandler.CreateToken (tokenDescriptor);

                var userToReturn = _mapper.Map<UserToReturnDTO> (user);

                return Ok (new {
                    token = tokenHandler.WriteToken (token),
                        info = userToReturn
                });

            } catch (Exception exception) {
                if (exception.InnerException is EmailUsedException)
                    return StatusCode (422, exception.Message);

                return StatusCode (400, exception.Message);

            }
        }

        private SecurityTokenDescriptor CreateSecurityTokenDescriptor (User user) {
            //to create the token we need to first create our claims ,then get the key from appsettings ,then create our credintials using
            //the key and algorithim we want then we create a token descriptor and specify when we want it to expire ,its subject(claims) and credintials
            //then create a token handler which we use to create the token and write it 
            var claims = new [] {

                new Claim (ClaimTypes.NameIdentifier, user.Id.ToString ()),
                new Claim (ClaimTypes.Name, user.Username.ToLower ())

            };
            //getting the key from appsettings.json which is why I injected the configuration 
            IConfigurationSection mainAuth =
                _configuration.GetSection ("Authentication:MainAuth");

            var key = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (mainAuth["Secret"]));

            var credentials = new SigningCredentials (key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor {

                Expires = DateTime.Now.AddHours (4),
                Subject = new ClaimsIdentity (claims),
                SigningCredentials = credentials

            };

            return tokenDescriptor;
        }
    }

}