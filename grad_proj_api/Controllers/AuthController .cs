using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Data;
using grad_proj_api.Dtos;
using grad_proj_api.Exceptions;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using grad_proj_api.Helpers;

namespace grad_proj_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    //Inheriting from ControllerBase gives us the ability to use http responses in our return values
    //and it helps with validation where without it we would have needed to use [FromBody] before our parameters and ModelState
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration configuration, IMapper mapper)
        {
            _repo = repo;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpPost("sign-up/{language?}")]
        public async Task<IActionResult> SignUp(Languages? language, UserForSignUpDto userForSignUpDTO)
        {


            userForSignUpDTO.Username = userForSignUpDTO.Username.ToLower();

            if (await _repo.EmailExists(userForSignUpDTO.Email))
                throw new EmailUsedException(language);

            if (await _repo.UserExists(userForSignUpDTO.Username))
                throw new UsernameUsedException(language);

            var userTobeCreated = _mapper.Map<User>(userForSignUpDTO);
            userTobeCreated.CreatedUtc = DateTime.UtcNow;
            var createdUser = await _repo.SignUp(userTobeCreated, userForSignUpDTO.Password);
            var userToReturn = _mapper.Map<UserToReturnDto>(createdUser);

            return CreatedAtRoute("get-user", new { controller = "user", id = createdUser.Id }, userToReturn);




        }

        [HttpPost("sign-in/{language?}")]
        public async Task<IActionResult> SignIn(Languages? language, UserForSignInDto userForSignInDTO)
        {

            User user = user = await _repo.SignIn(userForSignInDTO.Username.ToLower(), userForSignInDTO.Password);

            if (user == null)
                throw new UnauthorisedException(language);
            var tokenDescriptor = CreateSecurityTokenDescriptor(user);

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var userToReturn = _mapper.Map<UserToReturnDto>(user);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                info = userToReturn
            });


        }

        [HttpPost("sign-in/Google/{language?}")]
        public async Task<IActionResult> GoogleSignIn(Languages? language, UserForGoogleSignInDto userForGoogleSignInDTO)
        {

            GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings();

            settings.Audience = new List<string>() { _configuration.GetSection("AppSettings:GoogleClientId").Value };

            var payload = GoogleJsonWebSignature.ValidateAsync(userForGoogleSignInDTO.IdToken, settings).Result;

            var user = await _repo.GoogleSignIn(payload, language);

            var tokenDescriptor = CreateSecurityTokenDescriptor(user);

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var userToReturn = _mapper.Map<UserToReturnDto>(user);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                info = userToReturn
            });



        }

        private SecurityTokenDescriptor CreateSecurityTokenDescriptor(User user)
        {
            //to create the token we need to first create our claims ,then get the key from appsettings ,then create our credintials using
            //the key and algorithim we want then we create a token descriptor and specify when we want it to expire ,its subject(claims) and credintials
            //then create a token handler which we use to create the token and write it 
            var claims = new[] {

                new Claim (ClaimTypes.NameIdentifier, user.Id.ToString ()),
                new Claim (ClaimTypes.Name, user.Username.ToLower ())

            };
            //getting the key from appsettings.json which is why I injected the configuration 

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {

                Expires = DateTime.Now.AddHours(4),
                Subject = new ClaimsIdentity(claims),
                SigningCredentials = credentials

            };

            return tokenDescriptor;
        }
    }

}