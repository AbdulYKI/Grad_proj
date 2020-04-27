import { Component, OnInit } from "@angular/core";
import {
  faSortUp,
  faSortDown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-comment-card",
  templateUrl: "./comment-card.component.html",
  styleUrls: ["./comment-card.component.css"],
})
export class CommentCardComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}

  get FaSortUp() {
    return faSortUp;
  }
  get FaSortDown() {
    return faSortDown;
  }
  get Fastar() {
    return faStar;
  }
}
