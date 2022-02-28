import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms'
import isString from 'lodash.isstring'
import isNumber from 'lodash.isnumber'
import isBoolean from 'lodash.isboolean'
import isEqual from 'lodash.isequal'

export interface OriginalFormValueObject {
  [name: string]: unknown
}

export const BalFormUtil = {
  isDirty<T>(form: AbstractControl | null, originalFormValue: T): boolean {
    if (form === null || form.pristine) {
      return false
    }

    if (form instanceof FormControl) {
      if (form.value === originalFormValue) {
        return false
      } else if (form.value === null || isNumber(form.value) || isBoolean(form.value)) {
        return form.value !== originalFormValue
      } else if (isString(form.value)) {
        return form.value.trim() !== (originalFormValue as unknown as string).trim()
      } else {
        return !isEqual(form.value, originalFormValue)
      }
    }

    if (form instanceof FormGroup || form instanceof FormArray) {
      return Object.keys(form.controls).some((controlName: string): boolean => {
        return BalFormUtil.isDirty(
          form.get(controlName),
          (originalFormValue as unknown as OriginalFormValueObject)[controlName],
        )
      })
    } else {
      throw new Error(`unexpected class for form: ${form.constructor.name}`)
    }
  },

  isPristine<T>(form: AbstractControl, originalFormValue: T): boolean {
    return !BalFormUtil.isDirty(form, originalFormValue)
  },
}
