import { environment } from "./../../environments/environment";
import { Observable, observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { map } from "rxjs/operators";
import { ProgrammingLanguage } from "../models/programming-language";

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl: string = environment.apiUrl + "user/";

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + id, user);
  }
  getProgrammingLanguages(): Observable<ProgrammingLanguage> {
    return this.http.get<ProgrammingLanguage>(
      this.baseUrl + "programming-languages"
    );
  }
  getCountries() {
    return this.http.get(this.baseUrl + "Countries");
  }
}
