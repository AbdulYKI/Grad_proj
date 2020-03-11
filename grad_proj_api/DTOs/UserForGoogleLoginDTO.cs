namespace grad_proj_api.DTOs
{
    public class UserForGoogleLoginDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdToken { get; set; }
        public string PhotoUrl { get; set; }
        public string Email { get; set; }

    }
}