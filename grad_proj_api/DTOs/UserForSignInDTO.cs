using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.Dtos
{
    public class UserForSignInDto
    {

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}