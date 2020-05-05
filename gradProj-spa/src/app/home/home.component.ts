import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import Swiper from 'swiper';
import {
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit ,AfterViewInit  {
  ngOnInit(): void {}
  constructor() {

   }
  //Swiper config on documents is Ready
ngAfterViewInit(){
  var swiper = new Swiper('.swiper-container', {
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

get faChevronRight(){
  return faChevronRight;
}

}
