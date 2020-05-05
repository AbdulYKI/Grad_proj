namespace grad_proj_api.DTOs {
    public class VoteForPostDto {
        public int PostId { get; set; }
        public int UserId { get; set; }

        public int VotesCount { get; set; }
    }
}