using System;

namespace grad_proj_api.Dtos
{
    public class MessageForSendingDto
    {
        public int SenderId { get; set; }

        public int RecipientId { get; set; }

        public string Content { get; set; }

    }
}