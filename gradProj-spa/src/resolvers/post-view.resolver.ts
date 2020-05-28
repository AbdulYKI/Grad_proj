import { CommentPaginationParams } from "./../app/helper/pagination/comment-pagination-params";
import { Comment } from "./../app/models/comment";
import { PaginationResult } from "./../app/helper/pagination/pagination-result";
import { CommentService } from "src/app/services/comment.service";
import { AlertifyService } from "./../app/services/alertify.service";
import { SharedService } from "./../app/services/shared.service";
import { PostService } from "./../app/services/post.service";
import { catchError, map } from "rxjs/operators";
import { Observable, of, forkJoin } from "rxjs";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Post } from "src/app/models/post";
import { paginationDefaults } from "src/app/helper/pagination/pagination-defaults.constants";
import { ViewPostResolverData } from "src/app/helper/resolvers-data/view-post-resolver-data";
import { OrderCommentsBy } from "src/app/helper/enums/pagination-params-enums.enum";

@Injectable()
export class ViewPostResolver implements Resolve<ViewPostResolverData> {
  constructor(
    private router: Router,
    private postService: PostService,
    private sharedService: SharedService,
    private alertifyService: AlertifyService,
    private commentSerivce: CommentService
  ) {}

  resolve(snapShot: ActivatedRouteSnapshot): Observable<ViewPostResolverData> {
    const id: number = Number(snapShot.paramMap.get("id"));

    const post: Observable<Post> = this.postService.getPost(id).pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );
    const commentPaginationParams = new CommentPaginationParams();
    commentPaginationParams.orderBy = OrderCommentsBy.Oldest;
    const comments: Observable<PaginationResult<
      Comment[]
    >> = this.commentSerivce
      .getComments(
        id,
        paginationDefaults.commentsPaginationPageSize,
        1,
        commentPaginationParams
      )
      .pipe(
        catchError((error) => {
          this.handleError();
          return of(null);
        })
      );
    const joinedResponses = forkJoin([post, comments]).pipe(
      map((allResponses) => {
        const viewPostResolverData = new ViewPostResolverData(
          allResponses[0] as Post,
          allResponses[1] as PaginationResult<Comment[]>
        );
        return viewPostResolverData;
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
