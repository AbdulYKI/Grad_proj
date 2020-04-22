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
import { LanguageEnum } from "../../helper/language.enum";
import { Post } from "../../models/post";
import { AddPostComponent } from "../add-post/add-post.component";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-posts-list",
  templateUrl: "./posts-list.component.html",
  styleUrls: ["./posts-list.component.css"],
})
export class PostsListComponent implements OnInit, OnDestroy {
  showEditorFlag = false;
  status = false;
  posts: Post[];
  destroy: Subject<boolean> = new Subject<boolean>();
  @ViewChild("addPostComponent") addPostComponent: AddPostComponent;
  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  get FaPlus() {
    return faPlus;
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.destroy))
      .subscribe((data: { postsList: Post[] }) => {
        this.posts = data.postsList;
      });
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

  get Lexicon() {
    return this.sharedService.Lexicon;
  }
  get ContainerClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "container rtl";
    }
    return "container";
  }
  signedIn() {
    return this.authService.signedIn();
  }
  ngOnDestroy() {}
}
