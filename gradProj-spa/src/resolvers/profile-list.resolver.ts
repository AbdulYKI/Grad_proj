import { paginationDefaults } from "../app/helper/pagination/pagination-defaults.constants";
import { PaginationResult } from "../app/helper/pagination/pagination-result";
import { SharedService } from "../app/services/shared.service";
import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AlertifyService } from "../app/services/alertify.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Injectable()
export class ProfileListResolver implements Resolve<PaginationResult<User[]>> {
  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private sharedService: SharedService,
    private userService: UserService
  ) {}

  resolve(
    snapShot: ActivatedRouteSnapshot
  ): Observable<PaginationResult<User[]>> {
    const users: Observable<PaginationResult<
      User[]
    >> = this.userService
      .getUsersForList(paginationDefaults.postsPaginationPageSize, 1)
      .pipe(
        catchError((error) => {
          this.handleError();
          return of(null);
        })
      );

    return users;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  handleError() {
    this.alertifyService.error(this.lexicon.retrievingDataErrorMessage);
    this.router.navigate([""]);
  }
}
