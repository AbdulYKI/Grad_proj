import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isCollapsed=true;
  activeButton ="btn1";
  constructor() { }
  ngOnInit(): void {
  }
  onSubmit(){
    console.log('ok');
  }
  ToggleSideBar() {
    this.isCollapsed = !this.isCollapsed;
  }

  setActive = function (buttonName){
    this.activeButton = buttonName;
  }
  isActive = function (buttonName){
    return this.activeButton === buttonName;
  }

}
