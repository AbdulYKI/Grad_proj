import { Router } from "@angular/router";
import { AlertifyService } from "./../services/alertify.service";
import { AuthService } from "./../services/auth.service";
import { Component, OnInit, HostListener } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"]
})
export class NavBarComponent implements OnInit {
  isMenuCollapsed = true;
  scrolled = 0;
  photoUrl: string;
  defaultPhoto = environment.defaultPhoto;
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {}

  ToggleMenuCollapsed() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll($event) {
    this.scrolled = window.scrollY;
  }

  onScroll(): string {
    if (window.scrollY >= 15) {
      return "scroll-on";
    } else {
      return "start-header";
    }
  }
  signedIn() {
    return this.authService.signedIn();
  }
  signOut() {
    localStorage.removeItem(environment.tokenName);
    localStorage.removeItem("info");
    this.authService.currentUser = null;
    this.authService.decodedToken = null;
    this.alertifyService.message("Good Bye");
    this.router.navigate(["./"]);
  }

  get name() {
    return this.authService.decodedToken.unique_name;
  }
}
