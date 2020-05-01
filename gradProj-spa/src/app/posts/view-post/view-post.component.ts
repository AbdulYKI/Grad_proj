import { Patterns } from "../../helper/validation/patterns";
import { AlertifyService } from "./../../services/alertify.service";
import { PostService } from "src/app/services/post.service";
import { AuthService } from "./../../services/auth.service";
import { LocaliseDatePipe } from "../../helper/pipes/localiseDate.pipe";
import { SharedService } from "./../../services/shared.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
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
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-view-post",
  templateUrl: "./view-post.component.html",
  styleUrls: ["./view-post.component.css"],
})
export class ViewPostComponent implements OnInit {
  defaulPhotoUrl: string = environment.defaultPhoto;
  fakeComment = {
    content: "new comment",
    dateEditedUtc: null,
    dateAddedUtc: "2020-04-30T14:59:58.6989271Z",
    id: 8,
    userId: 2,
    username: "username1234",
    userPhotoUrl:
      "http://res.cloudinary.com/da57tn2gm/image/upload/v1588097061/uxf2ij9vf2hcdic44kky.jpg",
    votesCount: 0,
  };
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private authService: AuthService,
    private postService: PostService,
    private alertifyService: AlertifyService
  ) {}
  post: Post;
  loadingFlag = false;
  contentBeforeRefresh = "";
  contentBeforeEdit: string;
  toolbarsForEditMode =
    // tslint:disable-next-line: max-line-length
    "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | preview";
  inEditModeFlag = false;
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
    this.route.data.subscribe((data: { post: Post }) => {
      this.post = data.post;
      this.contentBeforeEdit = this.post.content;
    });
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
    this.inEditModeFlag = true;
    this.contentBeforeEdit = this.post.content;
    this.refreshEditor();
  }
  submitEditedPost() {
    this.postService
      .updatePost(this.authService.decodedToken.nameid, this.post.id, this.post)
      .subscribe(
        () => {
          this.alertifyService.success("Your Editing Has Been Saved");
          this.cancelEditMode(false);
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
  }
  refreshEditor() {
    this.contentBeforeRefresh = this.post.content;
    this.loadingFlag = true;
    setTimeout(() => {
      this.post.content = this.contentBeforeRefresh;
      this.loadingFlag = false;
      console.log(this.config);
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
  cancelEditMode(revertToOldContent: boolean) {
    if (revertToOldContent) {
      this.post.content = this.contentBeforeEdit;
    }
    this.inEditModeFlag = false;
    this.config.toolbar = "";
    this.config.menubar = false;
    this.refreshEditor();
  }
  signedIn() {
    return this.authService.signedIn();
  }
}
