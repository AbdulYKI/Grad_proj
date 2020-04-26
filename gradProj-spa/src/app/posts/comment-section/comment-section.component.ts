import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {

  constructor() { }
  status_comment = false;
  ngOnInit(): void {
  }

  commentbox(){
    this.status_comment = !this.status_comment;
  }

}
