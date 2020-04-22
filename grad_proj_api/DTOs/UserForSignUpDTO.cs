using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using grad_proj_api.Helpers;

namespace grad_proj_api.Dtos {
    public class UserForSignUpDto {

        [CustomValidation (typeof (UserForSignUpDto), "ValidateUsername")]
        public string Username { get; set; }
        public static ValidationResult ValidateUsername (string username, ValidationContext context) {
            if (username == null) { return new ValidationResult ("Username Is Required"); }
            Regex regex = new Regex (@"^[a-zA-Z0-9_\-\.~!\#\$%^&\*\+=`\|\\\(\)\{\}\[\]:;'<>,\.\?\/]{8,20}");
            if (regex.IsMatch (username)) { return ValidationResult.Success; } else { return new ValidationResult (null); }

        }

        [CustomValidation (typeof (UserForSignUpDto), "ValidateEmail")]
        public string Email { get; set; }
        public static ValidationResult ValidateEmail (string email, ValidationContext context) {
            if (email == null) { return new ValidationResult ("Email Is Required"); }
            Regex regex = new Regex (@"^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$");
            if (regex.IsMatch (email)) { return ValidationResult.Success; } else { return new ValidationResult (null); }

        }

        [CustomValidation (typeof (UserForSignUpDto), "ValidatePassword")]

        public string Password { get; set; }
        public static ValidationResult ValidatePassword (string password, ValidationContext context) {
            if (password == null) { return new ValidationResult ("Password Is Required"); }
            Regex regex = new Regex (@"^[a-zA-Z0-9_\-\.~!@\#\$%^&\*\+=`\|\\\(\)\{\}\[\]:;'<>,\.\?\/]{8,20}$");
            if (regex.IsMatch (password)) { return ValidationResult.Success; } else { return new ValidationResult (null); }

        }

        public DateTime CreatedUtc { get; set; }
        public DateTime LastActiveUtc { get; set; }
        public UserForSignUpDto () {
            LastActiveUtc = DateTime.UtcNow;
            CreatedUtc = DateTime.UtcNow;
        }

        [Required]
        public GenderEnum Gender { get; set; }
    }
}