using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using grad_proj_api.Dtos;
using grad_proj_api.Exceptions;
using grad_proj_api.Helpers;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace grad_proj_api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/user/{userId}/photo")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;
        private readonly IMainRepository _repo;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;
        public PhotoController(IMainRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinarySettings)
        {
            _cloudinarySettings = cloudinarySettings;
            _repo = repo;
            _mapper = mapper;
            var account = new Account(_cloudinarySettings.Value.CloudName,
                _cloudinarySettings.Value.ApiKey,
                _cloudinarySettings.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);

        }

        [HttpGet("{id}", Name = nameof(GetPhoto))]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _repo.GetPhoto(id);
            var photoToReturn = _mapper.Map<PhotoToReturnDto>(photo);
            return Ok(photoToReturn);
        }

        [HttpPost("{language?}")]
        public async Task<IActionResult> AddPhotoForUser(int userId, Languages? language, [FromForm] PhotoForAddingDto photoForAddingDTO)
        {
            if (User.FindFirst(ClaimTypes.NameIdentifier) == null ||
                userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                throw new UnauthorisedException(language);

            var userFromRepo = await _repo.GetUser(userId);
            if (userFromRepo.Photo != null)
                DeletePhoto(ref userFromRepo);
            var file = photoForAddingDTO.File;
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParameters = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().
                    Width(300).
                    Height(300).
                    Crop("fill").
                    Gravity("face").
                    Quality("100")
                    };
                    uploadResult = _cloudinary.Upload(uploadParameters);

                }

            }

            var photo = _mapper.Map<Photo>(photoForAddingDTO);
            photo.UserId = userId;
            photo.PublicId = uploadResult.PublicId;
            photo.Url = uploadResult.Uri.ToString();
            photo.DateAddedUtc = DateTime.UtcNow;
            await _repo.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoToReturnDto>(photo);
                return CreatedAtAction(nameof(GetPhoto), new { userId = userId, id = photo.Id }, (photoToReturn));

            }
            throw new FailedToCreateEntityException(language);
        }

        public void DeletePhoto(ref User userFromRepo)
        {

            if (userFromRepo.Photo.PublicId != null)
            {
                var deleteParams = new DeletionParams(userFromRepo.Photo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);
                if (result.Result == "ok")
                    _repo.Delete(userFromRepo.Photo);

            }
        }

    }

}