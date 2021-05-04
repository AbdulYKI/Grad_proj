import { AuthService } from "./../../services/auth.service";
import { ProgrammingLanguagesModalComponent } from "./../programming-languages-modal/programming-languages-modal.component";
import { User } from "src/app/models/user";
import { SharedService } from "./../../services/shared.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
import {
  faCalendar,
  faCamera,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { takeUntil } from "rxjs/operators";
import { ViewProfileResolverData } from "src/app/helper/resolvers-data/view-profile-resolver-data";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs";
import { ProgrammingLanguage } from "src/app/models/programming-language";
import { Country } from "src/app/models/country";
import { GenderEnum } from "src/app/helper/enums/gender.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalOptions, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewProfileComponent implements OnInit {
  user: User;
  modalOption: NgbModalOptions = {};
  countriesDataSource: Country[];
  selectedProgrammingLanguages: ProgrammingLanguage[];
  programmingLanguagesDataSource: ProgrammingLanguage[];
  destroy: Subject<boolean> = new Subject<boolean>();
  programmingLanguagesDropDownSettings: any;
  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (data: { viewProfileResolverData: ViewProfileResolverData }) => {
          this.user = data.viewProfileResolverData.user;
          this.user.photoUrl = this.user.photoUrl || environment.defaultPhoto;
          this.setProgrammingLanguagesDataSource(
            data.viewProfileResolverData.programmingLanguages
          );
          this.setCountriesDataSource(data.viewProfileResolverData.countries);
          this.setSelectedProgrammingLanguages();
        }
      );
    this.setProgrammingLanguagesDropDownOptions();
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get isLanguageArabic() {
    return this.sharedService.LanguageSubject.value === LanguageEnum.Arabic;
  }
  private setProgrammingLanguagesDataSource(
    programmingLanguages: ProgrammingLanguage[]
  ) {
    this.programmingLanguagesDataSource = programmingLanguages;
    this.programmingLanguagesDataSource.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
  }
  private setCountriesDataSource(countries: Country[]) {
    this.countriesDataSource = countries;
  }
  get faCalendar() {
    return faCalendar;
  }
  private setSelectedProgrammingLanguages() {
    this.selectedProgrammingLanguages = this.programmingLanguagesDataSource.filter(
      (pl) =>
        this.user.programmingLanguagesIds.find((uplId) => uplId === pl.id) !==
        undefined
    );
  }
  get userGenderName() {
    if (this.user.gender === GenderEnum.None) {
      return "";
    } else if (this.user.gender === GenderEnum.Male) {
      return this.lexicon.male;
    } else if (this.user.gender === GenderEnum.Female) {
      return this.lexicon.female;
    } else {
      return this.lexicon.other;
    }
  }
  get localeCode() {
    return this.sharedService.localeCode;
  }

  private setProgrammingLanguagesDropDownOptions() {
    this.programmingLanguagesDropDownSettings = {
      primaryKey: "id",
      labelKey: "name",
      searchBy: ["name"],
      singleSelection: false,
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "multiselect-dropdown",
      text: "",
      disabled: true,
      lazyLoading: true,
    };
  }
  showProgrammingLanguagesModal() {
    if (this.selectedProgrammingLanguages.length > 0) {
      this.modalOption.backdrop = "static";
      this.modalOption.keyboard = false;
      const modalRef = this.modalService.open(
        ProgrammingLanguagesModalComponent,
        this.modalOption
      );
      modalRef.componentInstance.programmingLanguagesDataSource = this.programmingLanguagesDataSource;
      modalRef.componentInstance.selectedProgrammingLanguages = this.selectedProgrammingLanguages;
    }
  }
  get faEnvelope() {
    return faEnvelope;
  }
  navigateToChat() {
    if (!this.authService.signedIn()) {
      this.router.navigate(["/sign-in"]);
    } else {
      this.router.navigate(["/message/" + this.user.id]);
    }
  }
  isSignedIn() {
    return this.authService.signedIn();
  }
}
