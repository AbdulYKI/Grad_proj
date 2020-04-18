import { GenderEnum } from "./../helper/gender.enum";

export class User {
  username: string;
  confirmPassword: string;
  email: string;
  password: string;
  photoUrl: string;
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  dateOfBirth: Date;
  lastActiveUtc: Date;
  description: string;
  createdUtc: Date;
  companyName: string;
  schoolName: string;
  countryNumericCode: number;
  countryAlpha2Code: string;
  programmingLanguagesIds: number[];
  photoFile: File;
}
