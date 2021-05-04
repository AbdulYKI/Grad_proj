import { LanguageEnum } from "../helper/enums/language.enum";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { englishLexicon } from "../helper/lexicon/english.lexicon";
import { arabicLexicon } from "../helper/lexicon/arabic.lexicon";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  LanguageSubject = new BehaviorSubject<LanguageEnum>(LanguageEnum.Arabic);
  localeCode = "ar";
  changeLanguage(language: LanguageEnum) {
    if (language !== this.LanguageSubject.value) {
      this.LanguageSubject.next(language);
      if (language === LanguageEnum.Arabic) {
        this.localeCode = "ar";
      } else {
        this.localeCode = "en_GB";
      }
    }
  }
  get lexicon() {
    if (this.LanguageSubject.value === LanguageEnum.English) {
      return englishLexicon;
    } else {
      return arabicLexicon;
    }
  }
  constructor() {}
}
