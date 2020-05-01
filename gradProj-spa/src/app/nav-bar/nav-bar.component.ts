import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AlertifyService } from "./../services/alertify.service";
import { AuthService } from "./../services/auth.service";
import {
  Component,
  OnInit,
  HostListener,
  ViewEncapsulation,
} from "@angular/core";
import { environment } from "src/environments/environment";
import { SharedService } from "../services/shared.service";
import { LanguageEnum } from "../helper/enums/language.enum";
import { englishLexicon } from "../helper/lexicon/english.lexicon";
import { arabicLexicon } from "../helper/lexicon/arabic.lexicon";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
  isMenuCollapsed = true;
  scrolled = 0;
  logoUrl = environment.logo;
  photoUrl: string;
  destroy: Subject<boolean> = new Subject<boolean>();
  defaultPhoto = environment.defaultPhoto;
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.authService.currentPhotoUrl
      .pipe(takeUntil(this.destroy))
      .subscribe((newPhotoUrl) => {
        this.photoUrl = newPhotoUrl;
      });
  }

  toggleMenuCollapsed() {
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
    this.alertifyService.message(this.lexicon.signedOutMessage);
    this.router.navigate(["./"]);
  }

  get name() {
    return this.authService.decodedToken.unique_name;
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
  get sideSectionClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.English) {
      return "side-section nav-item ml-0 ml-md-2 ml-lg-4";
    } else {
      return "side-section-rtl nav-item ml-0 ml-md-2 ml-lg-4";
    }
  }
  closeCollapse() {
    this.isMenuCollapsed = true;
  }
  ngOnDestory() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
