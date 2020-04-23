import { environment } from "./../../../environments/environment";
import { Component, OnInit, Input } from "@angular/core";
import {
  faEye,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { Post } from "src/app/models/post";

@Component({
  selector: "app-single-post-card",
  templateUrl: "./single-post-card.component.html",
  styleUrls: ["./single-post-card.component.css"],
})
export class SinglePostCardComponent implements OnInit {
  @Input() post: Post;
  defaulPhotoUrl: string = environment.defaultPhoto;
  constructor() {}
  get FaEye() {
    return faEye;
  }
  get FaCaretUp() {
    return faCaretUp;
  }
  get FaCaretDown() {
    return faCaretDown;
  }

  ngOnInit(): void {}
}
