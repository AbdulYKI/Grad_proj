using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Dtos;
using grad_proj_api.Helpers;
using grad_proj_api.Helpers.Pagination;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace grad_proj_api.Controllers
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
                if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                    userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                    return Unauthorized();
                var post = _mapper.Map<Post>(postForAddDto);
                post.UserId = userId;
                post.DateAddedUtc = DateTime.UtcNow;
                await _repo.Add(post);

                if (await _repo.SaveAll())
                {
                    var postFromRepo = await _repo.GetPost(post.Id);
                    var postToReturnDto = _mapper.Map<PostToReturnDto>(postFromRepo);
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
            var postFromRepo = await _repo.GetPost(id);
            if (postFromRepo == null)
                return NotFound();

            PostToReturnDto postToReturnDto;
            var nameIdentifier = (User.FindFirst(ClaimTypes.NameIdentifier));
            if (nameIdentifier != null)
            {
                var userId = int.Parse(nameIdentifier.Value);
                await MarkPostAsViewed(postFromRepo, userId);
                postToReturnDto = _mapper.Map<PostToReturnDto>(postFromRepo);
                postToReturnDto.IsDownVotedByUser = postFromRepo.DownVoters.Any(pdv => pdv.UserId == userId);
                postToReturnDto.IsUpVotedByUser = postFromRepo.UpVoters.Any(puv => puv.UserId == userId);
            }
            else
            {
                postToReturnDto = _mapper.Map<PostToReturnDto>(postFromRepo);
            }
            return Ok(postToReturnDto);
        }

        [HttpPut("{userId}/{Id}")]
        public async Task<IActionResult> UpdatePost(int userId, int id, PostForEditDto postForEditDto)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null || userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var postFromRepo = await _repo.GetPost(id);

            if (postFromRepo == null || postFromRepo.UserId != userId)
            {
                return Unauthorized();
            }
            _mapper.Map(postForEditDto, postFromRepo);
            postFromRepo.DateEditedUtc = DateTime.UtcNow;
            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            return BadRequest("Failed To Update Post");

        }

        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] PostPaginationParams postPagingParams)
        {
            var posts = await _repo.GetPosts(postPagingParams);
            var postDtos = _mapper.Map<IEnumerable<PostToReturnDto>>(posts);

            var nameIdentifier = (User.FindFirst(ClaimTypes.NameIdentifier));
            if (nameIdentifier != null)
            {
                var userId = int.Parse(nameIdentifier.Value);
                foreach (PostToReturnDto postDto in postDtos)
                {
                    var post = posts.First(p => p.Id == postDto.Id);
                    postDto.IsDownVotedByUser = post.DownVoters.Any(pdv => pdv.UserId == userId);
                    postDto.IsUpVotedByUser = post.UpVoters.Any(puv => puv.UserId == userId);
                }

            }
            Response.AddPaginationHeader(posts.CurrentPage, posts.PageSize, posts.TotalCount, posts.TotalPages);
            return Ok(postDtos);
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

        [HttpPost("up-vote/{id}/{userId}")]
        public async Task<IActionResult> CreateUpVote(int userId, int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var postFromRepo = await _repo.GetPost(id);

            if (postFromRepo == null)
            {
                return Unauthorized();
            }

            var downVote = postFromRepo.DownVoters.FirstOrDefault(pdv => pdv.UserId == userId);
            if (downVote != null)
            {

                _repo.Delete(downVote);
            }

            if (postFromRepo.UpVoters.Any(puv => puv.UserId == userId && puv.PostId == id))
            {
                return BadRequest("Post Already Upvoted");
            }
            var upVote = new UpVotedPost() { PostId = id, UserId = userId };
            await _repo.Add(upVote);

            if (await _repo.SaveAll())
            {
                var upVoteDto = _mapper.Map<UpVoteForPostToReturnDto>(upVote);
                return CreatedAtRoute(nameof(GetUpVoteForPost), new { id = id, userId = userId }, upVoteDto);
            }
            return BadRequest("Failed To Upvote Post");
        }

        [HttpPost("down-vote/{id}/{userId}")]
        public async Task<IActionResult> CreateDownVote(int userId, int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null || userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var postFromRepo = await _repo.GetPost(id);

            if (postFromRepo == null)
            {
                return Unauthorized();
            }
            var upVote = postFromRepo.UpVoters.FirstOrDefault(puv => puv.UserId == userId);
            if (upVote != null)
            {

                _repo.Delete(upVote);
            }

            if (postFromRepo.DownVoters.Any(pdv => pdv.UserId == userId && pdv.PostId == id))
            {
                return BadRequest("Post Already Downvoted");
            }
            var downVote = new DownVotedPost() { PostId = id, UserId = userId };
            await _repo.Add(downVote);

            if (await _repo.SaveAll())
            {
                var downVoteDto = _mapper.Map<DownVoteForPostToReturnDto>(downVote);
                return CreatedAtRoute(nameof(GetDownVoteForPost), new { id = id, userId = userId }, downVoteDto);
            }
            return BadRequest("Failed To Downvote Post");
        }

        [HttpDelete("down-vote/{id}/{userId}")]
        public async Task<IActionResult> DeleteDownVote(int userId, int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null || userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var postFromRepo = await _repo.GetPost(id);

            if (postFromRepo == null)
            {
                return Unauthorized();
            }

            var downVote = postFromRepo.DownVoters.FirstOrDefault(pdv => pdv.PostId == id && pdv.UserId == userId);
            if (downVote == null) { return NotFound(); }
            _repo.Delete(downVote);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest("Failed To Delete Downvote");
        }

        [HttpDelete("up-vote/{id}/{userId}")]
        public async Task<IActionResult> DeleteUpVote(int userId, int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null || userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var postFromRepo = await _repo.GetPost(id);

            if (postFromRepo == null)
            {
                return Unauthorized();
            }
            var upVote = postFromRepo.UpVoters.FirstOrDefault(puv => puv.PostId == id && puv.UserId == userId);
            if (upVote == null) { return NotFound(); }
            _repo.Delete(upVote);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest("Failed To Delete Upvote");
        }

        [HttpGet("up-vote/{id}/{userId}", Name = nameof(GetUpVoteForPost))]
        public async Task<IActionResult> GetUpVoteForPost(int userId, int id)
        {
            var upVote = await _repo.GetUpVoteForPost(userId, id);
            var upVoteDto = _mapper.Map<UpVoteForPostToReturnDto>(upVote);
            return Ok(upVoteDto);
        }

        [HttpGet("down-vote/{id}/{userId}", Name = nameof(GetDownVoteForPost))]
        public async Task<IActionResult> GetDownVoteForPost(int userId, int id)
        {
            var downVote = await _repo.GetDownVoteForPost(userId, id);
            var downVoteDto = _mapper.Map<DownVoteForPostToReturnDto>(downVote);
            return Ok(downVoteDto);
        }

        private async Task MarkPostAsViewed(Post postFromRepo, int userId)
        {
            if (!postFromRepo.PostViewers.Any(pv => pv.UserId == userId))
            {

                await _repo.Add(new ViewedPost() { UserId = userId, PostId = postFromRepo.Id });
                await _repo.SaveAll();
            }
        }

    }

}