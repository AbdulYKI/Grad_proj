using System.ComponentModel.DataAnnotations;

namespace grad_proj_api.DTOs
{
    public class UserForEditDTO
    {
        public string Description { get; set; }
        public string SchoolName { get; set; }
        public string CompanyName { get; set; }
    }
}