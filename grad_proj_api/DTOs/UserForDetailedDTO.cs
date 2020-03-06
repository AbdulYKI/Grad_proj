using System;
using System.Collections.Generic;
using grad_proj_api.Models;

namespace grad_proj_api.DTOs
{
    public class UserForDetailedDTO
    {
        public int Id { get; set; }

        public string Gender { get; set; }

        public int Age { get; set; }

        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Description { get; set; }
        public string CompanyName { get; set; }

        public string Alpha2Code { get; set; }
        public string SchoolName { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; }
        public ICollection<PhotoForDetailedDTO> Photos { get; set; }
    }
}