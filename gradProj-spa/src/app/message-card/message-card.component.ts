import { Component, OnInit } from '@angular/core';
import {
  faEllipsisV ,
  faVideo,
  faPhone ,
  faPaperclip ,
   faLocationArrow ,
  faUserCircle ,
   faBan
   } from "@fortawesome/free-solid-svg-icons";
import { SharedService } from '../services/shared.service';
import { LanguageEnum } from "../helper/enums/language.enum";
@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent implements OnInit {

  isActionCollapsed = false;
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
  }

  get isInRtlMode() {
    return this.sharedService.currentLanguage.value === LanguageEnum.Arabic;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  toggleActionCollapsed() {
    this.isActionCollapsed = !this.isActionCollapsed;
  }
  get faEllipsisV() {
    return faEllipsisV;
  }
  get faVideo() {
    return faVideo;
  }
  get faPhone() {
    return faPhone;
  }
  get faPaperclip() {
    return faPaperclip;
  }
  get faLocationArrow() {
    return faLocationArrow;
  }
  get faUserCircle() {
    return faUserCircle;
  }
  get faBan() {
    return faBan;
  }
}
