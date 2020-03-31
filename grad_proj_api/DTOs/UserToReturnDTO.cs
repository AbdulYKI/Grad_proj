using System;
using grad_proj_api.Helpers;

namespace grad_proj_api.DTOs
{
    public class UserToReturnDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }

        public GenderEnum Gender { get; set; }

        public int? Age { get; set; }

        public string KnownAs { get; set; }
        public DateTime CreatedUTC { get; set; }
        public DateTime? LastActiveUTC { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; }
    }
}