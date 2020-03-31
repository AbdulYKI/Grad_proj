import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  // I added this so I can overwrite the multiselect styles :D
  ViewEncapsulation,
  HostListener
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators,
  NgForm
} from "@angular/forms";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  isCollapsed = true;
  @ViewChild("datePicker")
  datePicker: any;

  faCalender = faCalendar;
  minDate = {
    year: new Date(Date.now()).getFullYear() - 100,
    month: 1,
    day: 1
  };
  maxDate = {
    year: new Date(Date.now()).getFullYear() - 1,
    month: 12,
    day: 31
  };
  displayMonths = 1;
  navigation = "select";
  showWeekNumbers = false;
  outsideDays = "visible";
  activeButton = "btn1";
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  constructor(private formBuilder: FormBuilder) {}
  editProfileForm: FormGroup;
  @ViewChild("editForm") editForm: NgForm;
  @HostListener("window:beforeunload", ["$event"])
  onWindowClose($event: any): void {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  ngOnInit(): void {
    this.editProfileForm = this.formBuilder.group({
      dateOfBirth: [null],
      companyName: [""],
      firstName: [""],
      lastName: [""],
      description: [""],
      schoolName: [""],
      country: [""],
      programmingLanguages: [""]
    });
    this.dropdownList = [
      { item_id: 1, item_text: "C++" },
      { item_id: 2, item_text: "C#" },
      { item_id: 3, item_text: "Java" },
      { item_id: 4, item_text: "Javascript" },
      { item_id: 5, item_text: "TypeScript" }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "Unselect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  ngAfterViewInit() {
    this.editProfileForm
      .get("dateOfBirth")
      .setValidators([this.validateAge, this.datePicker]);
  }

  onSubmit() {
    console.log(this.editProfileForm.value);
  }
  ToggleSideBar() {
    this.isCollapsed = !this.isCollapsed;
  }
  validateAge(control: AbstractControl) {
    const today = new Date();
    if (control.value == null) return null;
    const birthDate = new Date(control.value);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 ? null : { underAge: true };
  }
  setActive = function(buttonName) {
    this.activeButton = buttonName;
  };
  isActive = function(buttonName) {
    return this.activeButton === buttonName;
  };
  get dateOfBirth() {
    return this.editProfileForm.get("dateOfBirth");
  }
}
