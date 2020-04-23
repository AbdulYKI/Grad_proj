using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace grad_proj_api.Dtos {
    public class PhotoForAddingDto {

        [Required]
        public IFormFile File { get; set; }
        public DateTime DateAddedUtc { get; set; }
        public PhotoForAddingDto () {
            DateAddedUtc = DateTime.UtcNow;
        }
    }
}