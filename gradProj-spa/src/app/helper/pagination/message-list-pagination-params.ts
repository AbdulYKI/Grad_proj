import {
  MessageContainer,
  OrderMessagesBy,
} from "./../enums/pagination-params-enums.enum";
export class MessageListPaginationParams {
  messageContainer: MessageContainer;
  orderBy: OrderMessagesBy;
}
