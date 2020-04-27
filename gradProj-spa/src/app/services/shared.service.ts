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
  changeLanguage(language: LanguageEnum) {
    this.currentLanguage.next(language);
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
