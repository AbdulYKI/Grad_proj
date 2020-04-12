import { SharedService } from "./../services/shared.service";
import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

@Injectable()
export class PreventUnsavedChangesGuard implements CanDeactivate<any> {
  constructor(private sharedService: SharedService) {}
  canDeactivate(component: any): boolean {
    if (component.editForm?.dirty) {
      return confirm(
        this.sharedService.Lexicon.preventUnsavedChangesGuardMessage
      );
    }
    return true;
  }
}
