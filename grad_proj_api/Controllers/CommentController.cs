using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using grad_proj_api.Dtos;
using grad_proj_api.Exceptions;
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

        [HttpPost("{userId}/{postId}/{language?}")]
        public async Task<IActionResult> CreateComment(int userId, int postId, Languages? language, CommentForAddDto commentForAddDto)
        {

            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                throw new UnauthorisedException(language);
            }

            var postFromRepo = await _repo.GetPost(postId);
            if (postFromRepo == null)
            {
                throw new NotFoundException(language);
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
            throw new FailedToCreateEntityException(language);

        }

        [HttpGet("{postId}/{id}/{language?}", Name = nameof(GetComment))]
        public async Task<IActionResult> GetComment(int postId, int id, Languages? language)
        {
            var postFromRepo = await _repo.GetPost(postId);
            if (postFromRepo == null)
            {
                throw new NotFoundException(language);
            }
            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                throw new NotFoundException(language);
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

        [HttpGet("{postId}/{language?}")]
        public async Task<IActionResult> GetComments(int postId, Languages? language, [FromQuery] CommentPaginationParams commentPaginationParams)
        {
            var postFromRepo = await _repo.GetPost(postId);
            if (postFromRepo == null)
            {
                throw new NotFoundException(language);
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

        [HttpPut("{userId}/{id}/{language?}")]
        public async Task<IActionResult> EditComment(int userId, int id, Languages? language, CommentForEditDto commentForEditDto)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                throw new UnauthorisedException(language);
            }
            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                throw new NotFoundException(language);
            }
            _mapper.Map(commentForEditDto, commentFromRepo);
            commentFromRepo.DateEditedUtc = DateTime.UtcNow;
            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            throw new FailedToUpdateEntityException(language);

        }

        [HttpDelete("{postId}/{userId}/{id}/{language?}")]
        public async Task<IActionResult> DeleteComment(int postId, int userId, int id, Languages? language)
        {
            var postFromRepo = await _repo.GetPost(postId);
            if (postFromRepo == null)
            {
                throw new NotFoundException(language);
            }

            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                throw new UnauthorisedException(language);
            }
            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                throw new NotFoundException(language);
            }
            _repo.Delete(commentFromRepo);
            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            throw new FailedToDeleteEntityException(language);

        }

        [HttpPost("up-vote/{id}/{userId}/{language?}")]
        public async Task<IActionResult> CreateUpVote(int userId, int id, Languages? language)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                throw new UnauthorisedException(language);
            }

            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                throw new UnauthorisedException(language);
            }
            var downVote = commentFromRepo.DownVoters.FirstOrDefault(cdv => cdv.UserId == userId);
            if (downVote != null)
            {
                _repo.Delete(downVote);
            }

            var upVote = new UpVotedComment() { CommentId = id, UserId = userId };
            if (commentFromRepo.UpVoters.Any(cuv => cuv.UserId == upVote.UserId && cuv.CommentId == id))
            {
                throw new EntityAlreadyCreatedException(language);
            }
            await _repo.Add(upVote);

            if (await _repo.SaveAll())
            {
                var upVoteDto = _mapper.Map<UpVoteForCommentToReturnDto>(upVote);
                return CreatedAtRoute(nameof(GetUpVoteForComment), new { id = id, userId = userId }, upVoteDto);
            }
            throw new FailedToCreateEntityException(language);
        }

        [HttpPost("down-vote/{id}/{userId}/{language?}")]
        public async Task<IActionResult> CreateDownVote(int userId, int id, Languages? language)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {

                throw new UnauthorisedException(language);
            }
            var commentFromRepo = await _repo.GetComment(id);

            if (commentFromRepo == null)
            {

                throw new UnauthorisedException(language);
            }
            var upVote = commentFromRepo.UpVoters.FirstOrDefault(cuv => cuv.UserId == userId);
            if (upVote != null)
            {
                _repo.Delete(upVote);
            }
            var downVote = new DownVotedComment() { CommentId = id, UserId = userId };
            if (commentFromRepo.DownVoters.Any(cdv => cdv.UserId == downVote.UserId && cdv.CommentId == id))
            {
                throw new EntityAlreadyCreatedException(language);
            }
            await _repo.Add(downVote);

            if (await _repo.SaveAll())
            {
                var downVoteDto = _mapper.Map<DownVoteForCommentToReturnDto>(downVote);
                return CreatedAtRoute(nameof(GetUpVoteForComment), new { id = id, userId = userId }, downVoteDto);
            }
            throw new FailedToCreateEntityException(language);
        }

        [HttpDelete("down-vote/{id}/{userId}/{language?}")]
        public async Task<IActionResult> DeleteDownVote(int userId, int id, Languages? language)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                throw new UnauthorisedException(language);
            }
            var commentFromRepo = await _repo.GetComment(id);
            if (commentFromRepo == null)
            {
                throw new UnauthorisedException(language);
            }

            var downVote = commentFromRepo.DownVoters.FirstOrDefault(cdv => cdv.UserId == userId);
            if (downVote == null) { return NotFound(); }
            _repo.Delete(downVote);

            if (await _repo.SaveAll())
            {
                var downVoteDto = _mapper.Map<DownVoteForCommentToReturnDto>(downVote);
                return CreatedAtRoute(nameof(GetDownVoteForComment), new { id = id, userId = userId }, downVoteDto);
            }
            throw new FailedToDeleteEntityException(language);
        }

        [HttpDelete("up-vote/{id}/{userId}/{language?}")]
        public async Task<IActionResult> DeleteUpVoteComment(int userId, int id, Languages? language)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                throw new UnauthorisedException(language);
            }
            var commentFromRepo = await _repo.GetComment(id);

            if (commentFromRepo == null)
            {
                throw new UnauthorisedException(language);
            }

            var upVote = commentFromRepo.UpVoters.FirstOrDefault(cuv => cuv.UserId == userId);
            if (upVote == null) { return NotFound(); }
            _repo.Delete(upVote);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            throw new FailedToDeleteEntityException(language);
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