using System;
using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.DTOs {
    public class CommentForAddDto {
        [Required]
        public int CommentId { get; set; }

        [Required]
        public string Content { get; set; }
        public DateTime DateAddedUtc { get; set; }
        public CommentForAddDto () {
            DateAddedUtc = DateTime.UtcNow;
        }
    }
}