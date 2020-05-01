using System;
using System.ComponentModel.DataAnnotations;
using grad_proj_api.Helpers;

namespace grad_proj_api.DTOs {
    public class CommentForAddDto {
        [Required]
        public int CommentId { get; set; }

        [Required]
        [CustomValidation (typeof (Extension), nameof (Extension.ValidateContent))]
        public string Content { get; set; }
        public DateTime DateAddedUtc { get; set; }
        public CommentForAddDto () {
            DateAddedUtc = DateTime.UtcNow;
        }
    }
}