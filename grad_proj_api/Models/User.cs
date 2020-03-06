using System;
using System.Collections.Generic;

namespace grad_proj_api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] PasswordSalt { get; set; }
        public byte[] PasswordHash { get; set; }

        public string Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string SchoolName { get; set; }
        public Country Country { get; set; }
        public int CountryNumericCode { get; set; }
        public ICollection<Photo> Photos { get; set; }

        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
    }
}