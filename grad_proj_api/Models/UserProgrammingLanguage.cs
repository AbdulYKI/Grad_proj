namespace grad_proj_api.Models
{
    public class UserProgrammingLanguage
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int ProgrammingLanguageId { get; set; }
        public ProgrammingLanguage ProgrammingLanguage { get; set; }
    }
}