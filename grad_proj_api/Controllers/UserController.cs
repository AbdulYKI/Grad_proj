using System;
using System.Collections.Generic;
using System.Linq;
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

namespace grad_proj_api.Controllers {
    [ServiceFilter (typeof (LogUserActivity))]
    [Route ("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase {
        private readonly IMainRepository _repo;
        private readonly IMapper _mapper;
        public UserController (IMainRepository repo, IMapper mapper) {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet ("{id}", Name = "get-user")]
        public async Task<IActionResult> GetUser (int id) {
            var user = await _repo.GetUser (id);
            var userDTO = _mapper.Map<UserToReturnDto> (user);
            return Ok (userDTO);
        }

        [HttpPut ("{id}")]
        public async Task<IActionResult> UpdateUser (int id, UserForUpdateDto userForEditDTO) {
            if (id != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();

            var userFromRepo = await _repo.GetUser (id);
            _mapper.Map (userForEditDTO, userFromRepo);
            await updateUserProgrammingLanguages (userForEditDTO.ProgrammingLanguagesIds, id);
            userFromRepo.DateUpdatedUtc = DateTime.UtcNow;
            if (await _repo.SaveAll ())
                return NoContent ();

            throw new UpdatingFailedException (ExceptionsEnum.UPDATING_FAILED_EXCEPTION.ToString ());

        }

        private async Task updateUserProgrammingLanguages (List<int> programmingLanguagesIds, int userId) {

            var userProgrammingLanguages = await _repo.GetUserProgrammingLanguages (userId);
            if (programmingLanguagesIds != null && userProgrammingLanguages != null)
                _repo.DeleteRange (userProgrammingLanguages.Where ((upl) => !programmingLanguagesIds.Contains (upl.ProgrammingLanguageId)));
            if (programmingLanguagesIds != null)
                foreach (int programmingLanguageId in programmingLanguagesIds) {
                    if (userProgrammingLanguages.FirstOrDefault ((upl) => upl.ProgrammingLanguageId == programmingLanguageId) == null) {
                    var userProgrammingLanguage = new UserProgrammingLanguage {
                    UserId = userId,
                    ProgrammingLanguageId = programmingLanguageId
                        };
                        await _repo.Add (userProgrammingLanguage);
                    }
                }

        }

        [HttpGet ("countries")]
        public async Task<IActionResult> GetCountries () {
            var countries = await _repo.GetCountries ();
            var countriesDTO = _mapper.Map<List<CountryDto>> (countries);
            return Ok (countriesDTO);
        }

        [HttpGet ("programming-languages")]
        public async Task<IActionResult> GetProgrammingLanguages () {
            var programmingLanguages = await _repo.GetProgrammingLanguages ();
            var programmingLanguagesDTOs = _mapper.Map<List<ProgrammingLanguageDto>> (programmingLanguages);
            return Ok (programmingLanguagesDTOs);
        }
    }
}