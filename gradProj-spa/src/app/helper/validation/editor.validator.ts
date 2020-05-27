import { Patterns } from "./patterns";
import { ValidatorFn, AbstractControl } from "@angular/forms";
const inputString = "";
export function editorValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = Patterns.emptyEditorPattern.test(inputString);
    return forbidden ? { empty: { value: control.value } } : null;
  };
}
