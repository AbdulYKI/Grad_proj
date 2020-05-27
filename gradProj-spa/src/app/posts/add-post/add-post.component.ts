import { Subject } from "rxjs";
import { AlertifyService } from "./../../services/alertify.service";
import { AuthService } from "./../../services/auth.service";
import { LanguageEnum } from "../../helper/enums/language.enum";
import { SharedService } from "../../services/shared.service";
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewChecked,
  OnDestroy,
  Output,
  EventEmitter,
} from "@angular/core";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Post } from "../../models/post";
import { NgForm } from "@angular/forms";
import { PostService } from "src/app/services/post.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-add-post",
  templateUrl: "./add-post.component.html",
  styleUrls: ["./add-post.component.css"],
})
export class AddPostComponent implements OnInit, OnDestroy {
  @ViewChild("tinymce") tinymce: any;
  @ViewChild("postForm") postForm: NgForm;
  @Output() editorClosedEvent = new EventEmitter<boolean>();

  html = ``;
  post: Post = new Post();
  config: any = {
    width: "100%",
    base_url: "/tinymce",
    suffix: ".min",
    plugins: `print preview
       searchreplace autolink directionality
       visualblocks visualchars
       image imagetools link media template
       codesample table charmap hr pagebreak
        nonbreaking anchor insertdatetime advlist
         lists  wordcount   textpattern preview`,
    toolbar: `formatselect | bold italic strikethrough 
    forecolor backcolor | link | alignleft aligncenter alignright alignjustify  |
     numlist bullist outdent indent  | removeformat | preview`,
    image_advtab: true,
    imagetools_toolbar:
      "rotateleft rotateright | flipv fliph | editimage imageoptions",

    content_css: [],
    directionality: "ltr",
  };
  destroy: Subject<boolean> = new Subject<boolean>();
  constructor(
    private sharedService: SharedService,
    private postService: PostService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      this.config.language = "ar";
    } else {
      this.config.language = "en_GB";
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
  hideEditor() {
    if (this.postForm.dirty) {
      if (
        confirm(this.sharedService.lexicon.preventUnsavedChangesGuardMessage)
      ) {
        this.editorClosedEvent.emit(true);
      }
    } else {
      this.editorClosedEvent.emit(false);
    }
  }
  get faPaperPlane() {
    return faPaperPlane;
  }
  get faTimes() {
    return faTimes;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }

  get editorHeaderClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "editor-header rtl";
    }
    return "editor-header";
  }
  onSubmit() {
    this.postService
      .createPost(this.authService.decodedToken.nameid, this.post)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (post: any) => {
          this.editorClosedEvent.emit(post);
          this.alertifyService.success(
            this.lexicon.postSuccessfullySubmittedMessage
          );
        },
        (error) => {
          this.alertifyService.error(this.lexicon.postFailedSubmittionMessage);
        }
      );
  }
}
