import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Post } from "../models/post";

@Injectable({
  providedIn: "root",
})
export class PostService {
  baseUrl: string = environment.apiUrl + "post/";

  constructor(private http: HttpClient) {}

  createPost(userId: number, post: Post) {
    return this.http.post<Observable<Post>>(this.baseUrl + userId, post);
  }

  getPost(postId: number) {
    return this.http.get<Observable<Post>>(this.baseUrl + postId);
  }
  getPosts() {
    return this.http.get<Observable<Post>>(this.baseUrl);
  }
}
