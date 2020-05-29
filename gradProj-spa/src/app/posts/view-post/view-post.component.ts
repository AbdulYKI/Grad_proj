import { paginationDefaults } from "./../../helper/pagination/pagination-defaults.constants";
import { CommentService } from "src/app/services/comment.service";
import { Pagination } from "./../../helper/pagination/pagination";
import { Comment } from "./../../models/comment";
import { ViewPostResolverData } from "../../helper/resolvers-data/view-post-resolver-data";
import { element } from "protractor";
import { Patterns } from "../../helper/validation/patterns";
import { AlertifyService } from "./../../services/alertify.service";
import { PostService } from "src/app/services/post.service";
import { AuthService } from "./../../services/auth.service";
import { LocaliseDatePipe } from "../../helper/pipes/localiseDate.pipe";
import { SharedService } from "./../../services/shared.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { Post } from "src/app/models/post";
import {
  faSortUp,
  faSortDown,
  faStar,
  faCalendarAlt,
  faEye,
  faChevronLeft,
  faChevronRight,
  faEdit,
  faUndo,
  faSave,
  faShareAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
import { environment } from "src/environments/environment";
import { EditorComponent } from "@tinymce/tinymce-angular";
@Component({
  selector: "app-view-post",
  templateUrl: "./view-post.component.html",
  styleUrls: ["./view-post.component.css"],
})
export class ViewPostComponent implements OnInit {
  @ViewChild("tinymce") tinymce: EditorComponent;
  defaulPhotoUrl: string = environment.defaultPhoto;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private authService: AuthService,
    private postService: PostService,
    private alertifyService: AlertifyService,
    private commentService: CommentService,
    private router: Router
  ) {}
  loadingDivHeight: string;
  loadingDivWidth: string;
  post: Post;
  comments: Comment[];
  commentsPagination: Pagination;
  isLoading = false;
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
  ngOnInit(): void {
    this.route.data.subscribe(
      (data: { viewPostResolverData: ViewPostResolverData }) => {
        this.post = data.viewPostResolverData.post;
        this.comments =
          data.viewPostResolverData.commentsPaginationResult.result;
        this.commentsPagination =
          data.viewPostResolverData.commentsPaginationResult.pagination;
        this.contentBeforeEdit = this.post.content;
      }
    );
    this.sharedService.currentLanguage.subscribe(() => this.refreshEditor());
  }
  emptyEditorCheck() {
    if (this.post.content === "") {
      return true;
    }
    return Patterns.emptyEditorPattern.test(this.post.content);
  }
  get faSortUp() {
    return faSortUp;
  }
  get faSortDown() {
    return faSortDown;
  }
  get fastar() {
    return faStar;
  }
  get faCalender() {
    return faCalendarAlt;
  }
  get faEye() {
    return faEye;
  }
  get faChevron() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return faChevronRight;
    }
    return faChevronLeft;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get faEdit() {
    return faEdit;
  }
  get faSave() {
    return faSave;
  }
  get faShareAlt() {
    return faShareAlt;
  }
  get faTriangle() {
    return faExclamationTriangle;
  }
  get containerClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "container post-padding rtl";
    }
    return "container post-padding";
  }
  get localeCode() {
    return this.sharedService.localeCode;
  }

  get faUndo() {
    return faUndo;
  }
  checkPostOwnership() {
    if (this.signedIn()) {
      return (
        this.post.userId ===
        Number.parseInt(this.authService.decodedToken.nameid)
      );
    }
    return false;
  }
  enterEditMode() {
    this.config.toolbar = this.toolbarsForEditMode;
    this.config.menubar = true;
    this.isInEditMode = true;
    this.contentBeforeEdit = this.post.content;
    this.refreshEditor();
  }
  submitEditedPost() {
    this.postService
      .updatePost(this.authService.decodedToken.nameid, this.post.id, this.post)
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

  cancelEditMode() {
    this.isInEditMode = false;
    this.config.toolbar = "";
    this.config.menubar = false;
    this.refreshEditor();
  }

  refreshEditor() {
    if (
      this.tinymce?.editor.editorContainer.clientHeight !== undefined &&
      this.tinymce?.editor.editorContainer.clientHeight != null &&
      this.tinymce?.editor.editorContainer.clientWidth !== undefined &&
      this.tinymce?.editor.editorContainer.clientWidth !== null
    ) {
      this.loadingDivHeight =
        this.tinymce?.editor.editorContainer.clientHeight + "px";
      this.loadingDivWidth =
        this.tinymce?.editor.editorContainer.clientWidth + "px";
    }

    this.getPost();
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      this.config.language = "ar";
    } else {
      this.config.language = "en_GB";
    }
  }
  get loadingSvgPath() {
    return environment.editorLoadingSvg;
  }

  signedIn() {
    return this.authService.signedIn();
  }
  commentsPageChange(pageNumber: number) {
    this.commentService
      .getComments(
        this.post.id,
        paginationDefaults.commentsPaginationPageSize,
        pageNumber
      )
      .subscribe((commentsPaginationResult) => {
        this.comments = commentsPaginationResult.result;
        this.commentsPagination = commentsPaginationResult.pagination;
      });
  }
  getPost() {
    this.isLoading = true;
    this.postService.getPost(this.post.id).subscribe((post) => {
      const currentContent = this.post.content;
      this.post = post;
      if (this.isInEditMode) {
        this.post.content = currentContent;
      }
      this.isLoading = false;
    });
  }

  createDownVote() {
    if (!this.signedIn()) {
      this.router.navigate(["/sign-in"]);
    }
    this.postService
      .createDownVote(this.authService.decodedToken.nameid, this.post.id)
      .subscribe(
        () => {
          this.getPost();
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
    this.postService
      .createUpVote(this.authService.decodedToken.nameid, this.post.id)
      .subscribe(
        () => {
          this.getPost();
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
    this.postService
      .deleteUpVote(this.authService.decodedToken.nameid, this.post.id)
      .subscribe(
        () => {
          this.getPost();
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
    this.postService
      .deleteDownVote(this.authService.decodedToken.nameid, this.post.id)
      .subscribe(
        () => {
          this.getPost();
        },
        (error) => {
          console.log(error);
          this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
        }
      );
  }
}
