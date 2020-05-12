import { User } from "src/app/models/user";
import { Message } from "src/app/models/message";

export class MessagesThreadResolverData {
  recipient: User;
  messagesThread: Message[];

  constructor(recipient: User, messagesThread: Message[]) {
    this.recipient = recipient;
    this.messagesThread = messagesThread;
  }
}
