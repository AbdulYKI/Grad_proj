import { STATES } from "./helper/states";
import { Component } from "@angular/core";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "gradProj-spa";
  public loadingOverlay = true;
  public loadingState = STATES.svgLoading;
  constructor(private router: Router) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
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
    this.loadingState = STATES.svgLoading;
  }

  private stopSvgLoading() {
    this.loadingState = STATES.svgFinishedLoading;
    setTimeout(() => {
      this.loadingOverlay = false;
    }, 2500);
  }
}
