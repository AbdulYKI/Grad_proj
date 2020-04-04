using System.Collections.Generic;

namespace grad_proj_api.Models
{
    public class ProgrammingLanguage
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<UserProgrammingLanguage> Users { get; set; }

    }

}