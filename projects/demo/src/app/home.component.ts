import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { WizardStep } from '../../../lib/src/form/form-wizard/models'
import { FormWizardComponent, ValidationResult } from '../../../lib/src/form/form-wizard/form-wizard.component'
import { of } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  @ViewChild(FormWizardComponent) formWizardComponent!: FormWizardComponent

  submittedData: {
    firstName: string
    lastName: string
    street: string
  } | null = null

  isSubmitting = false
  showValidationErrors = false

  readonly firstName = 'firstName'
  readonly lastName = 'lastName'
  readonly street = 'street'

  readonly step1 = 'step1'
  readonly step2 = 'step2'

  steps: WizardStep[] = [
    {
      name: this.step1,
      label: 'Step 1',
      visible: true,
      enabled: true,
      navigation: true,
      isDone: false,
      form: new FormGroup({
        [this.firstName]: new FormControl('', [Validators.required]),
        [this.lastName]: new FormControl('', [Validators.required]),
      }),
    },
    {
      name: this.step2,
      label: 'Step 2',
      visible: true,
      enabled: true,
      navigation: true,
      isDone: false,
      form: new FormGroup({
        [this.street]: new FormControl('', Validators.required),
      }),
    },
  ]

  preNavigationValidator = (firstName: string) => {
    return of<ValidationResult>(this.validateName(firstName))
  }

  ngOnInit() {
    this.submittedData = null
  }

  submitForm(data: FormGroup | null) {
    if (data) {
      this.submittedData = data.getRawValue()
    }
  }

  onBeforeNavigateForward() {
  }

  onNavigateForward(e: WizardStep) {
  }

  onNavigateBackward(e: WizardStep) {
  }

  onNavigationFailed(e: string) {
    window.alert('error: ' + e)
  }

  isStep(index: number): boolean {
    return this.formWizardComponent != null ? this.formWizardComponent.isStep(this.steps[index]) : index === 0
  }

  private validateName(name: string): ValidationResult {
    return name?.indexOf('super') > -1 ?
      {
        isValid: true,
      }
      :
      {
        errorLabel: 'firstname should contain "super"',
        isValid: false,
      }

  }
}
