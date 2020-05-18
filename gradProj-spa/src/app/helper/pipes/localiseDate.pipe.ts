import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";

@Pipe({
  name: "localiseDate",
})
export class LocaliseDatePipe implements PipeTransform {
  transform(value: Date, pattern: string, locale: string): any {
    const datePipe: DatePipe = new DatePipe(locale);
    return datePipe.transform(value, pattern);
  }
}
