import { UserService } from "src/app/services/user.service";
import { AuthService } from "src/app/services/auth.service";
import { MessageService } from "../app/services/message.service";
import { AlertifyService } from "../app/services/alertify.service";
import { SharedService } from "../app/services/shared.service";
import { catchError, map } from "rxjs/operators";
import { Observable, of, forkJoin } from "rxjs";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";

import { User } from "src/app/models/user";
import { Message } from "src/app/models/message";
import { MessagesThreadResolverData } from "src/app/helper/resolvers-data/messages-thread-resolver-data";

@Injectable()
export class MessagesThreadResolver
  implements Resolve<MessagesThreadResolverData> {
  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private alertifyService: AlertifyService,
    private messageSerivce: MessageService,
    private userService: UserService
  ) {}

  resolve(
    snapShot: ActivatedRouteSnapshot
  ): Observable<MessagesThreadResolverData> {
    const recipientId: number = Number(snapShot.paramMap.get("recipientId"));
    const recipient: Observable<User> = this.userService
      .getUser(recipientId)
      .pipe(
        catchError((error) => {
          this.handleError();
          return of(null);
        })
      );

    const userId: number = Number(this.authService.decodedToken.nameid);
    const messagesThread = this.messageSerivce
      .getMessagesThread(userId, recipientId)
      .pipe(
        catchError((error) => {
          this.handleError();
          return of(null);
        })
      );
    const joinedResponses = forkJoin([recipient, messagesThread]).pipe(
      map((allResponses) => {
        console.log(allResponses);
        const messagesThreadResolverData = new MessagesThreadResolverData(
          allResponses[0] as User,
          allResponses[1] as Message[]
        );
        return messagesThreadResolverData;
      })
    );
    return joinedResponses;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  handleError() {
    this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
    this.router.navigate([""]);
  }
}
