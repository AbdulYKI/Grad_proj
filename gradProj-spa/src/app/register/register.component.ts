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
  FormBuilder
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
        username: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
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
      console.log(this.registerForm);
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

  get email() {
    return this.registerForm.get("email");
  }
  get username() {
    return this.registerForm.get("username");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }
  get gender() {
    return this.registerForm.get("gender");
  }
}
