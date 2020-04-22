using System;

namespace grad_proj_api.Dtos {
    public class postToReturnDto {

        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime DateAddedUtc { get; set; }
        public int CreatorId { get; set; }
        public string CreatorPhotoUrl { get; set; }
        public string CreatorUserName { get; set; }
        public int Id { get; set; }
        public int UpVotesCount { get; set; }
        public int DownVotesCount { get; set; }
        public int ViewersCount { get; set; }

    }
}