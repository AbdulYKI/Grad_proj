using System;
using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.Dtos {
    public class PostForAddDto {
        [Required]
        [MinLength (40)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime DateAddedUtc { get; set; }
        public PostForAddDto () {
            DateAddedUtc = DateTime.UtcNow;
        }
    }
}