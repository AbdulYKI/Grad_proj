using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.DTOs
{
    public class UserForSignInDTO
    {

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}