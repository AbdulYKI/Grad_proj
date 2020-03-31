import { environment } from "src/environments/environment";
import { AuthService } from "./services/auth.service";
import { Component, OnInit } from "@angular/core";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "gradProj-spa";
  jwtHelper: JwtHelperService = new JwtHelperService();
  public loadingOverlay = true;
  constructor(private router: Router, private authService: AuthService) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    const token = localStorage.getItem(environment.tokenName);
    const user = JSON.parse(localStorage.getItem("info"));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemeberPhotoUrl(
        this.authService.currentUser.photoUrl
      );
    }
  }
  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.startSvgLoading();
    }
    if (event instanceof NavigationEnd) {
      this.stopSvgLoading();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.stopSvgLoading();
    }
    if (event instanceof NavigationError) {
      this.stopSvgLoading();
    }
  }

  private startSvgLoading() {
    this.loadingOverlay = true;
  }

  private stopSvgLoading() {
    setTimeout(() => {
      this.loadingOverlay = false;
    }, 1000);
  }
}
