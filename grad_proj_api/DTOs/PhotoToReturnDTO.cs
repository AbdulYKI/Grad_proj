using System;

namespace grad_proj_api.Dtos {
    public class PhotoToReturnDto {

        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime DateAddedUtc { get; set; }

    }
}