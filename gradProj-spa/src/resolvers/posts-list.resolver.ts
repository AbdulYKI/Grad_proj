import { PostsListComponent } from "./../app/posts/posts-list/posts-list.component";
import { PostService } from "./../app/services/post.service";
import { SharedService } from "../app/services/shared.service";
import { ProgrammingLanguage } from "../app/models/programming-language";
import { AuthService } from "../app/services/auth.service";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AlertifyService } from "../app/services/alertify.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Post } from "src/app/models/post";

@Injectable()
export class PostsListResolver implements Resolve<Post[]> {
  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private postService: PostService
  ) {}

  resolve(snapShot: ActivatedRouteSnapshot): any {
    const posts: Observable<Post[]> = this.postService.getPosts().pipe(
      catchError((error) => {
        this.HandleError();
        return of(null);
      })
    );

    return posts;
  }
  get Lexicon() {
    return this.sharedService.Lexicon;
  }
  HandleError() {
    this.alertifyService.error(this.Lexicon.retrievingDataErrorMessage);
    this.router.navigate([""]);
  }
}
