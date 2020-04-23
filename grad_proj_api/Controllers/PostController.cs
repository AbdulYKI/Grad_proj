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

namespace DatingApp.API.Controllers {
    [Route ("api/post")]
    [ApiController]

    //Inheriting from ControllerBase gives us the ability to use http responses in our return values
    //and it helps with validation where without it we would have needed to use [FromBody] before our parameters and ModelState
    public class PostController : ControllerBase {
        private readonly IMainRepository _repo;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public PostController (IMainRepository repo, IConfiguration configuration, IMapper mapper) {
            _repo = repo;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpPost ("{userId}")]
        public async Task<IActionResult> AddPost (int userId, PostForAddDto postForAddDto) {

            try {
                if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                    return Unauthorized ();
                var post = _mapper.Map<Post> (postForAddDto);
                post.CreatorId = userId;
                await _repo.Add (post);

                if (await _repo.SaveAll ()) {
                    var postFromRepo = await _repo.GetPost (post.Id);
                    var postToReturnDto = _mapper.Map<postToReturnDto> (postFromRepo);
                    return CreatedAtAction (nameof (GetPost), new { id = post.Id }, postToReturnDto);
                }

                return BadRequest ("Uploading post failed");
            } catch (Exception exception) {
                return BadRequest (exception.Message);

            }

        }

        [HttpGet ("{id}", Name = nameof (GetPost))]
        public async Task<IActionResult> GetPost (int id) {
            var post = await _repo.GetPost (id);
            var postToReturn = _mapper.Map<postToReturnDto> (post);
            return Ok (postToReturn);
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts () {
            var posts = await _repo.GetPosts ();
            var postsToReturn = _mapper.Map<List<postToReturnDto>> (posts);
            return Ok (postsToReturn);
        }

    }

}