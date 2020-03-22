import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/User";
@Injectable({
  providedIn: "root"
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
  }
  login(model: User) {
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((user: any) => {
        if (user) {
          localStorage.setItem("info", JSON.stringify(user.info));
          localStorage.setItem("gradProjToken", user.token);
          this.currentUser = user.info;
          this.changeMemeberPhotoUrl(this.currentUser.photoUrl);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
        }
      })
    );
  }
  register(model: User) {
    return this.http.post(this.baseUrl + "register", model);
  }
  loggedIn() {
    const token = localStorage.getItem("token");
    return !this.jwtHelper.isTokenExpired(token);
  }
}