using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using grad_proj_api.DTOs;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace grad_proj_api.Controllers {
    [Route ("api/[controller]/")]
    [ApiController]
    public class CommentController : ControllerBase {

        private readonly IMainRepository _repo;

        private readonly IMapper _mapper;
        public CommentController (IMainRepository repo, IMapper mapper) {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpPost ("{userId}/{postId}")]
        public async Task<IActionResult> CreateComment (int userId, int postId, CommentForAddDto commentForAddDto) {

            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized ();
            }

            var postFromRepo = await _repo.GetPost (postId);
            if (postFromRepo == null) {
                return NotFound ();
            }
            var comment = _mapper.Map<Comment> (commentForAddDto);
            comment.UserId = userId;
            comment.PostId = postId;
            await _repo.Add (comment);

            if (await _repo.SaveAll ()) {
                var commentToReturnDto = _mapper.Map<CommentToReturnDto> (comment);
                return CreatedAtRoute (nameof (GetComment), new { postId = comment.PostId, id = comment.Id }, commentToReturnDto);
            }
            return BadRequest ("Failed To Add Comment");

        }

        [HttpGet ("{postId}/{id}", Name = nameof (GetComment))]
        public async Task<IActionResult> GetComment (int postId, int id) {
            var postFromRepo = await _repo.GetPost (postId);
            if (postFromRepo == null) {
                return NotFound ();
            }
            var commentFromRepo = await _repo.GetComment (id);
            if (commentFromRepo == null) {
                return NotFound ();
            }
            var commentToReturnDto = _mapper.Map<CommentToReturnDto> (commentFromRepo);
            return Ok (commentToReturnDto);

        }

        [HttpGet ("{postId}")]
        public async Task<IActionResult> GetComments (int postId) {
            var postFromRepo = await _repo.GetPost (postId);
            if (postFromRepo == null) {
                return NotFound ();
            }

            var commentsFromRepo = await _repo.GetComments (postId);
            if (commentsFromRepo == null) {
                return NotFound ();
            }
            var commentsToReturnDtos = _mapper.Map<List<CommentToReturnDto>> (commentsFromRepo);
            return Ok (commentsToReturnDtos);

        }

        [HttpPut ("{userId}/{id}")]
        public async Task<IActionResult> EditComment (int userId, int id, CommentForEditDto commentForEditDto) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized ();
            }
            var commentFromRepo = await _repo.GetComment (id);
            if (commentFromRepo == null) {
                return NotFound ();
            }
            _mapper.Map (commentForEditDto, commentFromRepo);
            if (await _repo.SaveAll ()) {
                return NoContent ();
            }
            return BadRequest ("Failed To Edit Comment");

        }

        [HttpDelete ("{postId}/{userId}/{id}")]
        public async Task<IActionResult> DeleteComment (int postId, int userId, int id) {
            var postFromRepo = await _repo.GetPost (postId);
            if (postFromRepo == null) {
                return NotFound ();
            }

            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized ();
            }
            var commentFromRepo = await _repo.GetComment (id);
            if (commentFromRepo == null) {
                return NotFound ();
            }
            _repo.Delete (commentFromRepo);
            if (await _repo.SaveAll ()) {
                return NoContent ();
            }
            return BadRequest ("Failed To Delete Comment");

        }

    }
}