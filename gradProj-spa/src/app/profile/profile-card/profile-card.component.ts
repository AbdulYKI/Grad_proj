import { environment } from "./../../../environments/environment";
import { User } from "./../../models/user";
import { Component, OnInit, Input } from "@angular/core";
import { faUser } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-profile-card",
  templateUrl: "./profile-card.component.html",
  styleUrls: ["./profile-card.component.css"],
})
export class ProfileCardComponent implements OnInit {
  constructor() {}
  @Input() user: User;
  defaultPhotoUrl = environment.defaultPhoto;
  ngOnInit() {}
  get faUser() {
    return faUser;
  }
}
