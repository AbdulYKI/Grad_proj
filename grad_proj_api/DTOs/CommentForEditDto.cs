using System;
using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.DTOs {
    public class CommentForEditDto {

        [Required]
        public string Content { get; set; }
        public DateTime DateEditedUtc { get; set; }
        public CommentForEditDto () {
            DateEditedUtc = DateTime.UtcNow;
        }

    }
}