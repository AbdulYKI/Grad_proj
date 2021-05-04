import { SharedService } from "./shared.service";
import { LanguageEnum } from "../helper/enums/language.enum";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseUrl: string = environment.apiUrl + "auth/";
  jwtHelper: JwtHelperService = new JwtHelperService();
  decodedToken: any;

  photoUrlSubject = new BehaviorSubject<string>("../../assets/user.png");
  constructor(private http: HttpClient, private sharedService: SharedService) {}
  changeMemeberPhotoUrl(photoUrl: string) {
    this.photoUrlSubject.next(photoUrl);
    const userInLocalStorage = this.currentUser;
    userInLocalStorage.photoUrl = photoUrl;
    this.currentUser = userInLocalStorage;
  }
  signIn(model: User) {
    return this.http
      .post(
        this.baseUrl + "sign-in/" + this.sharedService.LanguageSubject.value,
        model
      )
      .pipe(
        map((user: any) => {
          if (user) {
            localStorage.setItem("info", JSON.stringify(user.info));
            localStorage.setItem(environment.tokenName, user.token);
            this.currentUser = user.info;
            this.changeMemeberPhotoUrl(this.currentUser.photoUrl);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
          }
        })
      );
  }
  signUp(model: User) {
    return this.http.post(
      this.baseUrl + "sign-up/" + this.sharedService.LanguageSubject.value,
      model
    );
  }
  signedIn() {
    const token = localStorage.getItem(environment.tokenName);
    if (this.jwtHelper.isTokenExpired(token)) {
      localStorage.removeItem(environment.tokenName);
      localStorage.removeItem("info");
      return false;
    }
    return true;
  }
  get currentUser() {
    return JSON.parse(localStorage.getItem("info")) as User;
  }
  set currentUser(user: User) {
    if (user !== null) {
      localStorage.setItem("info", JSON.stringify(user));
    } else {
      localStorage.removeItem("info");
    }
  }
}
