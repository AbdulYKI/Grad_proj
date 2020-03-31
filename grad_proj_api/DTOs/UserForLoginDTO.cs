using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.DTOs {
    public class UserForLoginDTO {
        [Required]
        public string UsernameOrEmail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}