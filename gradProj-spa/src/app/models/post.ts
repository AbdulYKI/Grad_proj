export class Post {
  content: string;
  title: string;
  creatorPhotoUrl: string;
  creatorUsername: string;
  upVotesCount: number;
  downVotesCount: number;
  dateAddedUtc: Date;
  viewersCount: number;
  id;
  constructor() {
    this.content = "";
    this.title = "";
  }
}
