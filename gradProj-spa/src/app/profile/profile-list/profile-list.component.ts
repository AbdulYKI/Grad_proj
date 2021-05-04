import { ProfileListPaginationParams } from "./../../helper/pagination/profile-pagination-params";
import { UserService } from "src/app/services/user.service";
import { User } from "./../../models/user";
import { SharedService } from "./../../services/shared.service";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { LanguageEnum } from "src/app/helper/enums/language.enum";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Pagination } from "src/app/helper/pagination/pagination";
import { PaginationResult } from "src/app/helper/pagination/pagination-result";
import { paginationDefaults } from "src/app/helper/pagination/pagination-defaults.constants";

@Component({
  selector: "app-profile-list",
  templateUrl: "./profile-list.component.html",
  styleUrls: ["./profile-list.component.css"],
})
export class ProfileListComponent implements OnInit, OnDestroy {
  destroy: Subject<boolean> = new Subject<boolean>();
  profileListPaginationParams = new ProfileListPaginationParams();
  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}
  users: User[];
  pagination: Pagination;
  ngOnInit() {
    this.route.data
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (data: { profileListPaginationResult: PaginationResult<User[]> }) => {
          this.users = data.profileListPaginationResult.result;
          this.pagination = data.profileListPaginationResult.pagination;
        }
      );
  }
  get faSearch() {
    return faSearch;
  }
  isInRtlMode() {
    return this.sharedService.LanguageSubject.value === LanguageEnum.Arabic;
  }
  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
  searchForUsername(usernameToSearchFor) {
    this.profileListPaginationParams.username = usernameToSearchFor;
    this.loadUsers(1);
  }
  loadUsers(pageNumber: number) {
    this.userService
      .getUsersForList(
        paginationDefaults.postsPaginationPageSize,
        pageNumber,
        this.profileListPaginationParams
      )
      .subscribe((paginationResult) => {
        this.users = paginationResult.result;
        this.pagination = paginationResult.pagination;
      });
  }
  get lexicon() {
    return this.sharedService.lexicon;
  }
}
