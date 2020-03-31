import { GenderEnum } from "./../helper/gender.enum";
//for login always use username
export class User {
  username: string;
  confirmPassword: string;
  email: string;
  password: string;
  photoUrl: string;
  firstName: string;
  lastName: string;
  Gender: GenderEnum;
  dateOfBirth: Date;
  lastActiveUtc: Date;
  description: string;
  createdUtc: Date;
  companyName: string;
  schoolName: string;
  countryNumericCode: number;
}
