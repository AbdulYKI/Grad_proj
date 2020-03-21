import { environment } from "./../../environments/environment";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { MustMatch } from "../helper/must-match.validator";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  fbLogo: string = environment.fbLogo;
  instagramLogo: string = environment.instagramLogo;
  googleLogo: string = environment.googleLogo;
  logo: string = environment.logo;
  submitted = true;
  loaded = false;
  constructor(private formBuilder: FormBuilder) {}
  splash = document.getElementById("splash");
  ngOnInit(): void {
    this.readyScreen();
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  //click submit btn =>

  onSubmit() {
    this.submitted = true;
    //any error filed =>
    if (this.loginForm.invalid) {
      return;
    }
    //else => print info
    else {
      console.log(this.loginForm);
      alert(
        "Your Data  : )\n\n" + JSON.stringify(this.loginForm.value, null, 6)
      );
      //.stringify => value json , replacer(null) ,space)
    }
  }

  readyScreen() {
    //function load the form
    setTimeout(() => (this.loaded = true), 1100);
  }

  get email() {
    return this.loginForm.get("email");
  }
  get password() {
    return this.loginForm.get("password");
  }
  checkLoading(): string {
    if (this.loaded === true) {
      return "splash out";
    } else {
      return "splash";
    }
  }
}
