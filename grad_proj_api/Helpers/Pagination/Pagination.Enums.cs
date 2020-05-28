namespace grad_proj_api.Helpers.Pagination
{

    public enum Container { INBOX = 1, OUTBOX = 2, UNREAD = 3, LAST_RECIEVED_FROM_EACH_USER = 4 }
    public enum OrderPostsBy { NEWEST = 1, OLDEST = 2 }
    public enum OrderCommentsBy { NEWEST = 1, OLDEST = 2 }
}