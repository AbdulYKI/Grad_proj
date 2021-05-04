import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SharedService } from "src/app/services/shared.service";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ProgrammingLanguage } from "src/app/models/programming-language";

@Component({
  selector: "app-programming-languages-modal",
  templateUrl: "./programming-languages-modal.component.html",
  styleUrls: ["./programming-languages-modal.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ProgrammingLanguagesModalComponent implements OnInit {
  constructor(
    private sharedService: SharedService,
    public activeModal: NgbActiveModal
  ) {}
  // this is an input prop
  programmingLanguagesDataSource: ProgrammingLanguage[] = [];
  // this is an input prop
  selectedProgrammingLanguages: ProgrammingLanguage[] = [];
  filteredSelectedProgrammingLanguages: ProgrammingLanguage[] = [];
  programmingLanguagesDropDownSettings = {
    primaryKey: "id",
    labelKey: "name",
    searchBy: ["name"],
    classes: "multiselect-dropdown",
    text: "",
    disabled: true,
    lazyLoading: true,
  };
  ngOnInit() {
    this.filteredSelectedProgrammingLanguages = this.selectedProgrammingLanguages;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get isLanguageArabic() {
    return this.sharedService.LanguageSubject.value === LanguageEnum.Arabic;
  }
  closeModal() {
    this.activeModal.dismiss("Cross click");
  }
  onSearchChange(searchString: string) {
    this.filteredSelectedProgrammingLanguages = this.selectedProgrammingLanguages.filter(
      (pl) => {
        return pl.name.toLowerCase().includes(searchString.toLowerCase());
      }
    );
  }
}
