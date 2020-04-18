import { LanguageEnum } from "./../helper/language.enum";
import { SharedService } from "./../services/shared.service";
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewChecked,
  OnDestroy,
} from "@angular/core";

@Component({
  selector: "app-text-editor",
  templateUrl: "./text-editor.component.html",
  styleUrls: ["./text-editor.component.css"],
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @ViewChild("tinymce") tinymce: any;
  html = ``;
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
}
