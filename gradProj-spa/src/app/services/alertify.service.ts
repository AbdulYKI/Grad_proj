import { SharedService } from "./shared.service";
import { Injectable } from "@angular/core";
import { LanguageEnum } from "../helper/enums/language.enum";

declare let alertify: any;
@Injectable({
  providedIn: "root",
})
export class AlertifyService {
  constructor(private sharedService: SharedService) {}

  success(message: string) {
    alertify.set("notifier", "position", this.notifierPosition);
    alertify.success(message);
    console.log(alertify);
  }
  error(message: string) {
    alertify.set("notifier", "position", this.notifierPosition);
    alertify.error(message);
  }
  warning(message: string) {
    alertify.set("notifier", "position", this.notifierPosition);
    alertify.warning(message);
  }
  message(message: string) {
    alertify.set("notifier", "position", this.notifierPosition);
    alertify.message(message);
  }
  get notifierPosition() {
    if (this.sharedService.LanguageSubject.value === LanguageEnum.Arabic) {
      return "bottom-left";
    } else {
      return "bottom-right";
    }
  }
}
