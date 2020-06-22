using System;
using System.Collections.Generic;
using grad_proj_api.Helpers;

namespace grad_proj_api.Models
{
    public class User
    {


        public int Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public byte[] PasswordSalt { get; set; }
        public byte[] PasswordHash { get; set; }
        public bool CreatedWithGoogle { get; set; }
        public Gender Gender { get; set; }
        public string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime CreatedUtc { get; set; }
        public DateTime? LastActiveUtc { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }
        public string SchoolName { get; set; }
        public Country Country { get; set; }
        public int? CountryNumericCode { get; set; }
        public Photo Photo { get; set; }

        public ICollection<UserProgrammingLanguage> UserProgrammingLanguages { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<ViewedPost> ViewedPosts { get; set; }
        public ICollection<UpVotedPost> UpVotedPosts { get; set; }
        public ICollection<DownVotedPost> DownVotedPosts { get; set; }

        public bool IsAdmin { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<UpVotedComment> UpVotedComments { get; set; }

        public ICollection<DownVotedComment> DownVotedComments { get; set; }

        public DateTime? DateUpdatedUtc { get; set; }
    }
}