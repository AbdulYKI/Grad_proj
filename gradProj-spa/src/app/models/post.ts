export class Post {
  content: string;
  title: string;
  userPhotoUrl: string;
  username: string;
  votesCount: number;
  dateAddedUtc: Date;
  viewersCount: number;
  id: number;
  constructor() {
    this.content = "";
    this.title = "";
  }
}
