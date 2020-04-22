namespace grad_proj_api.Models {
    public class UpVotedPost {

        public Post Post { get; set; }
        public int PostId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
    }
}