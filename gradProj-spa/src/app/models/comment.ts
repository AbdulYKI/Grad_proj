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
}
