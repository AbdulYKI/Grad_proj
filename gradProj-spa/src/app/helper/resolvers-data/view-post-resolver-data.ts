import { Comment } from "../../models/comment";
import { Post } from "../../models/post";
import { PaginationResult } from "../pagination/pagination-result";

export class ViewPostResolverData {
  post: Post;
  commentsPaginationResult: PaginationResult<Comment[]>;

  constructor(
    post: Post,
    commentsPaginationResult: PaginationResult<Comment[]>
  ) {
    this.post = post;
    this.commentsPaginationResult = commentsPaginationResult;
  }
}
