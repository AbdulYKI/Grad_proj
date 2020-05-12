import { MessageContainer } from "./../enums/pagination-params-enums.enum";
import { PaginationParams } from "./pagination-params";
export class MessageThreadPaginationParams extends PaginationParams {
  messageContainer: MessageContainer;
}
