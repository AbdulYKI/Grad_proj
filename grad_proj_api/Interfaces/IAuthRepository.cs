using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Apis.Auth;
using grad_proj_api.Models;

namespace grad_proj_api.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string username, string password);
        Task<User> GoogleLogin(GoogleJsonWebSignature.Payload payload);
        Task<bool> UserExists(string userName);
        Task<bool> EmailExists(string email);
        Task<List<Country>> GetCountries();
        string GenerateUserName();
    }

}