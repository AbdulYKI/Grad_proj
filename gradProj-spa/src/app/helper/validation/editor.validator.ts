import { Patterns } from "./patterns";
import { ValidatorFn, AbstractControl } from "@angular/forms";

export function editorValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = Patterns.emptyEditorPattern.test(control.value);
    return forbidden ? { empty: { value: control.value } } : null;
  };
}
