import { takeUntil } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { MessagesThreadResolverData } from "src/app/helper/resolvers-data/messages-thread-resolver-data";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  faEllipsisV,
  faVideo,
  faPhone,
  faPaperclip,
  faUserCircle,
  faBan,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { SharedService } from "../services/shared.service";
import { LanguageEnum } from "../helper/enums/language.enum";
import { User } from "../models/user";
import { Message } from "../models/message";
import * as signalR from "@aspnet/signalr";
import { Subject, pipe } from "rxjs";
import { tokenGetter } from "../app.module";
@Component({
  selector: "app-message-card",
  templateUrl: "./message-card.component.html",
  styleUrls: ["./message-card.component.css"],
})
export class MessageCardComponent implements OnInit, OnDestroy {
  isActionCollapsed = false;
  recipient: User;
  messagesThread: Message[];
  sender: User;
  newMessageContent = "";
  defaultPhotoUrl = environment.defaultPhoto;
  private hubConnection: signalR.HubConnection;
  private unSubscribe = new Subject<void>();
  constructor(
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data: { messagesThreadResolverData: MessagesThreadResolverData }) => {
          this.messagesThread = data.messagesThreadResolverData.messagesThread;
          this.recipient = data.messagesThreadResolverData.recipient;
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

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + "chat/", {
        accessTokenFactory: () => tokenGetter(),
      })
      .build();
    this.hubConnection
      .start()
      .then(() => {
        this.joinRoom().then(() => {
          this.onRecieveMessageHandler();
          this.onRecieveNotificationHandler();
          this.onMessageSavedOnServerHandler();
          this.messagesThread.forEach((message) => {
            if (message.dateRead == null) {
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
    this.newMessageContent = "";
    this.hubConnection
      .invoke("SendMessage", newMessage)
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
    this.hubConnection.on(
      "recieveNotification",
      (notification: { messageId: number; dateRead: Date }) => {
        const messageToEditIndex = this.messagesThread.findIndex(
          (m) => m.id === notification.messageId
        );
        if (messageToEditIndex !== -1) {
          this.messagesThread[messageToEditIndex].dateRead =
            notification.dateRead;
        }
      }
    );
  }
  onMessageSavedOnServerHandler() {
    this.hubConnection.on("messageSavedOnServer", (message: Message) => {
      this.messagesThread.push(message);
    });
  }
  ngOnDestroy() {
    this.hubConnection
      .invoke("LeaveRoom", this.sender.id)
      .then(() => {
        this.hubConnection.stop();
      })
      .catch((err) => console.log("Error while leaving room: " + err));

    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
