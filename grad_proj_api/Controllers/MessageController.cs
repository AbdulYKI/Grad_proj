using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Dtos;
using grad_proj_api.Helpers;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace grad_proj_api.Controllers {
    [ServiceFilter (typeof (LogUserActivity))]
    [Route ("api/user/{userId}/[controller]")]
    [ApiController]

    public class MessageController : ControllerBase {

        private readonly IMainRepository _repo;
        private readonly IMapper _mapper;

        public MessageController (IMainRepository repo, IMapper mapper) {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet ("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage (int userId, int id) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();
            var messageFromRepo = await _repo.GetMessage (id);
            if (messageFromRepo == null)
                return BadRequest ("Message not found");
            var messageToReturnDto = _mapper.Map<MessageToReturnDto> (messageFromRepo);
            return Ok (messageToReturnDto);

        }

        [HttpGet ("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread (int userId, int recipientId) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();

            var messagesThread = await _repo.GetMessagesThread (userId, recipientId);

            var messagesToReturnDto = _mapper.Map<IEnumerable<MessageToReturnDto>> (messagesThread);
            return Ok (messagesToReturnDto);

        }

        [HttpGet]
        public async Task<IActionResult> GetMessages (int userId, [FromQuery] MessageParams messageParams) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();
            messageParams.UserId = userId;
            var messages = await _repo.GetMessagesForUser (messageParams);
            var messageToReturnDtos = _mapper.Map<IEnumerable<MessageToReturnDto>> (messages);
            Response.AddPaginationHeader (messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return Ok (messageToReturnDtos);
        }

        [HttpPost ("{id}")]
        public async Task<IActionResult> DeleteMessage (int userId, int id) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();
            var messageFromRepo = await _repo.GetMessage (id);
            if (messageFromRepo == null)
                return NotFound ();
            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;

            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;

            if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
                _repo.Delete (messageFromRepo);

            if (await _repo.SaveAll ())
                return NoContent ();

            throw new Exception ("An error occured in deleting message");

        }

    }

}