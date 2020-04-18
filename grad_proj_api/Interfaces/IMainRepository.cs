using System.Collections.Generic;
using System.Threading.Tasks;
using grad_proj_api.Models;

namespace grad_proj_api.Interfaces {
    public interface IMainRepository {
        Task Add<T> (T entity) where T : class;
        void Delete<T> (T entity) where T : class;
        void DeleteRange<T> (IEnumerable<T> entities) where T : class;
        Task<User> GetUser (int id);
        Task<List<UserProgrammingLanguage>> GetUserProgrammingLanguages (int id);
        Task<List<ProgrammingLanguage>> GetProgrammingLanguages ();
        Task<bool> SaveAll ();
        Task<Photo> GetPhoto (int id);
        Task<List<Country>> GetCountries ();

    }
}