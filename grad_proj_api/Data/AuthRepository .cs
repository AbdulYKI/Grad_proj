using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Exceptions;
using grad_proj_api.Interfaces;
using grad_proj_api.Models;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;

namespace grad_proj_api.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public AuthRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<User> Login(string username, string password)
        {
            var user = username.Contains('@') ?
           await _context.Users.FirstOrDefaultAsync(userDB => userDB.Email == username) :
          await _context.Users.FirstOrDefaultAsync(userDB => userDB.Username == username);

            if (user == null || !VerifyPasswordHash(password, user.PasswordSalt, user.PasswordHash)) { return null; }

            return user;

        }

        private bool VerifyPasswordHash(string password, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var generatedPasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for (long i = 0; i < generatedPasswordHash.Length; i++)
                {
                    if (generatedPasswordHash[i] != passwordHash[i])
                        return false;
                }
                return true;
            }
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;

            user.PasswordSalt = passwordSalt;

            user.Username = user.Username.ToLower();

            await _context.Users.AddAsync(user);

            await _context.SaveChangesAsync();
            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string userName)
        {
            userName = userName.ToLower();
            if (await _context.Users.AnyAsync(x => x.Username == userName))
                return true;

            return false;

        }
        public async Task<bool> EmailExists(string email)
        {
            email = email.ToLower();
            if (await _context.Users.AnyAsync(x => x.Email == email))
                return true;

            return false;

        }
        public async Task<List<Country>> GetCountries()
        {
            return await _context.Countries.ToListAsync();
        }

        public async Task<User> GoogleLogin(GoogleJsonWebSignature.Payload payload)
        {
            var user = await _context.Users.FirstOrDefaultAsync(userDB => userDB.Email == payload.Email);
            if (user != null && user.CreatedWithGoogle == false)
                throw new EmailUsedException(ExceptionsEnum.EMAIL_USED_EXCEPTION.ToString());
            if (user == null)
            {
                var userTobeCreated = _mapper.Map<User>(payload);

                userTobeCreated.CreatedWithGoogle = true;

                var generatedUsername = GenerateUserName();

                while (await _context.Users.AnyAsync(user => user.Username == generatedUsername))

                { generatedUsername = GenerateUserName(); }

                userTobeCreated.Username = generatedUsername;

                await _context.Users.AddAsync(userTobeCreated);

                await _context.SaveChangesAsync();

                return userTobeCreated;
            }
            return user;
        }
        public string GenerateUserName()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var userName = new StringBuilder("", 12);
            var random = new Random();

            for (int i = 0; i < 12; i++)
            {
                userName.Append(chars[random.Next(chars.Length)]);
            }

            return userName.ToString();
        }
    }
}