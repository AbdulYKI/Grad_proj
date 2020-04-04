import { Country } from "./../app/models/country";
import { ProgrammingLanguage } from "./../app/models/programming-language";
import { AuthService } from "./../app/services/auth.service";
import { catchError, map } from "rxjs/operators";
import { Observable, of, forkJoin } from "rxjs";
import { AlertifyService } from "../app/services/alertify.service";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { EditProfileResolverData } from "src/app/helper/edit-profile-resolver-data";

@Injectable()
export class EditProfileResolver implements Resolve<EditProfileResolverData> {
  constructor(
    private alertifyService: AlertifyService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  resolve(snapShot: ActivatedRouteSnapshot): any {
    const user: Observable<User> = this.userService
      .getUser(this.authService.decodedToken.nameid)
      .pipe(
        catchError(error => {
          this.alertifyService.error("Problem in retreving data");
          this.router.navigate([""]);
          return of(null);
        })
      );
    const programmingLanguages: Observable<ProgrammingLanguage[]> = this.userService
      .getProgrammingLanguages()
      .pipe(
        catchError(error => {
          this.alertifyService.error("Problem in retreving data");
          this.router.navigate([""]);
          return of(null);
        })
      );
    const countries: Observable<Country[]> = this.userService
      .getCountries()
      .pipe(
        catchError(error => {
          this.alertifyService.error("Problem in retreving data");
          this.router.navigate([""]);
          return of(null);
        })
      );

    const joinedResponses = forkJoin([
      user,
      programmingLanguages,
      countries
    ]).pipe(
      map(allResponses => {
        console.log(allResponses);
        return {
          user: allResponses[0],
          programmingLanguages: allResponses[1],
          countries: allResponses[2]
        };
      })
    );
    return joinedResponses;
  }
}
