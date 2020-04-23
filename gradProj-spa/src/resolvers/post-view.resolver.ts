import { AlertifyService } from "./../app/services/alertify.service";
import { SharedService } from "./../app/services/shared.service";
import { PostService } from "./../app/services/post.service";
import { catchError, map } from "rxjs/operators";
import { Observable, of, forkJoin } from "rxjs";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";

import { Post } from "src/app/models/post";

@Injectable()
export class ViewPostResolver implements Resolve<Post> {
  constructor(
    private router: Router,
    private postService: PostService,
    private sharedService: SharedService,
    private alertifyService: AlertifyService
  ) {}

  resolve(snapShot: ActivatedRouteSnapshot): any {
    const id: number = Number(snapShot.paramMap.get("id"));

    const post = this.postService.getPost(id).pipe(
      catchError((error) => {
        this.HandleError();
        return of(null);
      })
    );

    return post;
  }
  get Lexicon() {
    return this.sharedService.Lexicon;
  }
  HandleError() {
    this.alertifyService.error(this.Lexicon.retrievingDataErrorMessage);
    this.router.navigate([""]);
  }
}
