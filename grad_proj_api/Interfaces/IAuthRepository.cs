using System.Collections.Generic;
using System.Threading.Tasks;
using grad_proj_api.Models;

namespace grad_proj_api.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string userName, string password);
        Task<bool> UserExists(string userName);
        Task<List<Country>> GetCountries();
    }

}