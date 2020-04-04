using System.Collections.Generic;
using grad_proj_api.Data;
using grad_proj_api.Models;
using Newtonsoft.Json;

namespace Hello.API.Data
{
    public class Seed
    {
        public Seed(DataContext context)
        {
            _context = context;
        }

        private readonly DataContext _context;

        public void SeedCountries()
        {

            var countriesData = System.IO.File.ReadAllText("Models/Countries.json");
            List<Country> countries = JsonConvert.DeserializeObject<List<Country>>(countriesData);

            foreach (var country in countries)
                _context.Countries.Add(country);


            _context.SaveChanges();
        }
        public void SeedProgrammingLanguages()
        {

            var programmingLanguagesData = System.IO.File.ReadAllText("Models/ProgrammingLanguages.json");
            string[] programmingLanguagesNames = JsonConvert.DeserializeObject<string[]>(programmingLanguagesData);

            foreach (var programmingLanguageName in programmingLanguagesNames)
                _context.ProgrammingLanguages.Add(new ProgrammingLanguage { Name = programmingLanguageName });


            _context.SaveChanges();
        }
    }
}