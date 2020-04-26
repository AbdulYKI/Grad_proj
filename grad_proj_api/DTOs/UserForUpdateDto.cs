using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using grad_proj_api.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace grad_proj_api.Dtos {
    public class UserForUpdateDto {
        public GenderEnum Gender { get; set; }
        public string SchoolName { get; set; }
        public string CompanyName { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Description { get; set; }
        public string CountryName { get; set; }

        [CustomValidation (typeof (UserForUpdateDto), "ValidateAge")]
        public DateTime? DateOfBirth { get; set; }
        public int? CountryNumericCode { get; set; }
        public List<int> ProgrammingLanguagesIds { get; set; }
        public string PhotoUrl { get; set; }
        public static ValidationResult ValidateAge (DateTime? dateOfBirth, ValidationContext context) {
            if (dateOfBirth == null)
                return null;
            var age = dateOfBirth.CalculateAge ();

            return (age < 8) ?
                new ValidationResult (null) :
                ValidationResult.Success;
        }
        public IFormFile PhotoFile { get; set; }

        public DateTime DateUpdatedUtc { get; set; }

        public UserForUpdateDto () {
            DateUpdatedUtc = DateTime.UtcNow;
        }
    }

}