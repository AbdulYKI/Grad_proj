using System;

namespace grad_proj_api.Dtos {
    public class UserForListDto {
        public int Id { get; set; }
        public string Username { get; set; }

        public int? Age { get; set; }

        public DateTime LastActiveUtc { get; set; }

        public string Country { get; set; }
        public string PhotoUrl { get; set; }

    }
}