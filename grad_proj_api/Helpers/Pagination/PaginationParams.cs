namespace grad_proj_api.Helpers.Pagination {

    public enum OrderBy { NEWEST = 1, OLDEST = 2 }

    public class PaginationParams {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize;
        public int PageSize {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }
        public OrderBy OrderBy { get; set; } = OrderBy.NEWEST;
    }
}