using System;
using System.Collections.Generic;

namespace grad_proj_api.Models {
    public class Post {

        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public User Admin { get; set; }
        public int? AdminId { get; set; }
        public ICollection<ViewedPost> PostViewers { get; set; }
        public ICollection<UpVotedPost> PostUpVoters { get; set; }
        public ICollection<DownVotedPost> PostDownVoters { get; set; }

        public DateTime DateAddedUtc { get; set; }

        public ICollection<Comment> Comments { get; set; }

        public DateTime? DateEditedUtc { get; set; }
    }
}