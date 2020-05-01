import { PostService } from "src/app/services/post.service";
import { PaginationResult } from "./../../helper/pagination/pagination-result";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "./../../services/auth.service";
import { SharedService } from "../../services/shared.service";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  faPlus,
  faPaperPlane,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "../../helper/enums/language.enum";
import { Post } from "../../models/post";
import { AddPostComponent } from "../add-post/add-post.component";
import { takeUntil } from "rxjs/operators";
import { Pagination } from "src/app/helper/pagination/pagination";

@Component({
  selector: "app-posts-list",
  templateUrl: "./posts-list.component.html",
  styleUrls: ["./posts-list.component.css"],
})
export class PostsListComponent implements OnInit, OnDestroy {
  showEditorFlag = false;
  status = false;
  posts: Post[];
  pagination: Pagination;
  destroy: Subject<boolean> = new Subject<boolean>();
  @ViewChild("addPostComponent") addPostComponent: AddPostComponent;
  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  get faPlus() {
    return faPlus;
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (data: { postsPaginationResult: PaginationResult<Post[]> }) => {
          this.posts = data.postsPaginationResult.result;
          this.pagination = data.postsPaginationResult.pagination;
        }
      );
  }
  showEditor() {
    this.showEditorFlag = true;
  }
  hideEditor(newPost: Post) {
    if (newPost != null) {
      this.posts.push(newPost);
    }
    this.showEditorFlag = false;
  }

  get lexicon() {
    return this.sharedService.lexicon;
  }
  get containerClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "container rtl";
    }
    return "container";
  }
  signedIn() {
    return this.authService.signedIn();
  }
  pageChange(pageNumber: number) {
    this.postService.getPosts(5, pageNumber).subscribe((paginationResult) => {
      this.posts = paginationResult.result;
      this.pagination = paginationResult.pagination;
    });
  }
  ngOnDestroy() {}
}
