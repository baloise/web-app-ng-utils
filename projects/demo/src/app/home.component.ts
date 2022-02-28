import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { WizardStep } from '../../../baloise/lib/src/lib/form/form-wizard/models'
import { FormWizardComponent } from '../../../baloise/lib/src/public-api'

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

  ngOnInit() {
    this.submittedData = null
  }

  submitForm(data: FormGroup | null) {
    if (data) {
      this.submittedData = data.getRawValue()
    }
  }

  onBeforeNavigateForward() {}

  onNavigateForward(e: WizardStep) {}

  onNavigateBackward(e: WizardStep) {}

  onNavigationFailed() {}

  isStep(index: number): boolean {
    return this.formWizardComponent != null ? this.formWizardComponent.isStep(this.steps[index]) : index === 0
  }
}
