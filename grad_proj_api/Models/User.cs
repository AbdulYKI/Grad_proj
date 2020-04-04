using System;
using System.Collections.Generic;
using grad_proj_api.Helpers;

namespace grad_proj_api.Models {
    public class User {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public byte[] PasswordSalt { get; set; }
        public byte[] PasswordHash { get; set; }
        public bool CreatedWithGoogle { get; set; }
        public GenderEnum Gender { get; set; }
        public string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime CreatedUTC { get; set; }
        public DateTime? LastActiveUTC { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string SchoolName { get; set; }
        public Country Country { get; set; }
        public int? CountryNumericCode { get; set; }
        public Photo Photo { get; set; }
        public ICollection<UserProgrammingLanguage> UserProgrammingLanguages { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }

    }
}