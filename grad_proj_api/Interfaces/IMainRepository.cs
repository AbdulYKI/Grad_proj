using System.Threading.Tasks;
using grad_proj_api.Models;

namespace grad_proj_api.Interfaces
{
    public interface IMainRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<User> GetUser(int id);
        Task<bool> SaveAll();
    }
}