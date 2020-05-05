export class Comment {
  username: string;
  userPhotoUrl: string;
  userId: number;
  id: number;
  content: string;
  dateAddedUtc: Date;
  votesCount: number;
  constructor() {
    this.content = "";
  }
  isUpVotedByUser: boolean;
  isDownVotedByUser: boolean;
  postId: number;
  dateEditedUtc: Date;
}
