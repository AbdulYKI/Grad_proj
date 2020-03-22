import { Patterns } from "./../helper/patterns";
import { GenderEnum } from "./../helper/gender.enum";
import { environment } from "./../../environments/environment";
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked
} from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  AbstractControl
} from "@angular/forms";
import { MustMatch } from "../helper/must-match.validator";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  logo: string = environment.logo;
  fbLogo: string = environment.fbLogo;
  symbols: string = " _-.~!@#$%^&*+=`|(){}[]:;'<>,.?/]";
  instagramLogo: string = environment.instagramLogo;
  googleLogo: string = environment.googleLogo;
  submitted = false;
  constructor(private formBuilder: FormBuilder) {}
  loaded = false;
  ngOnInit(): void {
    this.readyScreen();

    this.registerForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        username: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(Patterns.usernamePattern)
          ]
        ],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(Patterns.passwordPattern)
          ]
        ],
        confirmPassword: ["", Validators.required],
        gender: ["", Validators.required]
      },
      {
        validator: MustMatch("password", "confirmPassword")
      }
    );
  }
  //click submit btn =>

  onSubmit() {
    this.submitted = true;
    //any error filed =>
    if (this.registerForm.invalid) {
      return;
    }
    //else => print info
    else {
      alert(
        "Your Data  : )\n\n" + JSON.stringify(this.registerForm.value, null, 6)
      );
      //.stringify => value json , replacer(null) ,space)
    }
  }

  checkLoading(): string {
    if (this.loaded === true) {
      return "splash out";
    } else {
      return "splash";
    }
  }
  readyScreen() {
    //function load the form
    setTimeout(() => (this.loaded = true), 1100);
  }

  get email(): AbstractControl {
    return this.registerForm.get("email");
  }
  get username(): AbstractControl {
    return this.registerForm.get("username");
  }
  get password(): AbstractControl {
    return this.registerForm.get("password");
  }
  get confirmPassword(): AbstractControl {
    return this.registerForm.get("confirmPassword");
  }
  get gender(): AbstractControl {
    return this.registerForm.get("gender");
  }
  get genderEnum() {
    return GenderEnum;
  }
  get patterns() {
    return Patterns;
  }
}
