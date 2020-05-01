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
    return this.http.post(this.baseUrl + userId, post);
  }

  getPost(postId: number): Observable<Post> {
    return this.http.get<Post>(this.baseUrl + postId);
  }
  getPosts(): Observable<Post> {
    return this.http.get<Post>(this.baseUrl);
  }
  deletePost(userId: number, id: number) {
    return this.http.delete(this.baseUrl + userId + "/" + id);
  }
  updatePost(userId: number, id: number, post: Post) {
    return this.http.put(this.baseUrl + userId + "/" + id, post);
  }
}
