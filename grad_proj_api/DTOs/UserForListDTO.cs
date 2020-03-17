using System;

namespace grad_proj_api.DTOs {
    public class UserForListDTO {
        public int Id { get; set; }
        public string Username { get; set; }

        public int? Age { get; set; }

        public DateTime LastActiveUTC { get; set; }

        public string Country { get; set; }
        public string PhotoUrl { get; set; }

    }
}