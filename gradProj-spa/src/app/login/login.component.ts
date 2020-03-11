import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
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
  @ViewChild("splash") splash: ElementRef;

  submitted = true;
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
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
    setTimeout(function() {
      this.splash.classList.add("out");
    }, 1100);
  }

  ngAfterViewInit() {
    this.readyScreen(); //call this method automatically after all Elements is load
  }
  get email() {
    return this.loginForm.get("email");
  }
  get password() {
    return this.loginForm.get("password");
  }
}
