using System.Threading.Tasks;
using grad_proj_api.Dtos;

namespace grad_proj_api.Interfaces
{
    public interface IChatHub
    {
        Task SendMessage(MessageForSendingDto messageForSendingDto);
        Task JoinRoom(int senderId, int recipientId);
        Task LeaveRoom(int senderId, int recipientId);
        Task NotifySenderMessageIsRead(int messageId, int senderId, int recipientId);
    }
}