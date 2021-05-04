import { AlertifyService } from "src/app/services/alertify.service";
import { DeleteMessageConfirmationModalComponent } from "./delete-message-confirmation-modal/delete-message-confirmation-modal.component";
import { AuthService } from "./../../services/auth.service";
import { MessageService } from "./../../services/message.service";
import { environment } from "./../../../environments/environment";
import { PaginationResult } from "./../../helper/pagination/pagination-result";
import { ActivatedRoute } from "@angular/router";
import { Pagination } from "./../../helper/pagination/pagination";
import { SharedService } from "./../../services/shared.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MessageListPaginationParams } from "src/app/helper/pagination/message-list-pagination-params";
import { MessageContainer } from "src/app/helper/enums/pagination-params-enums.enum";
import { takeUntil } from "rxjs/operators";
import { Message } from "src/app/models/message";
import { Subject } from "rxjs";
import { paginationDefaults } from "src/app/helper/pagination/pagination-defaults.constants";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
import {
  faEnvelope,
  faEnvelopeOpen,
  faPlane,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-messages-list",
  templateUrl: "./messages-list.component.html",
  styleUrls: ["./messages-list.component.css"],
})
export class MessagesListComponent implements OnInit, OnDestroy {
  defaultPhoto = environment.defaultPhoto;
  pagination: Pagination;
  destroy: Subject<boolean> = new Subject<boolean>();
  messages: Message[] = [];
  paginationParameters: MessageListPaginationParams = new MessageListPaginationParams();
  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private alertifyService: AlertifyService,
    private messageService: MessageService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    this.paginationParameters.messageContainer =
      MessageContainer.LastRecievedFromEachUser;
  }
  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (data: { messagesListResolverData: PaginationResult<Message[]> }) => {
          this.messages = data.messagesListResolverData.result;
          this.pagination = data.messagesListResolverData.pagination;
        }
      );
  }
  changeMessageContainer(messageContainer: MessageContainer) {
    this.paginationParameters.messageContainer = messageContainer;
    this.loadMessages();
  }
  get localeCode() {
    return this.sharedService.localeCode;
  }
  get MessageContainer() {
    return MessageContainer;
  }
  loadMessages() {
    this.messageService
      .getMessagesForList(
        this.authService.decodedToken.nameid as number,
        paginationDefaults.messagesListPaginationPageSize,
        this.pagination.currentPage,
        this.paginationParameters
      )
      .subscribe((paginationResult) => {
        this.messages = paginationResult.result;
        this.pagination = paginationResult.pagination;
      });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
  deleteMessage(messageId: number): void {
    this.modalService
      .open(DeleteMessageConfirmationModalComponent)
      .result.then(() => {
        this.messageService
          .deleteMessage(messageId, this.authService.decodedToken.nameid)
          .subscribe(() => {
            this.alertifyService.success(
              this.lexicon.messageDeletedSuccessfullyText
            );
            this.loadMessages();
          });
      });
  }

  pageChange(pageNumber: number) {
    this.pagination.currentPage = pageNumber;
    this.loadMessages();
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  isInRtl() {
    return this.sharedService.LanguageSubject.value === LanguageEnum.Arabic;
  }
  get faEnvelope() {
    return faEnvelope;
  }
  get faEnvelopeOpen() {
    return faEnvelopeOpen;
  }
  get faPaperPlane() {
    return faPaperPlane;
  }
  get faUser() {
    return faUser;
  }
}
