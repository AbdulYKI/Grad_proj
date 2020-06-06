using System.Collections.Generic;
using System.Threading.Tasks;
using grad_proj_api.Data;
using grad_proj_api.Models;
using Newtonsoft.Json;

namespace grad_proj_api.Data
{
    public class Seed
    {
        public Seed(DataContext context)
        {
            _context = context;
        }

        private readonly DataContext _context;

        public async Task SeedCountries()
        {

            var countriesData = System.IO.File.ReadAllText("Models/Countries.json");
            List<Country> countries = JsonConvert.DeserializeObject<List<Country>>(countriesData);

            await _context.Countries.AddRangeAsync(countries);

            _context.SaveChanges();
        }
        public async Task SeedProgrammingLanguages()
        {

            var programmingLanguagesData = System.IO.File.ReadAllText("Models/ProgrammingLanguages.json");
            string[] programmingLanguagesNames = JsonConvert.DeserializeObject<string[]>(programmingLanguagesData);
            var programmingLanguages = new List<ProgrammingLanguage>();
            foreach (string programmingLanguageName in programmingLanguagesNames)
            {
                programmingLanguages.Add(new ProgrammingLanguage { Name = programmingLanguageName });
            }

            await _context.AddRangeAsync(programmingLanguages);
            _context.SaveChanges();
        }
    }
}