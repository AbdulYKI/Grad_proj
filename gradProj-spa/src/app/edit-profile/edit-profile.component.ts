import { environment } from "./../../environments/environment";
import { CustomDatePicker } from "./../helper/custom-date-picker";
import { LanguageEnum } from "./../helper/language.enum";
import { SharedService } from "./../services/shared.service";
import { NgbDatePickerValue } from "./../helper/ngb-date-picker-value";
import { EditProfileResolverData } from "./../helper/edit-profile-resolver-data";
import { ProgrammingLanguage } from "./../models/programming-language";
import { User } from "./../models/User";
import {
  Component,
  OnInit,
  ViewChild,
  // I added this so I can overwrite the multiselect styles :D
  ViewEncapsulation,
  HostListener,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators,
  NgForm,
} from "@angular/forms";
import { faCalendar, faCamera } from "@fortawesome/free-solid-svg-icons";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../services/user.service";
import { AlertifyService } from "../services/alertify.service";
import { AuthService } from "../services/auth.service";
import { takeUntil } from "rxjs/operators";
import { GenderEnum } from "../helper/gender.enum";
import { Country } from "../models/country";
import {
  NgbDatepickerI18n,
  NgbModalOptions,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";

import { PhotoUploaderComponent } from "../photo-uploader/photo-uploader.component";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatePicker }],
})
export class EditProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  isCollapsed = true;
  @ViewChild("datePicker")
  datePicker: any;
  destroy: Subject<boolean> = new Subject<boolean>();
  photoExtensions = ["jpeg", "jpg", "gif", "png"];
  minDate: NgbDatePickerValue;
  maxDate: NgbDatePickerValue;
  chosenphoto: File = null;
  displayMonths = 1;
  user: User;
  navigation = "select";
  showWeekNumbers = false;
  programmingLanguagesPlaceHolder: string;
  outsideDays = "visible";
  activeButton = "btn1";
  photoUrl = "";
  programmingLanguagesDataSource: ProgrammingLanguage[] = [];
  flagClass: string;
  selectedProgrammingLanguages: ProgrammingLanguage[] = [];
  countriesDataSource: Country[] = [];
  modalOption: NgbModalOptions = {};
  programmingLanguagesDropDownSettings: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private sharedService: SharedService,
    private modalService: NgbModal
  ) {
    this.minDate = new NgbDatePickerValue(
      new Date(Date.now()).getFullYear() - 100,
      1,
      1
    );

    this.maxDate = new NgbDatePickerValue(
      new Date(Date.now()).getFullYear() - 1,
      12,
      31
    );
  }
  editFormGroup: FormGroup;
  @ViewChild("editForm") editForm: NgForm;
  @HostListener("window:beforeunload", ["$event"])
  onWindowClose($event: any): void {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  ngOnInit(): void {
    this.authService.currentPhotoUrl.subscribe((newPhotoUrl) => {
      this.photoUrl = newPhotoUrl;
    });
    this.sharedService.currentLanguage.subscribe((language) => {
      this.setProgrammingLanguagesDropDownOptions();
    });
    this.BuildProfileFormGroup();
    this.programmingLanguagesPlaceHolder = this.Lexicon.programmingLanguagesPlaceHolder;
    this.route.data.subscribe(
      (data: { EditProfileResolverData: EditProfileResolverData }) => {
        this.user = data.EditProfileResolverData.user;
        this.photoUrl = this.user.photoUrl || environment.defaultPhoto;
        this.setProfileFormData();
        this.setProgrammingLanguagesDataSource(
          data.EditProfileResolverData.programmingLanguages
        );
        this.setCountriesDataSource(data.EditProfileResolverData.countries);
        this.setSelectedProgrammingLanguages();
      }
    );

    this.setProgrammingLanguagesDropDownOptions();
  }
  private setProgrammingLanguagesDropDownOptions() {
    this.programmingLanguagesDropDownSettings = {
      primaryKey: "id",
      labelKey: "name",
      searchBy: ["name"],
      singleSelection: false,
      text: this.Lexicon.programmingLanguagesPlaceHolder,
      selectAllText: this.Lexicon.selectAll,
      unSelectAllText: this.Lexicon.unselectAll,
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "multiselect-dropdown",
      lazyLoading: true,
      filterSelectAllText: this.Lexicon.filterSelectAll,
      filterUnSelectAllText: this.Lexicon.filterUnSelectAll,
      searchPlaceholderText: this.Lexicon.searchPlaceholder,
    };
  }

  private BuildProfileFormGroup() {
    this.editFormGroup = this.formBuilder.group({
      dateOfBirth: [null],
      companyName: [""],
      firstName: [""],
      lastName: [""],
      description: [""],
      schoolName: [""],
      countryNumericCode: [null],
      programmingLanguages: [[]],
      gender: [null],
      photo: ["", []],
    });
  }
  private setProgrammingLanguagesDataSource(
    programmingLanguages: ProgrammingLanguage[]
  ) {
    this.programmingLanguagesDataSource = programmingLanguages;
    this.programmingLanguagesDataSource.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
  }
  private setSelectedProgrammingLanguages() {
    this.selectedProgrammingLanguages = this.programmingLanguagesDataSource.filter(
      (pl) =>
        this.user.programmingLanguagesIds.find((uplId) => uplId === pl.id) !==
        undefined
    );
    this.selectedProgrammingLanguages.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
  }

  private setCountriesDataSource(countries: Country[]) {
    this.countriesDataSource = countries;
  }

  private setProfileFormData() {
    this.editFormGroup.reset(this.user);

    if (this.user.dateOfBirth != null) {
      // for some reason dateOfBirth gets casted to string so I need to create a date object from it
      const dob = new Date(this.user.dateOfBirth);
      this.DateOfBirth.reset({
        year: dob.getFullYear(),
        month: dob.getMonth(),
        day: dob.getDay(),
      });
    }

    if (this.user.countryAlpha2Code != null) {
      this.flagClass = "flag " + this.user.countryAlpha2Code.toLowerCase();
    }
  }

  ngAfterViewInit() {
    this.editFormGroup
      .get("dateOfBirth")
      .setValidators([this.validateAge, this.datePicker]);
  }

  onSubmit() {
    if (this.editFormGroup.valid) {
      const user: User = this.getNewUserData();
      this.userService
        .updateUser(this.authService.decodedToken.nameid as number, user)
        .pipe(takeUntil(this.destroy))
        .subscribe(
          (next) => {
            this.alertifyService.success(
              this.Lexicon.updatedSuccessfullyMessage
            );
            // I need to save the DateOfBirth value so I can use it after resetting the form
            const dateOfBirthValue = this.DateOfBirth.value;
            this.editForm.reset(user);
            this.Photo.reset("");
            this.DateOfBirth.reset(dateOfBirthValue);
          },
          (error) => this.alertifyService.error(error)
        );
    }
  }
  private getNewUserData() {
    const user: User = Object.assign({}, this.editFormGroup.value);
    user.photoFile = this.chosenphoto;
    user.programmingLanguagesIds = (this.editFormGroup.value
      .programmingLanguages as ProgrammingLanguage[]).map(({ id }) => id);
    if (this.DateOfBirth.value == null) {
      user.dateOfBirth = null;
    } else {
      const birthDate = new Date(
        this.DateOfBirth.value.year +
          "-" +
          this.DateOfBirth.value.month +
          "-" +
          this.DateOfBirth.value.day
      );
      user.dateOfBirth = birthDate;
    }

    return user;
  }

  ToggleSideBar() {
    this.isCollapsed = !this.isCollapsed;
  }
  validateAge(control: AbstractControl) {
    const today = new Date();
    if (control.value == null) {
      return null;
    }
    const birthDate = new Date(
      control.value.year + "-" + control.value.month + "-" + control.value.day
    );
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 8 ? null : { underAge: true };
  }
  setActive(buttonName: string) {
    this.activeButton = buttonName;
  }
  isActive(buttonName) {
    return this.activeButton === buttonName;
  }
  get DateOfBirth() {
    return this.editFormGroup.get("dateOfBirth");
  }
  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
  get GenderEnum() {
    return GenderEnum;
  }

  onChange(selectedCountryNumericCode: number) {
    const country = this.countriesDataSource.find(
      (c) => c.numericCode === selectedCountryNumericCode
    );
    this.flagClass = "flag " + country.alpha2Code.toLowerCase();
  }
  get Lexicon() {
    return this.sharedService.Lexicon;
  }
  get FaCamera() {
    return faCamera;
  }
  get FaCalendar() {
    return faCalendar;
  }
  get FormLabelClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.English) {
      return "form-label";
    } else {
      return "form-label form-label-rtl";
    }
  }
  get FormClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.English) {
      return "form";
    } else {
      return "form rtl";
    }
  }
  onSelectAll(newProgrammingLanguages: ProgrammingLanguage[]) {
    this.selectedProgrammingLanguages = newProgrammingLanguages;
  }
  onDeSelectAll(event: any) {
    this.editForm.form.controls.programmingLanguages.markAsDirty();
    this.editForm.form.controls.programmingLanguages.markAsTouched();
    this.selectedProgrammingLanguages = [];
  }
  get DateOfBirthClasses() {
    if (this.DateOfBirth.errors && this.DateOfBirth.touched) {
      return "form-control is-invalid";
    } else {
      return "form-control";
    }
  }

  get Photo() {
    return this.editFormGroup.get("photo");
  }

  openImageUploaderModal() {
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(
      PhotoUploaderComponent,
      this.modalOption
    );
    modalRef.componentInstance.photoUrl = this.user.photoUrl;
  }
}
