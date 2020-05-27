import { MessageListPaginationParams } from "src/app/helper/pagination/message-list-pagination-params";
import { paginationDefaults } from "./../app/helper/pagination/pagination-defaults.constants";
import { MessageService } from "./../app/services/message.service";
import { AuthService } from "../app/services/auth.service";
import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Message } from "src/app/models/message";
import { PaginationResult } from "src/app/helper/pagination/pagination-result";
import { AlertifyService } from "src/app/services/alertify.service";
import {
  MessageContainer,
  OrderMessagesBy,
} from "src/app/helper/enums/pagination-params-enums.enum";

@Injectable()
export class MessagesListResovler
  implements Resolve<PaginationResult<Message[]>> {
  pageSize = paginationDefaults.postsPaginationPageSize;
  pageNumber = 1;
  paginationParams: MessageListPaginationParams = new MessageListPaginationParams();

  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.paginationParams.messageContainer =
      MessageContainer.LastRecievedFromEachUser;
    this.paginationParams.orderBy = OrderMessagesBy.Latest;
  }

  resolve(
    snapShot: ActivatedRouteSnapshot
  ): Observable<PaginationResult<Message[]>> {
    return this.messageService
      .getMessagesForList(
        this.authService.decodedToken.nameid as number,
        this.pageSize,
        this.pageNumber,
        this.paginationParams
      )
      .pipe(
        catchError((error) => {
          this.alertifyService.error("Problem in retreving messages");
          this.router.navigate(["/home"]);
          return of(null);
        })
      );
  }
}
