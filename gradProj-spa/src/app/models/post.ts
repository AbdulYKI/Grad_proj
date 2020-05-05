export class Post {
  content: string;
  title: string;
  userPhotoUrl: string;
  username: string;
  votesCount: number;
  dateAddedUtc: Date;
  dateEditedUtc: Date;
  viewersCount: number;
  id: number;
  userId: number;
  constructor() {
    this.content = "";
    this.title = "";
  }
  isUpVotedByUser: boolean;
  isDownVotedByUser: boolean;
}
