import { SharedService } from "../app/services/shared.service";
import { Country } from "../app/models/country";
import { ProgrammingLanguage } from "../app/models/programming-language";
import { AuthService } from "../app/services/auth.service";
import { catchError, map } from "rxjs/operators";
import { Observable, of, forkJoin } from "rxjs";
import { AlertifyService } from "../app/services/alertify.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

import { ViewProfileResolverData } from "src/app/helper/resolvers-data/view-profile-resolver-data";
import { ViewPostResolverData } from "src/app/helper/resolvers-data/view-post-resolver-data";

@Injectable()
export class ViewProfileResolver implements Resolve<ViewProfileResolverData> {
  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService
  ) {}

  resolve(
    snapShot: ActivatedRouteSnapshot
  ): Observable<ViewProfileResolverData> {
    const userId = Number.parseInt(snapShot.paramMap.get("id"));

    const user: Observable<User> = this.userService.getUser(userId).pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );
    const programmingLanguages: Observable<
      ProgrammingLanguage[]
    > = this.userService.getProgrammingLanguages().pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );
    const countries: Observable<
      Country[]
    > = this.userService.getCountries().pipe(
      catchError((error) => {
        this.handleError();
        return of(null);
      })
    );

    const joinedResponses = forkJoin([
      user,
      programmingLanguages,
      countries,
    ]).pipe(
      map((allResponses) => {
        console.log(allResponses);
        const viewProfileResolverData = new ViewProfileResolverData(
          allResponses[2] as Country[],
          allResponses[1] as ProgrammingLanguage[],
          allResponses[0] as User
        );
        return viewProfileResolverData;
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
