import { LanguageEnum } from "../helper/enums/language.enum";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/User";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseUrl: string = environment.apiUrl + "auth/";
  jwtHelper: JwtHelperService = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

  photoUrl = new BehaviorSubject<string>("../../assets/user.png");
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor(private http: HttpClient) {}
  changeMemeberPhotoUrl(photoUrl: string) {
    this.photoUrl.next(photoUrl);
    this.currentUser.photoUrl = photoUrl;
    localStorage.setItem("info", JSON.stringify(this.currentUser));
  }
  signIn(model: User) {
    return this.http.post(this.baseUrl + "sign-in", model).pipe(
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
    return this.http.post(this.baseUrl + "sign-up", model);
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
}
