using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.DTOs
{
    public class UserForLoginDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}