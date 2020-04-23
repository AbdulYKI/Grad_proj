import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Post } from "src/app/models/post";

@Component({
  selector: "app-view-post",
  templateUrl: "./view-post.component.html",
  styleUrls: ["./view-post.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewPostComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  post: Post;
  ngOnInit(): void {
    this.route.data.subscribe((data: { post }) => (this.post = data.post));
  }
}