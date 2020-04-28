import { Comment } from "./../models/comment";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "../models/post";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  baseUrl = environment.apiUrl + "comment/";
  constructor(private http: HttpClient) {}

  createComment(userId: number, postId: number, comment: Comment) {
    return this.http.post(this.baseUrl + userId + "/" + postId, comment);
  }
  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseUrl + postId);
  }
  editComment(userId: number, id: number, comment: Comment) {
    return this.http.put(this.baseUrl + userId + "/" + id, comment);
  }
  deleteComment(userId: number, postId: number, id: number) {
    return this.http.delete(this.baseUrl + postId + "/" + userId + "/" + id);
  }
}
