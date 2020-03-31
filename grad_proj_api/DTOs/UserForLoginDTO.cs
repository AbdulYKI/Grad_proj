using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.DTOs
{
    public class UserForLoginDTO
    {

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}