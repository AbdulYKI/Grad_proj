using System;

namespace grad_proj_api.Models {
    public class Photo {
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime DateAddedUtc { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }

    }
}