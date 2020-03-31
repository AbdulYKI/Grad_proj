using System.Threading.Tasks;
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




        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
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
            .FirstOrDefaultAsync(U => U.Id == id);
            return user;
        }
    }
}