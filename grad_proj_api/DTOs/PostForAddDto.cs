using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using grad_proj_api.Helpers;

namespace grad_proj_api.Dtos
{
    public class PostForAddDto
    {
        [Required]
        [MinLength(20)]
        [MaxLength(400)]
        public string Title { get; set; }

        [Required]
        [CustomValidation(typeof(Extension), nameof(Extension.ValidateContent))]
        public string Content { get; set; }

    }
}