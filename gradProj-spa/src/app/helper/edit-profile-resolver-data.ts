import { User } from "src/app/models/user";
import { ProgrammingLanguage } from "./../models/programming-language";
import { Country } from "../models/country";
export class EditProfileResolverData {
  countries: Country[];
  programmingLanguages: ProgrammingLanguage[];
  user: User;
}
