import { LanguageEnum } from "../../helper/language.enum";
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
    height: "80vh",
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

  constructor(private sharedService: SharedService) {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      this.config.language = "ar";
    } else {
      this.config.language = "en_GB";
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    console.log(this.tinymce);
  }
  hideEditor() {
    if (this.postForm.dirty) {
      if (
        confirm(this.sharedService.Lexicon.preventUnsavedChangesGuardMessage)
      ) {
        this.editorClosedEvent.emit();
      }
    } else {
      this.editorClosedEvent.emit();
    }
  }
  get FaPaperPlane() {
    return faPaperPlane;
  }
  get FaTimes() {
    return faTimes;
  }
  get Lexicon() {
    return this.sharedService.Lexicon;
  }

  get EditorHeaderClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "editor-header rtl";
    }
    return "editor-header";
  }
  onSubmit() {
    console.log(this.postForm.dirty);
  }
}
