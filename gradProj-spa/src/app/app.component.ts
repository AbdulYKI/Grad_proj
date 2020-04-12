import { SharedService } from "./services/shared.service";
import { environment } from "src/environments/environment";
import { AuthService } from "./services/auth.service";
import { Component, OnInit } from "@angular/core";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LanguageEnum } from "./helper/language.enum";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "gradProj-spa";
  jwtHelper: JwtHelperService = new JwtHelperService();
  public loadingOverlay = true;
  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    const token = localStorage.getItem(environment.tokenName);
    const user = JSON.parse(localStorage.getItem("info"));
    const language = JSON.parse(localStorage.getItem("language"));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemeberPhotoUrl(
        this.authService.currentUser.photoUrl
      );
    }
    if (language) {
      this.sharedService.changeLanguage(language as LanguageEnum);
    } else {
      this.sharedService.changeLanguage(LanguageEnum.Arabic);
    }
  }
  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.startLoadingSVG();
    }
    if (event instanceof NavigationEnd) {
      this.stopLoadingSvg();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.stopLoadingSvg();
    }
    if (event instanceof NavigationError) {
      this.stopLoadingSvg();
    }
  }

  private startLoadingSVG() {
    this.loadingOverlay = true;
  }

  private stopLoadingSvg() {
    setTimeout(() => {
      this.loadingOverlay = false;
    }, 1000);
  }
}
