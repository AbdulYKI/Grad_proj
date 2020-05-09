using System.Collections.Generic;
using System.Threading.Tasks;
using grad_proj_api.Helpers;
using grad_proj_api.Helpers.Pagination;
using grad_proj_api.Models;

namespace grad_proj_api.Interfaces
{
    public interface IMainRepository
    {
        Task Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        void DeleteRange<T>(IEnumerable<T> entities) where T : class;
        Task<User> GetUser(int id);
        Task<List<UserProgrammingLanguage>> GetUserProgrammingLanguages(int id);
        Task<List<ProgrammingLanguage>> GetProgrammingLanguages();
        Task<bool> SaveAll();
        Task<Photo> GetPhoto(int id);
        Task<List<Country>> GetCountries();
        Task<Post> GetPost(int id);
        Task<PagedList<Post>> GetPosts(PostPaginationParams postPagingParams);
        Task<Comment> GetComment(int id);
        Task<PagedList<Comment>> GetComments(int postId, CommentPaginationParams commentPaginationParams);
        Task<UpVotedComment> GetUpVoteForComment(int userId, int id);
        Task<DownVotedComment> GetDownVoteForComment(int userId, int id);
        Task<DownVotedPost> GetDownVoteForPost(int userId, int id);
        Task<UpVotedPost> GetUpVoteForPost(int userId, int id);

        Task<Message> GetMessage(int id);
        Task<IEnumerable<Message>> GetMessagesThread(int userId, int recipientId);
        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
    }
}