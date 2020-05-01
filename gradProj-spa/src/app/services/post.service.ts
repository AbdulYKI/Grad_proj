import { map } from "rxjs/operators";
import { PropertyNameFinder as PropertyNameToStringConverter } from "./../helper/property-name-to-string";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Post } from "../models/post";
import { PostPaginationParams } from "../helper/pagination/post-pagination-params";
import { PaginationResult } from "../helper/pagination/pagination-result";
import { OrderBy } from "../helper/enums/pagination-params-enums.enum";

@Injectable({
  providedIn: "root",
})
export class PostService {
  baseUrl: string = environment.apiUrl + "post/";

  constructor(private http: HttpClient) {}

  createPost(userId: number, post: Post) {
    return this.http.post(this.baseUrl + userId, post);
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(this.baseUrl + postId);
  }
  getPosts(
    pageSize?: number,
    pageNumber?: number,
    postPaginationParams?: PostPaginationParams
  ): Observable<PaginationResult<Post[]>> {
    const paginationResult = new PaginationResult<Post[]>();
    let params = new HttpParams();
    if (postPaginationParams?.orderBy != null) {
      params.append(
        PropertyNameToStringConverter.propertyNameToString(
          postPaginationParams,
          postPaginationParams.orderBy
        ),
        postPaginationParams.orderBy.toString()
      );
    }
    if (pageSize != null) {
      params = params.append(Object.keys({ pageSize })[0], pageSize.toString());
    }
    if (pageNumber != null) {
      params = params.append(
        Object.keys({ pageNumber })[0],
        pageNumber.toString()
      );
    }

    return this.http
      .get<Post[]>(this.baseUrl, { observe: "response", params: params })
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
    return this.http.delete(this.baseUrl + userId + "/" + id);
  }
  updatePost(userId: number, id: number, post: Post) {
    return this.http.put(this.baseUrl + userId + "/" + id, post);
  }
}
