import { SharedService } from "./../../services/shared.service";
import { environment } from "./../../../environments/environment";
import { Component, OnInit, Input } from "@angular/core";
import {
  faEye,
  faCaretUp,
  faCaretDown,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Post } from "src/app/models/post";
import { convertDate } from "src/app/helper/date-helpers";

@Component({
  selector: "app-single-post-card",
  templateUrl: "./single-post-card.component.html",
  styleUrls: ["./single-post-card.component.css"],
})
export class SinglePostCardComponent implements OnInit {
  @Input() post: Post;

  defaulPhotoUrl: string = environment.defaultPhoto;
  constructor(private sharedService: SharedService) {}

  get faEye() {
    return faEye;
  }
  get faCaretUp() {
    return faCaretUp;
  }
  get faCaretDown() {
    return faCaretDown;
  }
  get faCalendar() {
    return faCalendarAlt;
  }
  get localeCode() {
    return this.sharedService.localeCode;
  }
  ngOnInit(): void {}
  get lexicon() {
    return this.sharedService.lexicon;
  }
}
