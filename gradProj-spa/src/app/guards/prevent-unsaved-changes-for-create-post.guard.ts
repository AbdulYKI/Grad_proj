import { PostsListComponent } from "../posts/posts-list/posts-list.component";
import { SharedService } from "../services/shared.service";
import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

@Injectable()
export class PreventUnsavedChangesGuardForCreatePost
  implements CanDeactivate<any> {
  constructor(private sharedService: SharedService) {}
  canDeactivate(component: PostsListComponent): boolean {
    if (component.addPostComponent?.postForm?.dirty) {
      return confirm(
        this.sharedService.Lexicon.preventUnsavedChangesGuardMessage
      );
    }
    return true;
  }
}
