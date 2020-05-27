using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using grad_proj_api.Helpers;
using grad_proj_api.Helpers.Pagination;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.EntityFrameworkCore;

namespace grad_proj_api.Data
{
    public class MainRepository : IMainRepository
    {
        private readonly DataContext _context;
        public MainRepository(DataContext context)
        {
            _context = context;
        }

        public async Task Add<T>(T entity) where T : class
        {
            await _context.AddAsync(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);

        }

        public void DeleteRange<T>(IEnumerable<T> entities) where T : class
        {
            _context.RemoveRange(entities);

        }
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<User> GetUser(int id)
        {
            var user = await _context
                .Users
                .Include(c => c.Country)
                .Include(upl => upl.UserProgrammingLanguages)
                .Include(p => p.Photo)
                .FirstOrDefaultAsync(U => U.Id == id);
            return user;
        }

        public async Task<List<UserProgrammingLanguage>> GetUserProgrammingLanguages(int id)
        {
            var userProgrammingLanguages = await _context.UserProgrammingLanguages.Where((upl) => upl.UserId == id).ToListAsync();
            return userProgrammingLanguages;
        }

        public async Task<List<ProgrammingLanguage>> GetProgrammingLanguages()
        {
            return await _context.ProgrammingLanguages.ToListAsync();
        }
        public async Task<List<Country>> GetCountries()
        {
            return await _context.Countries.ToListAsync();
        }
        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<Post> GetPost(int id)
        {
            var post = await _context
                .Posts
                .Include(c => c.User)
                .ThenInclude(ph => ph.Photo)
                .Include(uv => uv.UpVoters)
                .Include(dv => dv.DownVoters)
                .Include(v => v.PostViewers)
                .FirstOrDefaultAsync(p => p.Id == id);

            return post;
        }

        public async Task<PagedList<Post>> GetPosts(PostPaginationParams postPagingParams)
        {
            var posts = _context
                .Posts
                .Include(c => c.User)
                .ThenInclude(ph => ph.Photo)
                .Include(uv => uv.UpVoters)
                .Include(dv => dv.DownVoters)
                .Include(v => v.PostViewers);
            if (postPagingParams.OrderBy == OrderBy.NEWEST)
                posts.OrderByDescending((p) => p.DateAddedUtc);
            else if (postPagingParams.OrderBy == OrderBy.OLDEST)
                posts.OrderBy((p) => p.DateAddedUtc);

            return await PagedList<Post>.CreateAsync(posts, postPagingParams.PageSize, postPagingParams.PageNumber);

        }

        public async Task<Comment> GetComment(int id)
        {
            return await _context
                .Comments
                .Include(c => c.User)
                .ThenInclude(ph => ph.Photo)
                .Include(uv => uv.UpVoters)
                .Include(dv => dv.DownVoters)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<PagedList<Comment>> GetComments(int postId, CommentPaginationParams commentPaginationParams)
        {
            var comments = _context
                .Comments
                .Include(c => c.User)
                .ThenInclude(ph => ph.Photo)
                .Include(uv => uv.UpVoters)
                .Include(dv => dv.DownVoters)
                .Where(c => c.PostId == postId);

            if (commentPaginationParams.OrderBy == OrderBy.NEWEST)
            {
                comments.OrderByDescending((c) => c.DateAddedUtc);
            }
            else
            {
                comments.OrderBy((c) => c.DateAddedUtc);
            }
            return await PagedList<Comment>.CreateAsync(comments, commentPaginationParams.PageSize, commentPaginationParams.PageNumber);

        }

        public async Task<UpVotedComment> GetUpVoteForComment(int userId, int id)
        {
            return await _context.UpVotedComments.FirstOrDefaultAsync(uvc => uvc.UserId == userId && uvc.CommentId == id);
        }

        public async Task<DownVotedComment> GetDownVoteForComment(int userId, int id)
        {
            return await _context.DownVotedComments.FirstOrDefaultAsync(dvc => dvc.UserId == userId && dvc.CommentId == id);
        }

        public async Task<DownVotedPost> GetDownVoteForPost(int userId, int id)
        {
            return await _context.DownVotedPosts.FirstOrDefaultAsync(dvp => dvp.UserId == userId && dvp.PostId == id);
        }

        public async Task<UpVotedPost> GetUpVoteForPost(int userId, int id)
        {
            return await _context.UpVotedPosts.FirstOrDefaultAsync(uvp => uvp.UserId == userId && uvp.PostId == id);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Meessages.Include(m => m.Sender).FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Message>> GetMessagesThread(int userId, int recipientId)
        {
            var messages = await _context.Meessages
                .Include(m => m.Sender)
                .ThenInclude(p => p.Photo)
                .Include(m => m.Recipient)
                .OrderBy(message => message.MessageSentUtc)
                .Where(m => (!m.RecipientDeleted && m.RecipientId == userId && m.SenderId == recipientId) ||
                   (!m.SenderDeleted && m.SenderId == userId && m.RecipientId == recipientId))
                .ToListAsync();
            return messages;
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams, int userId)
        {
            var messages = _context.Meessages
                .Include(m => m.Sender)
                .ThenInclude(p => p.Photo)
                .Include(m => m.Recipient)
                .ThenInclude(p => p.Photo)
                .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case Container.INBOX:
                    messages = messages.Where(m => m.RecipientId == userId && !m.RecipientDeleted);
                    break;
                case Container.OUTBOX:
                    messages = messages.Where(m => m.SenderId == userId && !m.SenderDeleted);
                    break;
                case Container.UNREAD:
                    messages = messages.Where(m => m.RecipientId == userId && m.DateReadUtc == null && !m.RecipientDeleted);
                    break;
                case Container.LAST_RECIEVED_FROM_EACH_USER:
                    messages = messages.Where(m => m.RecipientId == userId && !m.RecipientDeleted);
                    var latestMessagesForEachUser = from m in messages
                                                    group m by m.SenderId into g
                                                    select new { senderId = g.Key, dateSentUtc = g.Max(m => m.MessageSentUtc) };
                    messages = from m in messages
                               join lm in latestMessagesForEachUser on new { senderId = m.SenderId, dateSent = m.MessageSentUtc }
                               equals new { senderId = lm.senderId, dateSent = lm.dateSentUtc }
                               select m;



                    break;
            }
            messages = messages.OrderByDescending(m => m.MessageSentUtc);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageSize, messageParams.PageNumber);

        }
    }
}