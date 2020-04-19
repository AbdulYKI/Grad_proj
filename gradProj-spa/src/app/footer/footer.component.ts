import { SharedService } from "./../services/shared.service";
import { Component, OnInit } from "@angular/core";
import { LanguageEnum } from "../helper/language.enum";
import { faPhone, faMapMarker, faAt } from "@fortawesome/free-solid-svg-icons";
import { Subject } from "rxjs";
@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  constructor(private sharedService: SharedService) {}
  language: LanguageEnum = LanguageEnum.Arabic;
  isMenuCollapsed = true;

  ngOnInit() {}
  changeLanguage(language: LanguageEnum) {
    localStorage.setItem("language", language.toString());
    this.sharedService.changeLanguage(language as LanguageEnum);
  }
  get LanguageEnum() {
    return LanguageEnum;
  }
  get FaMapMarker() {
    return faMapMarker;
  }
  get FaAt() {
    return faAt;
  }
  get FaPhone() {
    return faPhone;
  }
  ToggleMenuCollapsed() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  get Lexicon() {
    return this.sharedService.Lexicon;
  }
  get RtlClass() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "rtl";
    }
    return "";
  }
}
