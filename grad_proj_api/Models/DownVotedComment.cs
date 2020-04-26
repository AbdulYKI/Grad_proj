namespace grad_proj_api.Models {
    public class DownVotedComment {

        public Comment Comment { get; set; }
        public int CommentId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
    }
}