using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Dtos;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.AspNetCore.SignalR;

namespace grad_proj_api.Helpers

{
    public class ChatHub : Hub
    {
        //Dictionary <groupName,<userId,connectionId>>
        private static Dictionary<string, List<UserInChatHub>> groupsDictornary = new Dictionary<string, List<UserInChatHub>>();
        private readonly IMainRepository _repo;
        private readonly IMapper _mapper;

        public ChatHub(IMapper mapper, IMainRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        public async Task SendMessage(MessageForSendingDto messageForSendingDto)
        {

            var groupName = createGroupName(messageForSendingDto.SenderId, messageForSendingDto.RecipientId);
            var nameIdentifier = Context.User.FindFirst(ClaimTypes.NameIdentifier);
            var sender = await _repo.GetUser(messageForSendingDto.SenderId);
            var recipient = await _repo.GetUser(messageForSendingDto.RecipientId);
            if (nameIdentifier == null ||
                messageForSendingDto.SenderId != int.Parse(nameIdentifier.Value) ||
                sender == null ||
                recipient == null)
                throw new Exception("unauthorized");

            var message = _mapper.Map<Message>(messageForSendingDto);
            message.MessageSentUtc = DateTime.UtcNow;
            await _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var messageToReturn = await _repo.GetMessage(message.Id);
                var messageToReturnDto = _mapper.Map<MessageToReturnDto>(messageToReturn);
                await Clients.OthersInGroup(groupName).SendAsync("recieveMessage", messageToReturnDto);
                await Clients.Caller.SendAsync("messageSavedOnServer", messageToReturnDto);
            }

        }

        public async Task JoinRoom(int senderId, int recipientId)
        {

            var groupName = createGroupName(senderId, recipientId);
            var userInGroup = new UserInChatHub() { Id = senderId, ConnectionId = Context.ConnectionId };
            if (!DoesGroupExist(groupName))
                groupsDictornary.Add(groupName, (new List<UserInChatHub>() { userInGroup }));
            else
                groupsDictornary[groupName].Add(userInGroup);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
        public async Task LeaveRoom(int senderId, int recipientId)
        {
            var groupName = createGroupName(senderId, recipientId);
            var userInGroup = new UserInChatHub() { Id = senderId, ConnectionId = Context.ConnectionId };
            groupsDictornary[groupName].Remove(userInGroup);
            if (groupsDictornary[groupName].Count == 0)
            {
                groupsDictornary.Remove(groupName);
            }
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
        public async Task NotifySenderMessageIsRead(int messageId, int senderId, int recipientId)
        {

            var message = await _repo.GetMessage(messageId);
            if (message == null)
                throw new Exception("Not Found");
            if (message.DateReadUtc == null)
            {
                message.DateReadUtc = DateTime.UtcNow;
                var groupName = createGroupName(senderId, recipientId);
                if (await _repo.SaveAll())
                {
                    var notification = new MessageReadNotification() { Id = messageId, DateReadUtc = message.DateReadUtc.Value };
                    var chatGroup = groupsDictornary[groupName];
                    var recipientConnectionIds = (from user in chatGroup where user.Id == recipientId select user.ConnectionId).ToList();
                    await Clients.GroupExcept(groupName, recipientConnectionIds).SendAsync("recieveNotification", notification);
                }
            }
        }

        private bool DoesGroupExist(string groupName)
        {
            return groupsDictornary.ContainsKey(groupName);
        }
        private string createGroupName(int senderId, int recpientId)
        {
            string groupName = "";
            if (senderId <= recpientId)
                groupName = senderId.ToString() + "|" + recpientId.ToString();
            else
                groupName = recpientId.ToString() + "|" + senderId.ToString();
            return groupName;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {

            var userGroup = groupsDictornary.FirstOrDefault(g => g.Value.Any(u => u.ConnectionId == Context.ConnectionId));
            if (!userGroup.Equals(default(KeyValuePair<string, List<UserInChatHub>>)))
            {
                var user = userGroup.Value.FirstOrDefault(u => u.ConnectionId == Context.ConnectionId);
                if (user != null)
                {
                    groupsDictornary[userGroup.Key].Remove(user);
                    if (groupsDictornary[userGroup.Key].Count == 0)
                    {
                        groupsDictornary.Remove(userGroup.Key);
                    }
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, userGroup.Key);
                }

            }

            await base.OnDisconnectedAsync(exception);

        }
    }
}