using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using grad_proj_api.Dtos;
using grad_proj_api.Helpers;
using grad_proj_api.Helpers.Pagination;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace grad_proj_api.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    public class CommentController : ControllerBase
    {

        private readonly IMainRepository _repo;

        private readonly IMapper _mapper;
        public CommentController(IMainRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpPost("{userId}/{postId}")]
        public async Task<IActionResult> CreateComment(int userId, int postId, CommentForAddDto commentForAddDto)
        {

            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var postFromRepo = await _repo.GetPost(postId);
            if (postFromRepo == null)
            {
                return NotFound();
            }
            var comment = _mapper.Map<Comment>(commentForAddDto);
            comment.UserId = userId;
            comment.PostId = postId;
            comment.DateAddedUtc = DateTime.UtcNow;
            await _repo.Add(comment);

            if (await _repo.SaveAll())
            {
                var commentFromRepo = await _repo.GetComment(comment.Id);
                var commentToReturnDto = _mapper.Map<CommentToReturnDto>(commentFromRepo);
                return CreatedAtRoute(nameof(GetComment), new { postId = comment.PostId, id = comment.Id }, commentToReturnDto);
            }
            return BadRequest("Failed To Add Comment");

        }

        [HttpGet("{postId}/{id}", Name = nameof(GetComment))]
        public async Task<IActionResult> GetComment(int postId, int id)
        {
            var postFromRepo = await _repo.GetPost(postId);
            if (postFromRepo == null)
            {
                return NotFound();
            }
            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                return NotFound();
            }
            var commentToReturnDto = _mapper.Map<CommentToReturnDto>(commentFromRepo);
            var nameIdentifier = (User.FindFirst(ClaimTypes.NameIdentifier));
            if (nameIdentifier != null)
            {
                var userId = int.Parse(nameIdentifier.Value);
                commentToReturnDto.IsDownVotedByUser = commentFromRepo.DownVoters.Any(cdv => cdv.UserId == userId);
                commentToReturnDto.IsUpVotedByUser = commentFromRepo.UpVoters.Any(cuv => cuv.UserId == userId);
            }

            return Ok(commentToReturnDto);

        }

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetComments(int postId, [FromQuery] CommentPaginationParams commentPaginationParams)
        {
            var postFromRepo = await _repo.GetPost(postId);
            if (postFromRepo == null)
            {
                return NotFound();
            }

            var commentsFromRepo = await _repo.GetComments(postId, commentPaginationParams);
            var commentsToReturnDtos = _mapper.Map<List<CommentToReturnDto>>(commentsFromRepo);
            var nameIdentifier = (User.FindFirst(ClaimTypes.NameIdentifier));
            if (nameIdentifier != null)
            {
                var userId = int.Parse(nameIdentifier.Value);
                foreach (CommentToReturnDto commentDto in commentsToReturnDtos)
                {
                    var comment = commentsFromRepo.First(c => c.Id == commentDto.Id);
                    commentDto.IsDownVotedByUser = comment.DownVoters.Any(cdv => cdv.UserId == userId);
                    commentDto.IsUpVotedByUser = comment.UpVoters.Any(cuv => cuv.UserId == userId);
                }
            }

            Response.AddPaginationHeader(commentsFromRepo.CurrentPage, commentsFromRepo.PageSize, commentsFromRepo.TotalCount, commentsFromRepo.TotalPages);
            return Ok(commentsToReturnDtos);

        }

        [HttpPut("{userId}/{id}")]
        public async Task<IActionResult> EditComment(int userId, int id, CommentForEditDto commentForEditDto)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                return NotFound();
            }
            _mapper.Map(commentForEditDto, commentFromRepo);
            commentFromRepo.DateEditedUtc = DateTime.UtcNow;
            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest("Failed To Edit Comment");

        }

        [HttpDelete("{postId}/{userId}/{id}")]
        public async Task<IActionResult> DeleteComment(int postId, int userId, int id)
        {
            var postFromRepo = await _repo.GetPost(postId);
            if (postFromRepo == null)
            {
                return NotFound();
            }

            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                return NotFound();
            }
            _repo.Delete(commentFromRepo);
            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest("Failed To Delete Comment");

        }

        [HttpPost("up-vote/{id}/{userId}")]
        public async Task<IActionResult> CreateUpVote(int userId, int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                return Unauthorized();
            }
            var downVote = commentFromRepo.DownVoters.FirstOrDefault(cdv => cdv.UserId == userId);
            if (downVote != null)
            {
                _repo.Delete(downVote);
            }

            var upVote = new UpVotedComment() { CommentId = id, UserId = userId };
            if (commentFromRepo.UpVoters.Any(cuv => cuv.UserId == upVote.UserId && cuv.CommentId == id))
            {
                return BadRequest("Comment Already Upvoted");
            }
            await _repo.Add(upVote);

            if (await _repo.SaveAll())
            {
                var upVoteDto = _mapper.Map<UpVoteForCommentToReturnDto>(upVote);
                return CreatedAtRoute(nameof(GetUpVoteForComment), new { id = id, userId = userId }, upVoteDto);
            }
            return BadRequest("Failed To Upvote Comment");
        }

        [HttpPost("down-vote/{id}/{userId}")]
        public async Task<IActionResult> CreateDownVote(int userId, int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var commentFromRepo = await _repo.GetComment(id);

            if (commentFromRepo == null)
            {
                return Unauthorized();
            }
            var upVote = commentFromRepo.UpVoters.FirstOrDefault(cuv => cuv.UserId == userId);
            if (upVote != null)
            {
                _repo.Delete(upVote);
            }
            var downVote = new DownVotedComment() { CommentId = id, UserId = userId };
            if (commentFromRepo.DownVoters.Any(cdv => cdv.UserId == downVote.UserId && cdv.CommentId == id))
            {
                return BadRequest("Comment Already Downvoted");
            }
            await _repo.Add(downVote);

            if (await _repo.SaveAll())
            {
                var downVoteDto = _mapper.Map<DownVoteForCommentToReturnDto>(downVote);
                return CreatedAtRoute(nameof(GetUpVoteForComment), new { id = id, userId = userId }, downVoteDto);
            }
            return BadRequest("Failed To Downvote Comment");
        }

        [HttpDelete("down-vote/{id}/{userId}")]
        public async Task<IActionResult> DeleteDownVote(int userId, int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                return Unauthorized();
            }

            var downVote = commentFromRepo.DownVoters.FirstOrDefault(cdv => cdv.UserId == userId);
            if (downVote == null) { return NotFound(); }
            _repo.Delete(downVote);

            if (await _repo.SaveAll())
            {
                var downVoteDto = _mapper.Map<DownVoteForCommentToReturnDto>(downVote);
                return CreatedAtRoute(nameof(GetDownVoteForComment), new { id = id, userId = userId }, downVoteDto);
            }
            return BadRequest("Failed To Delete Downvote Comment");
        }

        [HttpDelete("up-vote/{id}/{userId}")]
        public async Task<IActionResult> DeleteUpVoteComment(int userId, int id)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var commentFromRepo = await _repo.GetComment(id);

            if (commentFromRepo == null)
            {
                return Unauthorized();
            }

            var upVote = commentFromRepo.UpVoters.FirstOrDefault(cuv => cuv.UserId == userId);
            if (upVote == null) { return NotFound(); }
            _repo.Delete(upVote);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest("Failed To Delete Upvote Comment");
        }

        [HttpGet("up-vote/{id}/{userId}", Name = nameof(GetUpVoteForComment))]
        public async Task<IActionResult> GetUpVoteForComment(int userId, int id)
        {
            var upVote = await _repo.GetUpVoteForComment(userId, id);
            var upVoteDto = _mapper.Map<UpVoteForCommentToReturnDto>(upVote);
            return Ok(upVoteDto);
        }

        [HttpGet("down-vote/{id}/{userId}", Name = nameof(GetDownVoteForComment))]
        public async Task<IActionResult> GetDownVoteForComment(int userId, int id)
        {
            var downVote = await _repo.GetDownVoteForComment(userId, id);
            var downVoteDto = _mapper.Map<DownVoteForCommentToReturnDto>(downVote);
            return Ok(downVoteDto);
        }

    }
}