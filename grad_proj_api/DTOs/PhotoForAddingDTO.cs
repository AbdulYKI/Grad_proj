using System;
using Microsoft.AspNetCore.Http;

namespace grad_proj_api.DTOs {
    public class PhotoForAddingDTO {
        public string Url { get; set; }
        public string PublicId { get; set; }
        public IFormFile File { get; set; }
        public DateTime DateAddedUTC { get; set; }
        public PhotoForAddingDTO () {
            DateAddedUTC = DateTime.UtcNow;
        }
    }
}