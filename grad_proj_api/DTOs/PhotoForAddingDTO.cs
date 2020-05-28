using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace grad_proj_api.Dtos
{
    public class PhotoForAddingDto
    {

        [Required]
        public IFormFile File { get; set; }
    }
}