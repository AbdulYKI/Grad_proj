using System;
using System.Collections.Generic;
using grad_proj_api.Helpers;

namespace grad_proj_api.Dtos {
    public class UserToReturnDto {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public GenderEnum Gender { get; set; }
        public string SchoolName { get; set; }
        public string CompanyName { get; set; }
        public DateTime CreatedUtc { get; set; }
        public DateTime? LastActiveUtc { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Description { get; set; }
        public string CountryName { get; set; }
        public int? Age { get; set; }
        public int? CountryNumericCode { get; set; }
        public List<int> ProgrammingLanguagesIds { get; set; }
        public string PhotoUrl { get; set; }
        public string CountryAlpha2Code { get; set; }
    }
}