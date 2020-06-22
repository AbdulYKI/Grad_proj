using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Apis.Auth;
using grad_proj_api.Helpers;
using grad_proj_api.Models;

namespace grad_proj_api.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> SignUp(User user, string password);
        Task<User> SignIn(string username, string password);

        Task<bool> UserExists(string userName);
        Task<bool> EmailExists(string email);
        Task<User> GoogleSignIn(GoogleJsonWebSignature.Payload payload, Languages? Language);
        string GenerateUserName();
    }

}