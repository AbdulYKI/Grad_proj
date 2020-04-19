import { SharedService } from "./../services/shared.service";
import { Component, OnInit } from "@angular/core";
import {
  faPlus,
  faPaperPlane,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "../helper/language.enum";

import { Component, OnInit } from '@angular/core';
import {faEye,faCaretUp,faCaretDown } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"],
})
export class PostComponent implements OnInit {
  showEditorFlag = false;
  status: boolean = false;
  //Test object
post_list = [{id:1,
              username:'Ali',
              imgUrl:'https://avatars2.githubusercontent.com/u/11575183?s=460&v=4',
              title:'Fix Connection Asp.Net',
              view:9000,
              rank:1000,
              yyyy:'10-July , 2020',
              hours:'10 Pm',
              category1:".Net",
              category2:"Microsoft",
              status:'careup',
            }
              ,
              {id:1,
                username:'Sara alex',
                imgUrl:'https://avatars1.githubusercontent.com/u/3844427?s=460&v=4',
                title:'Bootstrap 4 Padding left',
                view:2000,
                rank:200,
                yyyy:'09-Feb , 2018',
                hours:'03 Am',
                category1:"Angualr",
                category2:"Bootstrap 4",
                status:'caerdown',
              }

            ]

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
  get faEye(){
    return faEye;
  }
  get faCaretUp(){
    return faCaretUp;
  }
  get faCaretDown(){
    return faCaretDown;
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
