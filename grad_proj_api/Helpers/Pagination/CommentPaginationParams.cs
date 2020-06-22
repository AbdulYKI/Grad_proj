namespace grad_proj_api.Helpers.Pagination
{
    public class CommentPaginationParams : PaginationParams
    {


        public OrderCommentsBy OrderBy { get; set; } = OrderCommentsBy.NEWEST;
        public Languages? Language { get; set; }

    }
}