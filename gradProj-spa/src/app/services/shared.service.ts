import { LanguageEnum } from "./../helper/language.enum";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { englishLexicon } from "../helper/english.lexicon";
import { arabicLexicon } from "../helper/arabic.lexicon";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  currentLanguage = new BehaviorSubject<LanguageEnum>(LanguageEnum.Arabic);
  localeCode = "ar";
  changeLanguage(language: LanguageEnum) {
    if (language !== this.currentLanguage.value) {
      this.currentLanguage.next(language);
      if (language === LanguageEnum.Arabic) {
        this.localeCode = "ar";
      } else {
        this.localeCode = "en_GB";
      }
    }
  }
  get lexicon() {
    if (this.currentLanguage.value === LanguageEnum.English) {
      return englishLexicon;
    } else {
      return arabicLexicon;
    }
  }
  constructor() {}
}
