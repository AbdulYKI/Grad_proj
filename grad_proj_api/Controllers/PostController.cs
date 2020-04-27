using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Dtos;
using grad_proj_api.DTOs;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    //Inheriting from ControllerBase gives us the ability to use http responses in our return values
    //and it helps with validation where without it we would have needed to use [FromBody] before our parameters and ModelState
    public class PostController : ControllerBase
    {
        private readonly IMainRepository _repo;

        private readonly IMapper _mapper;

        public PostController(IMainRepository repo, IConfiguration configuration, IMapper mapper)
        {
            _repo = repo;

            _mapper = mapper;
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> AddPost(int userId, PostForAddDto postForAddDto)
        {

            try
            {
                if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                    return Unauthorized();
                var post = _mapper.Map<Post>(postForAddDto);
                post.UserId = userId;
                await _repo.Add(post);

                if (await _repo.SaveAll())
                {
                    var postFromRepo = await _repo.GetPost(post.Id);
                    var postToReturnDto = _mapper.Map<postToReturnDto>(postFromRepo);
                    return CreatedAtAction(nameof(GetPost), new { id = post.Id }, postToReturnDto);
                }

                return BadRequest("Uploading post failed");
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }

        }

        [HttpGet("{id}", Name = nameof(GetPost))]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _repo.GetPost(id);
            if (post == null)
                return NotFound();
            var postToReturn = _mapper.Map<postToReturnDto>(post);
            return Ok(postToReturn);
        }

        [HttpPut("{userId}/{Id}")]
        public async Task<IActionResult> UpdatePost(int userId, int id, PostForEditDto postForEditDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var postFromRepo = await _repo.GetPost(id);

            if (postFromRepo == null || postFromRepo.UserId != userId)
            {
                return Unauthorized();
            }
            _mapper.Map(postForEditDto, postFromRepo);
            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            return BadRequest("Failed To Update Post");

        }

        [HttpGet]
        public async Task<IActionResult> GetPosts()
        {
            var posts = await _repo.GetPosts();
            var postsToReturn = _mapper.Map<List<postToReturnDto>>(posts);
            return Ok(postsToReturn);
        }

        [HttpDelete("{userId}/{id}")]
        public async Task<IActionResult> DeletePost(int userId, int id)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var postFromRepo = await _repo.GetPost(id);

            if (postFromRepo == null || postFromRepo.UserId != userId)
            {
                return Unauthorized();
            }
            _repo.Delete(postFromRepo);
            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest("Failed To delete Post");

        }

    }

}