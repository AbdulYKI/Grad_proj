import { PaginationResult } from "./../app/helper/pagination/pagination-result";
import { CommentService } from "src/app/services/comment.service";
import { AlertifyService } from "./../app/services/alertify.service";
import { SharedService } from "./../app/services/shared.service";
import { PostService } from "./../app/services/post.service";
import { catchError, map } from "rxjs/operators";
import { Observable, of, forkJoin } from "rxjs";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";

import { Post } from "src/app/models/post";
import { paginationDefaults } from "src/app/helper/pagination/pagination-defaults.constants";

@Injectable()
export class ViewPostResolver implements Resolve<Post> {
  constructor(
    private router: Router,
    private postService: PostService,
    private sharedService: SharedService,
    private alertifyService: AlertifyService,
    private commentSerivce: CommentService
  ) {}

  resolve(snapShot: ActivatedRouteSnapshot): any {
    const id: number = Number(snapShot.paramMap.get("id"));

    const post: Observable<Post> = this.postService.getPost(id).pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );

    const comments: Observable<PaginationResult<
      Comment[]
    >> = this.commentSerivce
      .getComments(id, paginationDefaults.commentsPaginationPageSize)
      .pipe(
        catchError((error) => {
          this.handleError();
          return of(null);
        })
      );
    const joinedResponses = forkJoin([post, comments]).pipe(
      map((allResponses) => {
        return {
          post: allResponses[0],
          commentsPaginationResult: allResponses[1],
        };
      })
    );
    return joinedResponses;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  handleError() {
    this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
    this.router.navigate([""]);
  }
}
