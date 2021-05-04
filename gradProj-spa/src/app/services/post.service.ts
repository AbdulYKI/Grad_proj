import { SharedService } from "./shared.service";
import { map } from "rxjs/operators";
import { PropertyNameFinder as PropertyNameToStringConverter } from "./../helper/property-name-to-string";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Post } from "../models/post";
import { PostListPaginationParams } from "../helper/pagination/post-list-pagination-params";
import { PaginationResult } from "../helper/pagination/pagination-result";

@Injectable({
  providedIn: "root",
})
export class PostService {
  baseUrl: string = environment.apiUrl + "post/";

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  createPost(userId: number, post: Post) {
    return this.http.post(
      this.baseUrl + userId + "/" + this.sharedService.LanguageSubject.value,
      post
    );
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(
      this.baseUrl + postId + "/" + this.sharedService.LanguageSubject.value
    );
  }
  getPosts(
    pageSize: number,
    pageNumber: number,
    postPaginationParams?: PostListPaginationParams
  ): Observable<PaginationResult<Post[]>> {
    const paginationResult = new PaginationResult<Post[]>();
    let httpParams = new HttpParams();
    if (postPaginationParams?.orderBy != null) {
      httpParams.append(
        PropertyNameToStringConverter.propertyNameToString(
          postPaginationParams,
          postPaginationParams.orderBy
        ),
        postPaginationParams.orderBy.toString()
      );
    }

    httpParams = httpParams.append(
      Object.keys({ pageSize })[0],
      pageSize.toString()
    );

    httpParams = httpParams.append(
      Object.keys({ pageNumber })[0],
      pageNumber.toString()
    );

    return this.http
      .get<Post[]>(this.baseUrl, {
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
          }
          return paginationResult;
        })
      );
  }
  deletePost(userId: number, id: number) {
    return this.http.delete(
      this.baseUrl +
        userId +
        "/" +
        id +
        "/" +
        this.sharedService.LanguageSubject.value
    );
  }
  updatePost(userId: number, id: number, post: Post) {
    return this.http.put(
      this.baseUrl +
        userId +
        "/" +
        id +
        "/" +
        this.sharedService.LanguageSubject.value,
      post
    );
  }

  createUpVote(userId: number, postId: number) {
    return this.http.post(
      this.baseUrl +
        "up-vote/" +
        postId +
        "/" +
        userId +
        "/" +
        this.sharedService.LanguageSubject.value,
      {}
    );
  }
  createDownVote(userId: number, postId: number) {
    return this.http.post(
      this.baseUrl +
        "down-vote/" +
        postId +
        "/" +
        userId +
        "/" +
        this.sharedService.LanguageSubject.value,
      {}
    );
  }

  deleteUpVote(userId: number, postId: number) {
    return this.http.delete(
      this.baseUrl +
        "up-vote/" +
        postId +
        "/" +
        userId +
        "/" +
        this.sharedService.LanguageSubject.value
    );
  }
  deleteDownVote(userId: number, postId: number) {
    return this.http.delete(
      this.baseUrl +
        "down-vote/" +
        postId +
        "/" +
        userId +
        "/" +
        this.sharedService.LanguageSubject.value
    );
  }
}
