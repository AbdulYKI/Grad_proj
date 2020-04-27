import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Post } from "src/app/models/post";
import {
  faSortUp,
  faSortDown,
  faStar,
  faCalendarAlt,
  faEye,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-view-post",
  templateUrl: "./view-post.component.html",
  styleUrls: ["./view-post.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewPostComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
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
    this.route.data.subscribe((data: { post }) => {
      this.post = data.post;
      console.log(this.post);
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
  get faChevronLeft() {
    return faChevronLeft;
  }
}
