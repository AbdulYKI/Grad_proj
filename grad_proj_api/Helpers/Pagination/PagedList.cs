using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace grad_proj_api.Helpers.Pagination {
    public class PagedList<T> : List<T> {
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public PagedList (List<T> items, int count, int pageNumber, int pageSize) {
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalCount = count;
            TotalPages = (int) Math.Ceiling (TotalCount / (double) PageSize);
            this.AddRange (items);

        }

        public static async Task<PagedList<T>> CreateAsync (IQueryable<T> source, int pageSize, int pageNumber) {

            var items = await source.Skip ((pageNumber - 1) * pageSize).Take (pageSize).ToListAsync ();
            var count = await source.CountAsync ();
            return new PagedList<T> (items, count, pageNumber, pageSize);
        }

    }
}