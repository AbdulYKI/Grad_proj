import { SharedService } from "./shared.service";
import { PropertyNameFinder } from "./../helper/property-name-to-string";
import { PaginationResult } from "./../helper/pagination/pagination-result";
import { CommentPaginationParams } from "./../helper/pagination/comment-pagination-params";
import { Comment } from "./../models/comment";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Post } from "../models/post";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  baseUrl = environment.apiUrl + "comment/";
  constructor(private http: HttpClient, private sharedService: SharedService) {}

  createComment(userId: number, postId: number, comment: Comment) {
    return this.http.post(
      this.baseUrl +
        userId +
        "/" +
        postId +
        "/" +
        this.sharedService.currentLanguage.value,
      comment
    );
  }
  getComments(
    postId: number,
    pageSize: number,
    pageNumber: number,
    commentPagingParams?: CommentPaginationParams
  ): Observable<PaginationResult<Comment[]>> {
    const paginationResult = new PaginationResult<Comment[]>();
    let httpParams = new HttpParams();

    httpParams = httpParams.append(
      Object.keys({ pageSize })[0],
      pageSize.toString()
    );

    httpParams = httpParams.append(
      Object.keys({ pageNumber })[0],
      pageNumber.toString()
    );

    if (commentPagingParams?.orderBy != null) {
      httpParams = httpParams.append(
        PropertyNameFinder.propertyNameToString(
          commentPagingParams,
          commentPagingParams.orderBy
        ),
        commentPagingParams.orderBy.toString()
      );
    }

    return this.http
      .get<Comment[]>(
        this.baseUrl + postId + "/" + this.sharedService.currentLanguage.value,
        {
          observe: "response",
          params: httpParams,
        }
      )
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
  editComment(userId: number, id: number, comment: Comment) {
    return this.http.put(
      this.baseUrl +
        userId +
        "/" +
        id +
        "/" +
        this.sharedService.currentLanguage.value,
      comment
    );
  }
  deleteComment(userId: number, postId: number, id: number) {
    return this.http.delete(
      this.baseUrl +
        postId +
        "/" +
        userId +
        "/" +
        id +
        "/" +
        this.sharedService.currentLanguage.value
    );
  }
  createUpVote(userId: number, commentId: number) {
    return this.http.post(
      this.baseUrl +
        "up-vote/" +
        commentId +
        "/" +
        userId +
        "/" +
        this.sharedService.currentLanguage.value,
      {}
    );
  }
  createDownVote(userId: number, commentId: number) {
    return this.http.post(
      this.baseUrl +
        "down-vote/" +
        commentId +
        "/" +
        userId +
        "/" +
        this.sharedService.currentLanguage.value,
      {}
    );
  }

  deleteUpVote(userId: number, commentId: number) {
    return this.http.delete(
      this.baseUrl +
        "up-vote/" +
        commentId +
        "/" +
        userId +
        "/" +
        this.sharedService.currentLanguage.value
    );
  }
  deleteDownVote(userId: number, commentId: number) {
    return this.http.delete(
      this.baseUrl +
        "down-vote/" +
        commentId +
        "/" +
        userId +
        "/" +
        this.sharedService.currentLanguage.value
    );
  }

  getComment(postId: number, commentId: number): Observable<Comment> {
    return this.http.get<Comment>(
      this.baseUrl +
        postId +
        "/" +
        commentId +
        "/" +
        this.sharedService.currentLanguage.value
    );
  }
}
