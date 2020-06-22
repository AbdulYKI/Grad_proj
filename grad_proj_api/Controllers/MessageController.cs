using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Dtos;
using grad_proj_api.Exceptions;
using grad_proj_api.Helpers;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace grad_proj_api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/user/{userId}/[controller]")]
    [ApiController]

    public class MessageController : ControllerBase
    {

        private readonly IMainRepository _repo;
        private readonly IMapper _mapper;

        public MessageController(IMainRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}/{language?}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id, Languages? language)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                throw new UnauthorisedException(language);
            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo == null)
                throw new NotFoundException(language);
            var messageToReturnDto = _mapper.Map<MessageToReturnDto>(messageFromRepo);
            return Ok(messageToReturnDto);

        }

        [HttpGet("thread/{recipientId}/{language?}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId, Languages? language)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                throw new UnauthorisedException(language);

            var messagesThread = await _repo.GetMessagesThread(userId, recipientId);

            var messagesToReturnDto = _mapper.Map<List<MessageToReturnDto>>(messagesThread);
            return Ok(messagesToReturnDto);

        }

        [HttpGet("{language?}")]
        public async Task<IActionResult> GetMessages(int userId, Languages? language, [FromQuery] MessagePaginationParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                throw new UnauthorisedException(language);
            var messages = await _repo.GetMessagesForUser(messageParams, userId);
            var messageToReturnDtos = _mapper.Map<List<MessageToReturnDto>>(messages);
            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return Ok(messageToReturnDtos);
        }

        [HttpDelete("{id}/{language?}")]
        public async Task<IActionResult> DeleteMessage(int userId, int id, Languages? language)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                throw new UnauthorisedException(language);
            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo == null)
                throw new NotFoundException(language);
            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;

            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;

            if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
                _repo.Delete(messageFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new FailedToDeleteEntityException(language);

        }

    }

}