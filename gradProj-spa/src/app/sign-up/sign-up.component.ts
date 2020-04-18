import { SharedService } from "./../services/shared.service";
import { Patterns } from "./../helper/patterns";
import { GenderEnum } from "./../helper/gender.enum";
import { environment } from "./../../environments/environment";
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
} from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { MustMatch } from "../helper/must-match.validator";
import { User } from "../models/User";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { AlertifyService } from "../services/alertify.service";
import { LanguageEnum } from "../helper/language.enum";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;

  logo: string = environment.logo;
  fbLogo: string = environment.fbLogo;
  symbols: string = " _-.~!@#$%^&*+=`|(){}[]:;'<>,.?/]";
  instagramLogo: string = environment.instagramLogo;
  googleLogo: string = environment.googleLogo;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertifyService: AlertifyService,
    private sharedService: SharedService
  ) {}
  loaded = false;
  ngOnInit(): void {
    this.readyScreen();

    this.signupForm = this.formBuilder.group(
      {
        email: [
          "",
          [Validators.required, Validators.pattern(Patterns.emailPattern)],
        ],
        username: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(Patterns.usernamePattern),
          ],
        ],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(Patterns.passwordPattern),
          ],
        ],
        confirmPassword: ["", Validators.required],
        gender: [null, Validators.required],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      }
    );
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    } else {
      const user: User = Object.assign({}, this.signupForm.value);
      this.authService.signUp(user).subscribe(
        () => {
          this.alertifyService.success(this.Lexicon.signedUpSucessFullyMessage);
        },
        (error) => {
          this.alertifyService.error(error);
        },
        () => {
          this.authService.signIn(user).subscribe(
            () => this.router.navigate([""]),
            (error) => {
              this.alertifyService.error(error);
            }
          );
        }
      );
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

  get Email(): AbstractControl {
    return this.signupForm.get("email");
  }
  get Username(): AbstractControl {
    return this.signupForm.get("username");
  }
  get Password(): AbstractControl {
    return this.signupForm.get("password");
  }
  get ConfirmPassword(): AbstractControl {
    return this.signupForm.get("confirmPassword");
  }
  get Gender(): AbstractControl {
    return this.signupForm.get("gender");
  }
  get GenderEnum() {
    return GenderEnum;
  }
  get Patterns() {
    return Patterns;
  }
  get Lexicon() {
    return this.sharedService.Lexicon;
  }
  get ContainerClasses() {
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
