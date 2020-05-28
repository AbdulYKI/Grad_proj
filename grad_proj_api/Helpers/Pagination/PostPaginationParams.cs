namespace grad_proj_api.Helpers.Pagination
{

    public class PostPaginationParams : PaginationParams
    {

        public OrderPostsBy OrderBy { get; set; } = OrderPostsBy.NEWEST;

    }
}