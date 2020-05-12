import { paginationDefaults } from "./../app/helper/pagination/pagination-defaults.constants";
import { PaginationResult } from "./../app/helper/pagination/pagination-result";
import { PostService } from "./../app/services/post.service";
import { SharedService } from "../app/services/shared.service";
import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AlertifyService } from "../app/services/alertify.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Post } from "src/app/models/post";

@Injectable()
export class PostsListResolver implements Resolve<PaginationResult<Post[]>> {
  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private sharedService: SharedService,
    private postService: PostService
  ) {}

  resolve(
    snapShot: ActivatedRouteSnapshot
  ): Observable<PaginationResult<Post[]>> {
    const posts: Observable<PaginationResult<
      Post[]
    >> = this.postService
      .getPosts(paginationDefaults.postsPaginationPageSize)
      .pipe(
        catchError((error) => {
          this.handleError();
          return of(null);
        })
      );

    return posts;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  handleError() {
    this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
    this.router.navigate([""]);
  }
}
