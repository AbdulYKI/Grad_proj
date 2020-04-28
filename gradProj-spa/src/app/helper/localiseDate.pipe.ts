import { SharedService } from "./../services/shared.service";
import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import { LanguageEnum } from "./language.enum";

@Pipe({
  name: "localiseDate",
})
export class LocaliseDatePipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}
  transform(value: Date, pattern: string, locale: string): any {
    const datePipe: DatePipe = new DatePipe(locale);
    return datePipe.transform(value, pattern);
  }
}
