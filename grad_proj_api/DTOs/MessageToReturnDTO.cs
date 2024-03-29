using System;

namespace grad_proj_api.Dtos {
    public class MessageToReturnDto {
        public int Id { get; set; }

        public int SenderId { get; set; }

        public string SenderKnownAs { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string RecipientKnownAs { get; set; }
        public string RecipientPhotoUrl { get; set; }
        public int RecipientId { get; set; }

        public string Content { get; set; }

        public bool IsRead { get; set; }

        public DateTime? DateReadUtc { get; set; }

        public DateTime MessageSentUtc { get; set; }

    }
}