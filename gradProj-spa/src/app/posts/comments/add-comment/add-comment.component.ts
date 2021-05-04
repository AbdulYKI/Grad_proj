import { AlertifyService } from "./../../../services/alertify.service";
import { Comment } from "./../../../models/comment";
import { AuthService } from "./../../../services/auth.service";
import { CommentService } from "./../../../services/comment.service";
import { environment } from "src/environments/environment";
import { SharedService } from "./../../../services/shared.service";
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Patterns } from "src/app/helper/validation/patterns";

@Component({
  selector: "app-add-comment",
  templateUrl: "./add-comment.component.html",
  styleUrls: ["./add-comment.component.css"],
})
export class AddCommentComponent implements OnInit {
  @Input() postId: number;
  @ViewChild("tinymce") tinymce: any;
  comment: Comment;
  oldContentBeforeRefresh = "";
  @Output() newCommentAdded = new EventEmitter();
  isLoading = false;
  config: any = {
    width: "100%",
    base_url: "/tinymce",
    suffix: ".min",
    // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
    plugins:
      // tslint:disable-next-line: max-line-length
      "print preview  searchreplace autolink directionality visualblocks visualchars  image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists  wordcount   textpattern preview",
    toolbar:
      // tslint:disable-next-line: max-line-length
      "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | preview",
    image_advtab: true,
    imagetools_toolbar:
      "rotateleft rotateright | flipv fliph | editimage imageoptions",

    content_css: [],
    directionality: "ltr",
  };
  constructor(
    private sharedService: SharedService,
    private commentService: CommentService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {
    this.comment = new Comment();
  }
  refreshEditor() {
    this.oldContentBeforeRefresh = this.comment.content;
    this.isLoading = true;
    setTimeout(() => {
      this.comment.content = this.oldContentBeforeRefresh;
      this.isLoading = false;
    }, 500);
    if (this.sharedService.LanguageSubject.value === LanguageEnum.Arabic) {
      this.config.language = "ar";
    } else {
      this.config.language = "en_GB";
    }
  }
  get loadingSvgPath() {
    return environment.editorLoadingSvg;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get faPaperPlane() {
    return faPaperPlane;
  }

  get containerClasses() {
    if (this.sharedService.LanguageSubject.value === LanguageEnum.Arabic) {
      return "container add-comment-card  card rtl mt-2";
    }
    return "container add-comment-card card mt-2";
  }

  ngOnInit(): void {
    this.sharedService.LanguageSubject.subscribe(() => {
      this.refreshEditor();
    });
  }
  createComment() {
    this.commentService
      .createComment(
        this.authService.decodedToken.nameid,
        this.postId,
        this.comment
      )
      .subscribe(
        () => {
          this.alertifyService.success(
            this.lexicon.commentSuccessfullySubmittedMessege
          );
          this.newCommentAdded.emit();
          this.comment.content = "";
        },
        (error) => {
          this.alertifyService.error(
            this.lexicon.commentFailedSubmittionMessage
          );
        }
      );
  }
  emptyEditorCheck() {
    if (this.comment.content === "") {
      return true;
    }
    return Patterns.emptyEditorPattern.test(this.comment.content);
  }
  signedIn() {
    return this.authService.signedIn();
  }
}
