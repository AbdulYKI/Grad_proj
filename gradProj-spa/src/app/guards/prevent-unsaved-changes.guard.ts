import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

@Injectable()
export class PreventUnsavedChangesGuard implements CanDeactivate<any> {
  canDeactivate(component: any): boolean {
    if (component.editForm?.dirty && component.editForm?.touched) {
      return confirm(
        "Any unsaved changes won't be commited,are you sure you want to continue?"
      );
    }
    return true;
  }
}
