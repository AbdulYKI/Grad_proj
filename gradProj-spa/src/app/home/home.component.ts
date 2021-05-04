import { SharedService } from "./../services/shared.service";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import Swiper from "swiper";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "../helper/enums/language.enum";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {}
  constructor(private sharedService: SharedService) {}
  //Swiper config on documents is Ready
  ngAfterViewInit() {
    const swiper = new Swiper(".swiper-container", {
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
  get isInRtlMode() {
    return this.sharedService.LanguageSubject.value === LanguageEnum.Arabic;
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
  get faChevronRight() {
    return faChevronRight;
  }
}
