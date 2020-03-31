import { User } from "./../models/User";
import { Router } from "@angular/router";
import { AlertifyService } from "./../services/Alertify.service";
import { AuthService } from "./../services/auth.service";
import { environment } from "./../../environments/environment";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"]
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  fbLogo: string = environment.fbLogo;
  instagramLogo: string = environment.instagramLogo;
  googleLogo: string = environment.googleLogo;
  logo: string = environment.logo;
  submitted = true;
  loaded = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router
  ) {}
  splash = document.getElementById("splash");
  ngOnInit(): void {
    this.readyScreen();
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else {
      const user: User = Object.assign({}, this.loginForm.value);
      this.authService.login(user).subscribe(
        next => {
          this.alertifyService.success("Logged In Successfully");
        },
        error =>
          this.alertifyService.error("Username or Password Is Incorrect"),
        () => {
          this.router.navigate(["/members"]);
        }
      );
    }
  }

  readyScreen() {
    setTimeout(() => (this.loaded = true), 1100);
  }

  get username() {
    return this.loginForm.get("username");
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
