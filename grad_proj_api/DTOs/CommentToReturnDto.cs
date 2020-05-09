using System;

namespace grad_proj_api.Dtos
{
    public class CommentToReturnDto
    {

        public string Content { get; set; }
        public DateTime? DateEditedUtc { get; set; }
        public DateTime DateAddedUtc { get; set; }
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Username { get; set; }
        public string UserPhotoUrl { get; set; }

        public int VotesCount { get; set; }

        public bool IsUpVotedByUser { get; set; }
        public bool IsDownVotedByUser { get; set; }

        public int PostId { get; set; }

    }
}