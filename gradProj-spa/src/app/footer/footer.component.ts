import { SharedService } from "./../services/shared.service";
import { Component, OnInit } from "@angular/core";
import { LanguageEnum } from "../helper/language.enum";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  constructor(private sharedService: SharedService) {}
  language: LanguageEnum = LanguageEnum.Arabic;
  ngOnInit() {}
  changeLanguage(language: LanguageEnum) {
    localStorage.setItem("language", language.toString());
    this.sharedService.changeLanguage(language as LanguageEnum);
  }
  get LanguageEnum() {
    return LanguageEnum;
  }
}
