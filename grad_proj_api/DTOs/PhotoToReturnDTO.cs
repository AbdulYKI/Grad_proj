using System;

namespace grad_proj_api.DTOs {
    public class PhotoToReturnDTO {

        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime DateAddedUTC { get; set; }

    }
}