import { Router } from "@angular/router";
import { SharedService } from "./../../../services/shared.service";
import { AlertifyService } from "./../../../services/alertify.service";
import { Comment } from "./../../../models/comment";
import { Component, OnInit, Input } from "@angular/core";
import {
  faSortUp,
  faSortDown,
  faStar,
  faUndo,
  faEdit,
  faCalendarAlt,
  faShareAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Patterns } from "src/app/helper/validation/patterns";
import { AuthService } from "src/app/services/auth.service";
import { CommentService } from "src/app/services/comment.service";
import { environment } from "src/environments/environment";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
@Component({
  selector: "app-comment-card",
  templateUrl: "./comment-card.component.html",
  styleUrls: ["./comment-card.component.css"],
})
export class CommentCardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private commentService: CommentService,
    private alertifyService: AlertifyService,
    private sharedService: SharedService,
    private router: Router
  ) {}
  @Input() comment: Comment;
  isLoading = false;
  contentBeforeRefresh = "";
  contentBeforeEdit: string;
  toolbarsForEditMode =
    // tslint:disable-next-line: max-line-length
    "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | preview";
  isInEditMode = false;
  config: any = {
    width: "100%",
    base_url: "/tinymce",
    suffix: ".min",
    plugins:
      // tslint:disable-next-line: max-line-length
      "print preview autoresize searchreplace autolink directionality visualblocks visualchars  image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists  wordcount   textpattern preview",
    content_css: [],
    toolbar: "",
    directionality: "ltr",
    menubar: false,
    statusbar: false,
  };

  ngOnInit(): void {}

  get faSortUp() {
    return faSortUp;
  }
  get faSortDown() {
    return faSortDown;
  }
  get fastar() {
    return faStar;
  }
  get faUndo() {
    return faUndo;
  }
  checkCommentOwnership() {
    if (this.signedIn()) {
      return (
        this.comment.userId ===
        Number.parseInt(this.authService.decodedToken.nameid)
      );
    }
    return false;
  }
  enterEditMode() {
    this.config.toolbar = this.toolbarsForEditMode;
    this.config.menubar = true;
    this.isInEditMode = true;
    this.refreshEditor();
  }
  submitEditedComment() {
    this.commentService
      .editComment(
        this.authService.decodedToken.nameid,
        this.comment.id,
        this.comment
      )
      .subscribe(
        () => {
          this.alertifyService.success("Your Editing Has Been Saved");
          this.cancelEditMode();
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
  }
  refreshEditor() {
    this.getComment();
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      this.config.language = "ar";
    } else {
      this.config.language = "en_GB";
    }
  }
  get loadingSvgPath() {
    return environment.editorLoadingSvg;
  }
  cancelEditMode() {
    this.isInEditMode = false;
    this.config.toolbar = "";
    this.config.menubar = false;
    this.refreshEditor();
  }
  signedIn() {
    return this.authService.signedIn();
  }
  emptyEditorCheck() {
    if (this.comment.content === "") {
      return true;
    }
    return Patterns.emptyEditorPattern.test(this.comment.content);
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get containerClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "container post-padding rtl";
    }
    return "container post-padding";
  }
  get faEdit() {
    return faEdit;
  }
  get faCalender() {
    return faCalendarAlt;
  }
  get localeCode() {
    return this.sharedService.localeCode;
  }

  createDownVote() {
    if (!this.signedIn()) {
      this.router.navigate(["/sign-in"]);
    }
    this.commentService
      .createDownVote(this.authService.decodedToken.nameid, this.comment.id)
      .subscribe(
        () => {
          this.getComment();
        },
        (error) => {
          console.log(error);
          this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
        }
      );
  }

  createUpVote() {
    if (!this.signedIn()) {
      this.router.navigate(["/sign-in"]);
    }
    this.commentService
      .createUpVote(this.authService.decodedToken.nameid, this.comment.id)
      .subscribe(
        (c) => {
          this.getComment();
        },
        (error) => {
          console.log(error);
          this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
        }
      );
  }

  deleteUpVote() {
    if (!this.signedIn()) {
      this.router.navigate(["/sign-in"]);
    }
    this.commentService
      .deleteUpVote(this.authService.decodedToken.nameid, this.comment.id)
      .subscribe(
        () => {
          this.getComment();
        },
        (error) => {
          console.log(error);
          this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
        }
      );
  }
  deleteDownVote() {
    if (!this.signedIn()) {
      this.router.navigate(["/sign-in"]);
    }
    this.commentService
      .deleteDownVote(this.authService.decodedToken.nameid, this.comment.id)
      .subscribe(
        () => {
          this.getComment();
        },
        (error) => {
          console.log(error);
          this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
        }
      );
  }

  getComment() {
    this.isLoading = true;
    this.commentService
      .getComment(this.comment.postId, this.comment.id)
      .subscribe((comment) => {
        const currentContent = this.comment.content;
        this.comment = comment;
        if (this.isInEditMode) {
          this.comment.content = currentContent;
        }
        this.isLoading = false;
      });
  }
  get faShareAlt() {
    return faShareAlt;
  }
  get faTriangle() {
    return faExclamationTriangle;
  }
}
