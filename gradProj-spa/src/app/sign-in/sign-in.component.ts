import { SharedService } from "./../services/shared.service";
import { User } from "./../models/User";
import { Router } from "@angular/router";
import { AlertifyService } from "./../services/alertify.service";
import { AuthService } from "./../services/auth.service";
import { environment } from "./../../environments/environment";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { LanguageEnum } from "../helper/enums/language.enum";
@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
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
    private router: Router,
    private sharedService: SharedService
  ) {}
  splash = document.getElementById("splash");
  ngOnInit(): void {
    this.readyScreen();
    this.signInForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      return;
    } else {
      const user: User = Object.assign({}, this.signInForm.value);
      this.authService.signIn(user).subscribe(
        (next) => {
          this.alertifyService.success(
            this.lexicon.signedInSuccessFullyMessage
          );
        },
        (error) =>
          this.alertifyService.error(this.lexicon.signedInFailedMessage),
        () => {
          this.router.navigate(["/home"]);
        }
      );
    }
  }

  readyScreen() {
    setTimeout(() => (this.loaded = true), 1100);
  }

  get username() {
    return this.signInForm.get("username");
  }
  get password() {
    return this.signInForm.get("password");
  }
  checkLoading(): string {
    if (this.loaded === true) {
      return "splash out";
    } else {
      return "splash";
    }
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get containerClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.English) {
      return "container";
    } else {
      return "container rtl";
    }
  }
  formControlClasses(control: AbstractControl) {
    if (control.errors && control.touched) {
      return "form-control is-invalid";
    } else {
      return "form-control";
    }
  }
}
