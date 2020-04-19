import { SharedService } from "./../services/shared.service";
import { Component, OnInit } from "@angular/core";
import {
  faPlus,
  faPaperPlane,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "../helper/language.enum";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"],
})
export class PostComponent implements OnInit {
  showEditorFlag = false;

  constructor(private sharedService: SharedService) {}
  get FaPlus() {
    return faPlus;
  }
  get FaPaperPlane() {
    return faPaperPlane;
  }
  get FaTimes() {
    return faTimes;
  }
  ngOnInit(): void {}
  showEditor() {
    this.showEditorFlag = true;
  }
  hideEditor() {
    this.showEditorFlag = false;
  }

  get Lexicon() {
    return this.sharedService.Lexicon;
  }
  get ContainerClasses() {
    if (this.sharedService.currentLanguage.value === LanguageEnum.Arabic) {
      return "container rtl";
    }
    return "container";
  }
}
