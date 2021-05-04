import { SharedService } from "./shared.service";
import { Country } from "./../models/country";
import { environment } from "./../../environments/environment";
import { Observable, observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { map } from "rxjs/operators";
import { ProgrammingLanguage } from "../models/programming-language";
import { PaginationResult } from "../helper/pagination/pagination-result";
import { ProfileListPaginationParams } from "../helper/pagination/profile-pagination-params";
import { PropertyNameFinder } from "../helper/property-name-to-string";

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseUrl: string = environment.apiUrl + "user/";

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }
  updateUser(id: number, user: User) {
    return this.http.put(
      this.baseUrl + id + "/" + this.sharedService.LanguageSubject.value,
      user
    );
  }
  getProgrammingLanguages(): Observable<ProgrammingLanguage[]> {
    return this.http.get<ProgrammingLanguage[]>(
      this.baseUrl + "programming-languages"
    );
  }
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.baseUrl + "Countries");
  }
  getUsersForList(
    pageSize: number,
    pageNumber: number,
    profileListPaginationParams?: ProfileListPaginationParams
  ): Observable<PaginationResult<User[]>> {
    const paginationResult = new PaginationResult<User[]>();
    let httpParams = new HttpParams();

    httpParams = httpParams.append(
      Object.keys({ pageSize })[0],
      pageSize.toString()
    );

    httpParams = httpParams.append(
      Object.keys({ pageNumber })[0],
      pageNumber.toString()
    );
    if (profileListPaginationParams != null) {
      if (profileListPaginationParams.username != null) {
        httpParams = httpParams.append(
          PropertyNameFinder.propertyNameToString(
            profileListPaginationParams,
            profileListPaginationParams.username
          ),
          profileListPaginationParams.username
        );
      }
    }
    return this.http
      .get<User[]>(this.baseUrl + "users", {
        observe: "response",
        params: httpParams,
      })
      .pipe(
        map((response) => {
          paginationResult.result = response.body;
          if (response.headers.get("Pagination") != null) {
            paginationResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
            return paginationResult;
          }
        })
      );
  }
}
