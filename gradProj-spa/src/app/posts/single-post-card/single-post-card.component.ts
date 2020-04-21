import { Component, OnInit } from "@angular/core";
import {
  faEye,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-single-post-card",
  templateUrl: "./single-post-card.component.html",
  styleUrls: ["./single-post-card.component.css"],
})
export class SinglePostCardComponent implements OnInit {
  post_list = [
    {
      id: 1,
      username: "Ali",
      imgUrl: "https://avatars2.githubusercontent.com/u/11575183?s=460&v=4",
      title: "Fix Connection Asp.Net",
      view: 9000,
      rank: 1000,
      yyyy: "10-July , 2020",
      hours: "10 Pm",
      category1: ".Net",
      category2: "Microsoft",
      status: "up-votes-arrow",
    },
    {
      id: 1,
      username: "Sara alex",
      imgUrl: "https://avatars1.githubusercontent.com/u/3844427?s=460&v=4",
      title: "Bootstrap 4 Padding left",
      view: 2000,
      rank: 200,
      yyyy: "09-Feb , 2018",
      hours: "03 Am",
      category1: "Angualr",
      category2: "Bootstrap 4",
      status: "down-votes-arrow",
    },
  ];
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
