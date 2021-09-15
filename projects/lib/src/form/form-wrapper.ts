import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

export class BalFormWrapper {
  constructor(private form: FormGroup) {}

  getForm(): FormGroup {
    return this.form;
  }

  getValue<T>(formControlName: string): T {
    return this.form.controls[formControlName].value as unknown as T;
  }

  getFormArrayControls(formArrayName: string): AbstractControl[] {
    return (<FormArray>this.form.controls[formArrayName]).controls;
  }

  setValue<T>(formControlName: string, value: T): BalFormWrapper {
    this.form.controls[formControlName].setValue(value);
    return this;
  }

  clearArray(formControlName: string): void {
    const control = <FormArray>this.form.controls[formControlName];
    for (let i = 0; i < control.length; i++) {
      control.removeAt(i);
    }
  }

  reset(): void {
    this.form.reset();
  }

  validateAllFields(form: FormGroup | FormArray = this.form): void {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: false });
        control.markAsDirty({ onlySelf: false });
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFields(control);
      }
    });
  }

  unvalidateAllFields(form: FormGroup | FormArray = this.form): void {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      if (control instanceof FormControl) {
        control.markAsUntouched({ onlySelf: false });
        control.markAsPristine({ onlySelf: false });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.unvalidateAllFields(control);
      }
    });
  }

  updateValueAndValidity(control: AbstractControl = this.form): void {
    if (control instanceof FormControl) {
      control.updateValueAndValidity();
    } else if (control instanceof FormGroup || control instanceof FormArray) {
      Object.keys(control.controls).forEach((field) => {
        const myControlField = control.get(field);
        if (myControlField) {
          this.updateValueAndValidity(myControlField);
        }
      });
    }
  }
}
