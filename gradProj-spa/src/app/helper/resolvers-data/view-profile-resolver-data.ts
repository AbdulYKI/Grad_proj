import { User } from "src/app/models/user";
import { ProgrammingLanguage } from "../../models/programming-language";
import { Country } from "../../models/country";
export class ViewProfileResolverData {
  countries: Country[];
  programmingLanguages: ProgrammingLanguage[];
  user: User;
  constructor(
    countries: Country[],
    programmingLanguages: ProgrammingLanguage[],
    user: User
  ) {
    this.countries = countries;
    this.programmingLanguages = programmingLanguages;
    this.user = user;
  }
}
