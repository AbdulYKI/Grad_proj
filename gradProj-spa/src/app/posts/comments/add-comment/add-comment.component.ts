import { AlertifyService } from "./../../../services/alertify.service";
import { Comment } from "./../../../models/comment";
import { AuthService } from "./../../../services/auth.service";
import { CommentService } from "./../../../services/comment.service";
import { environment } from "src/environments/environment";
import { SharedService } from "./../../../services/shared.service";
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { LanguageEnum } from "src/app/helper/language.enum";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-add-comment",
  templateUrl: "./add-comment.component.html",
  styleUrls: ["./add-comment.component.css"],
})
export class AddCommentComponent implements OnInit {
  @Input() postId: number;
  @ViewChild("tinymce") tinymce: any;
  comment: Comment;
  oldContent = "";
  loadingFlag = true;
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
    this.oldContent = this.comment.content;
    this.loadingFlag = false;
    setTimeout(() => {
      this.comment.content = this.oldContent;
      this.loadingFlag = true;
    }, 500);
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
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
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "add-comment-card  card rtl mt-2";
    }
    return "add-comment-card card mt-2";
  }

  ngOnInit(): void {
    this.sharedService.currentLanguage.subscribe(() => {
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
          this.alertifyService.success("comment added");
        },
        (error) => {
          this.alertifyService.error("error");
        }
      );
  }
}
