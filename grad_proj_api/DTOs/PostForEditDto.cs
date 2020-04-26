using System;
using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.DTOs {
    public class PostForEditDto {

        [Required]
        [MinLength (20)]
        [MaxLength (400)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime DateEditedUtc { get; set; }
        public PostForEditDto () {
            DateEditedUtc = DateTime.UtcNow;
        }
    }
}