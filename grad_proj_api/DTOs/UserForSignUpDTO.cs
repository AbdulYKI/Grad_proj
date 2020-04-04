using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using grad_proj_api.Helpers;

namespace grad_proj_api.DTOs
{
    public class UserForSignUpDTO
    {
        [Required]
        [CustomValidation(typeof(UserForSignUpDTO), "ValidateUsername")]
        public string Username { get; set; }
        public static ValidationResult ValidateUsername(string userName, ValidationContext context)
        {

            Regex regex = new Regex(@"^[a-zA-Z0-9_\.\-]{8,20}$");
            if (regex.IsMatch(userName))
            { return ValidationResult.Success; }
            else
            { return new ValidationResult(null); }

        }

        [Required]
        [CustomValidation(typeof(UserForSignUpDTO), "ValidateEmail")]
        public string Email { get; set; }
        public static ValidationResult ValidateEmail(string email, ValidationContext context)
        {

            Regex regex = new Regex(@"^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$");
            if (regex.IsMatch(email))
            { return ValidationResult.Success; }
            else
            { return new ValidationResult(null); }

        }

        [Required]
        [CustomValidation(typeof(UserForSignUpDTO), "ValidatePassword")]

        public string Password { get; set; }
        public static ValidationResult ValidatePassword(string email, ValidationContext context)
        {

            Regex regex = new Regex(@"^[a-zA-Z0-9_\-\.~!@\#\$%^&\*\+=`\|\\\(\)\{\}\[\]:;'<>,\.\?\/]{8,20}$");
            if (regex.IsMatch(email))
            { return ValidationResult.Success; }
            else
            { return new ValidationResult(null); }

        }

        public DateTime CreatedUTC { get; set; }
        public DateTime LastActiveUTC { get; set; }
        public UserForSignUpDTO()
        {
            LastActiveUTC = DateTime.UtcNow;
            CreatedUTC = DateTime.UtcNow;
        }
        [Required]
        public GenderEnum Gender { get; set; }
    }
}