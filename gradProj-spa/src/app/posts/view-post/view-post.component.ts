import { LocaliseDatePipe } from "./../../helper/localiseDate.pipe";
import { SharedService } from "./../../services/shared.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Post } from "src/app/models/post";
import {
  faSortUp,
  faSortDown,
  faStar,
  faCalendarAlt,
  faEye,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "src/app/helper/language.enum";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-view-post",
  templateUrl: "./view-post.component.html",
  styleUrls: ["./view-post.component.css"],
})
export class ViewPostComponent implements OnInit {
  defaulPhotoUrl: string = environment.defaultPhoto;
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}
  post: Post;
  config: any = {
    width: "100%",
    base_url: "/tinymce",
    suffix: ".min",
    plugins:
      // tslint:disable-next-line: max-line-length
      "print preview  autoresize searchreplace autolink directionality visualblocks visualchars  image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists  wordcount   textpattern preview",
    content_css: [],
    directionality: "ltr",
    toolbar: false,
    menubar: false,
    statusbar: false,
  };
  ngOnInit(): void {
    this.route.data.subscribe((data: { post: Post }) => {
      this.post = data.post;
    });
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
  get containerClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "container pd-post rtl";
    }
    return "container pd-post";
  }
  get localeCode() {
    return this.sharedService.localeCode;
  }
}
