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
  constructor(private http: HttpClient) {}

  createComment(userId: number, postId: number, comment: Comment) {
    return this.http.post(this.baseUrl + userId + "/" + postId, comment);
  }
  getComments(
    postId: number,
    pageSize?: number,
    pageNumber?: number,
    commentPagingParams?: CommentPaginationParams
  ): Observable<PaginationResult<Comment[]>> {
    const paginationResult = new PaginationResult<Comment[]>();
    let httpParams = new HttpParams();
    if (pageSize != null) {
      httpParams = httpParams.append(
        Object.keys({ pageSize })[0],
        pageSize.toString()
      );
    }
    if (pageNumber != null) {
      httpParams = httpParams.append(
        Object.keys({ pageNumber })[0],
        pageNumber.toString()
      );
    }
    if (commentPagingParams != null) {
      if (commentPagingParams.orderBy != null) {
        httpParams = httpParams.append(
          PropertyNameFinder.propertyNameToString(
            commentPagingParams,
            commentPagingParams.orderBy
          ),
          commentPagingParams.orderBy.toString()
        );
      }
    }

    return this.http
      .get<Comment[]>(this.baseUrl + postId, {
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
  editComment(userId: number, id: number, comment: Comment) {
    return this.http.put(this.baseUrl + userId + "/" + id, comment);
  }
  deleteComment(userId: number, postId: number, id: number) {
    return this.http.delete(this.baseUrl + postId + "/" + userId + "/" + id);
  }
  createUpVote(userId: number, commentId: number) {
    return this.http.post(
      this.baseUrl + "up-vote/" + commentId + "/" + userId,
      {}
    );
  }
  createDownVote(userId: number, commentId: number) {
    return this.http.post(
      this.baseUrl + "down-vote/" + commentId + "/" + userId,
      {}
    );
  }

  deleteUpVote(userId: number, commentId: number) {
    return this.http.delete(
      this.baseUrl + "up-vote/" + commentId + "/" + userId
    );
  }
  deleteDownVote(userId: number, commentId: number) {
    return this.http.delete(
      this.baseUrl + "down-vote/" + commentId + "/" + userId
    );
  }

  getComment(postId: number, commentId: number): Observable<Comment> {
    return this.http.get<Comment>(this.baseUrl + postId + "/" + commentId);
  }
}
