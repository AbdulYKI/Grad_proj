using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Microsoft.EntityFrameworkCore;

namespace grad_proj_api.Data {
    public class MainRepository : IMainRepository {
        private readonly DataContext _context;
        public MainRepository (DataContext context) {
            _context = context;
        }

        public async Task Add<T> (T entity) where T : class {
            await _context.AddAsync (entity);
        }

        public void Delete<T> (T entity) where T : class {
            _context.Remove (entity);

        }

        public void DeleteRange<T> (IEnumerable<T> entities) where T : class {
            _context.RemoveRange (entities);

        }
        public async Task<bool> SaveAll () {
            return await _context.SaveChangesAsync () > 0;
        }
        public async Task<User> GetUser (int id) {
            var user = await _context
                .Users
                .Include (c => c.Country)
                .Include (upl => upl.UserProgrammingLanguages)
                .FirstOrDefaultAsync (U => U.Id == id);
            return user;
        }

        public async Task<List<UserProgrammingLanguage>> GetUserProgrammingLanguages (int id) {
            var userProgrammingLanguages = await _context.UserProgrammingLanguages.Where ((upl) => upl.UserId == id).ToListAsync ();
            return userProgrammingLanguages;
        }

        public async Task<List<ProgrammingLanguage>> GetProgrammingLanguages () {
            return await _context.ProgrammingLanguages.ToListAsync ();
        }
        public async Task<List<Country>> GetCountries () {
            return await _context.Countries.ToListAsync ();
        }
    }
}