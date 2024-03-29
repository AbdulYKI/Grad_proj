import { SharedService } from "./../services/shared.service";
import { Injectable } from "@angular/core";
import { NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { LanguageEnum } from "./enums/language.enum";
@Injectable()
export class CustomDatePicker extends NgbDatepickerI18n {
  constructor(private sharedService: SharedService) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return this.sharedService.lexicon.weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return this.sharedService.lexicon.months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
