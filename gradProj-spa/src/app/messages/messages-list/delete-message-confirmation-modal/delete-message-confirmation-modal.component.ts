import { SharedService } from "./../../../services/shared.service";
import { Component, OnInit } from "@angular/core";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-delete-message-confirmation-modal",
  templateUrl: "./delete-message-confirmation-modal.component.html",
  styleUrls: ["./delete-message-confirmation-modal.component.css"],
})
export class DeleteMessageConfirmationModalComponent implements OnInit {
  constructor(
    private sharedService: SharedService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {}
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get isInRtlMode() {
    return this.sharedService.LanguageSubject.value === LanguageEnum.Arabic;
  }
}
