import { SharedService } from "./../services/shared.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"],
})
export class PostComponent implements OnInit {
  status: boolean = false;

  constructor(private sharedService: SharedService) {
    // this.sharedService.currentLanguage.subscribe((lang) => {
    //   if (this.status) {
    //     this.cancelEditor();
    //   }
    // });
  }

  ngOnInit(): void {}
  showEditor() {
    this.status = true;
  }
  hideEditor() {
    this.status = false;
  }
}
