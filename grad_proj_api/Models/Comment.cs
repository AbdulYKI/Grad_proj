using System;
using System.Collections.Generic;

namespace grad_proj_api.Models {
    public class Comment {
        public int Id { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public DateTime DateAddedUtc { get; set; }
        public string Content { get; set; }

        public Post Post { get; set; }
        public int PostId { get; set; }

        public ICollection<UpVotedComment> UpVoters { get; set; }

        public ICollection<DownVotedComment> DownVoters { get; set; }

        public DateTime? DateEditedUtc { get; set; }

    }
}