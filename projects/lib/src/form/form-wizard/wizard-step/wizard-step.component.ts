import { Component, Input } from '@angular/core'

@Component({
    selector: 'bal-wizard-step',
    templateUrl: './wizard-step.component.html',
    standalone: false
})
export class WizardStepComponent {
  @Input() name: string = ''

  visible = false
}
