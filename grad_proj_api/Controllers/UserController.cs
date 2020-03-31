using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.DTOs;
using grad_proj_api.Helpers;
using grad_proj_api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace grad_proj_api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMainRepository _repo;
        private readonly IMapper _mapper;
        public UserController(IMainRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }



        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userDTO = _mapper.Map<UserForDetailedDTO>(user);
            return Ok(userDTO);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForEditDTO userForEditDTO)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(userForEditDTO, userFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("Updating Failed");

        }

    }
}