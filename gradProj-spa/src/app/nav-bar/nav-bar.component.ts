import { Component, OnInit, HostListener } from "@angular/core";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"]
})
export class NavBarComponent implements OnInit {
  isMenuCollapsed = true;
  scrolled = 0;
  constructor() {}

  ngOnInit() {}

  ToggleMenuCollapsed() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll($event) {
    this.scrolled = window.scrollY;
  }

  onScroll(): string {
    console.log(window.scrollY);
    if (window.scrollY >= 15) {
      return "scroll-on";
    } else {
      return "start-header";
    }
  }
}
