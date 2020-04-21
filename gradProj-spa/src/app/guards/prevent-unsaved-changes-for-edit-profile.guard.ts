import { EditProfileComponent } from "../profile/edit-profile/edit-profile.component";
import { SharedService } from "../services/shared.service";
import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

@Injectable()
export class PreventUnsavedChangesGuardForEditProfile
  implements CanDeactivate<any> {
  constructor(private sharedService: SharedService) {}
  canDeactivate(component: EditProfileComponent): boolean {
    if (component.editForm?.dirty) {
      return confirm(
        this.sharedService.Lexicon.preventUnsavedChangesGuardMessage
      );
    }
    return true;
  }
}
