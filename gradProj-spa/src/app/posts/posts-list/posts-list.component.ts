import { SharedService } from "../../services/shared.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  faPlus,
  faPaperPlane,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "../../helper/language.enum";
import { Post } from "../../models/post";
import { AddPostComponent } from "../add-post/add-post.component";
@Component({
  selector: "app-posts-list",
  templateUrl: "./posts-list.component.html",
  styleUrls: ["./posts-list.component.css"],
})
export class PostsListComponent implements OnInit {
  showEditorFlag = false;
  status = false;
  @ViewChild("addPostComponent") addPostComponent: AddPostComponent;
  constructor(private sharedService: SharedService) {}
  get FaPlus() {
    return faPlus;
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
