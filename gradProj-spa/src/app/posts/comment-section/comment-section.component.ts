import { Component, OnInit } from '@angular/core';
import {
  faSortUp,
  faSortDown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {

  constructor() { }
  ngOnInit(): void {
  }



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
