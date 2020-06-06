import { takeUntil } from "rxjs/operators";
import { environment, tokenGetter } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { MessagesThreadResolverData } from "src/app/helper/resolvers-data/messages-thread-resolver-data";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  faEllipsisV,
  faVideo,
  faPhone,
  faPaperclip,
  faUserCircle,
  faBan,
  faPaperPlane,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import * as signalR from "@aspnet/signalr";
import { Subject, pipe } from "rxjs";
import { User } from "src/app/models/user";

import { LocaliseDatePipe } from "src/app/helper/pipes/localiseDate.pipe";
import { SharedService } from "src/app/services/shared.service";
import { Message } from "src/app/models/message";
import { LanguageEnum } from "src/app/helper/enums/language.enum";

@Component({
  selector: "app-message-thread",
  templateUrl: "./message-thread.component.html",
  styleUrls: ["./message-thread.component.css"],
})
export class MessageThreadComponent implements OnInit, OnDestroy {
  isActionCollapsed = false;
  connectionClosed = false;
  recipient: User;
  messagesThread: Message[];
  sender: User;
  newMessageContent = "";
  defaultMessageTextAreaHeight = "36px";
  messageTextAreaHeight = this.defaultMessageTextAreaHeight;
  localiseDatePipe = new LocaliseDatePipe();
  defaultPhotoUrl = environment.defaultPhoto;
  private hubConnection: signalR.HubConnection;
  private unSubscribe = new Subject<boolean>();
  constructor(
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data: { messagesThreadResolverData: MessagesThreadResolverData }) => {
          this.messagesThread = data.messagesThreadResolverData.messagesThread;
          this.recipient = data.messagesThreadResolverData.recipient;
          this.buildConnection();
          this.startConnection();
        }
      );
    this.sender = this.authService.currentUser;
  }

  get isInRtlMode() {
    return this.sharedService.currentLanguage.value === LanguageEnum.Arabic;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  toggleActionCollapsed() {
    this.isActionCollapsed = !this.isActionCollapsed;
  }
  get faEllipsisV() {
    return faEllipsisV;
  }
  get faVideo() {
    return faVideo;
  }
  get faPhone() {
    return faPhone;
  }
  get faPaperclip() {
    return faPaperclip;
  }
  get faPaperPlane() {
    return faPaperPlane;
  }
  get faUserCircle() {
    return faUserCircle;
  }
  get faBan() {
    return faBan;
  }
  buildConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + "chat/", {
        accessTokenFactory: () => tokenGetter(),
      })
      .build();
  }
  startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        this.joinRoom().then(() => {
          this.onRecieveMessageHandler();
          this.onRecieveNotificationHandler();
          this.onMessageSavedOnServerHandler();
          this.onClosedHandler();
          this.messagesThread.forEach((message) => {
            if (
              message.dateReadUtc == null &&
              message.senderId === this.recipient.id
            ) {
              this.notifySender(message);
            }
          });
        });
      })
      .catch((err) => console.log("Error while starting connection: " + err));
  }
  joinRoom() {
    return this.hubConnection.invoke(
      "JoinRoom",
      this.sender.id,
      this.recipient.id
    );
  }
  sendMessage() {
    const newMessage: Partial<Message> = {
      senderId: this.sender.id,
      recipientId: this.recipient.id,
      content: this.newMessageContent,
    };

    this.hubConnection
      .invoke("SendMessage", newMessage)
      .then(() => {
        this.newMessageContent = "";
        this.messageTextAreaHeight = this.defaultMessageTextAreaHeight;
      })
      .catch((err) => console.log("Error while sending messages: " + err));
  }

  onRecieveMessageHandler() {
    this.hubConnection.on("recieveMessage", (message: Message) => {
      this.notifySender(message);
      this.messagesThread.push(message);
    });
  }
  notifySender(message: Message) {
    this.hubConnection
      .invoke(
        "NotifySenderMessageIsRead",
        message.id,
        message.senderId,
        message.recipientId
      )
      .catch((err) => console.log("Error while notifying sender: " + err));
  }

  onRecieveNotificationHandler() {
    this.hubConnection.on("recieveNotification", (notification: any) => {
      const messageToEditIndex = this.messagesThread.findIndex(
        (m) => m.id === notification.id
      );
      if (messageToEditIndex !== -1) {
        this.messagesThread[messageToEditIndex].dateReadUtc =
          notification.dateReadUtc;
      }
    });
  }
  onMessageSavedOnServerHandler() {
    this.hubConnection.on("messageSavedOnServer", (message: Message) => {
      this.messagesThread.push(message);
    });
  }
  //you need to reconnect in case the connection was closed for inactivity
  onClosedHandler() {
    this.hubConnection.onclose(() => {
      if (!this.connectionClosed) {
        setTimeout(() => {
          {
            this.startConnection();
          }
        }, 2000);
      }
    });
  }
  ngOnDestroy() {
    this.hubConnection
      .invoke("LeaveRoom", this.sender.id, this.recipient.id)
      .then(() => {
        this.connectionClosed = true;
        this.hubConnection.stop();
        this.unSubscribe.next(true);
        this.unSubscribe.complete();
      })
      .catch((err) => console.log("Error while leaving room: " + err));
  }

  get localeCode() {
    return this.sharedService.localeCode;
  }
  navigateToProfile() {
    this.router.navigate(["/profile", this.recipient.id]);
  }
  get faCheck() {
    return faCheck;
  }
  transformDate(date: Date) {
    return this.localiseDatePipe.transform(
      date,
      "short",
      this.sharedService.localeCode
    );
  }
}
