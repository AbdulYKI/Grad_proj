import { AlertifyService } from "./../services/alertify.service";
import { AuthService } from "./../services/auth.service";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}
  canActivate(): boolean {
    if (this.auth.signedIn()) {
      return true;
    }
    this.alertify.warning("Please make sure you are signed in.");
    this.router.navigate(["sign-in"]);
    return false;
  }
}
