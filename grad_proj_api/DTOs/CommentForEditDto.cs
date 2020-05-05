using System;
using System.ComponentModel.DataAnnotations;
using grad_proj_api.Helpers;

namespace grad_proj_api.DTOs {
    public class CommentForEditDto {

        [Required]
        [CustomValidation (typeof (Extension), nameof (Extension.ValidateContent))]
        public string Content { get; set; }

    }
}