import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { WizardStep } from '../models'

@Component({
    selector: 'bal-wizard-overview',
    templateUrl: './wizard-overview.component.html',
    standalone: false
})
export class WizardOverviewComponent implements OnInit {
  @Input() activeStep!: WizardStep
  _steps: WizardStep[] = []
  @Input() disableStepsAfterActiveStep = false

  @Output() clickOnStep: EventEmitter<WizardStep> = new EventEmitter<WizardStep>()

  thereIsSubscriptionOnStepClick: boolean = false

  @Input()
  set steps(steps: WizardStep[]) {
    // TODO: remove when https://github.com/baloise/design-system/issues/1246 is resolved
    // step.filter() was added as a workaround to fix an issue introduced with Design System 15.0.2
    this._steps = steps.filter(s => s.visible && s.enabled)
  }

  ngOnInit(): void {
    this.thereIsSubscriptionOnStepClick = this.clickOnStep.observers.length > 0
  }

  isDone(step: WizardStep): boolean {
    return step.isDone || this._steps.indexOf(step) < this._steps.indexOf(this.activeStep)
  }

  isActive(step: WizardStep): boolean {
    return this._steps.indexOf(step) === this._steps.indexOf(this.activeStep)
  }

  shouldMarkAsDisabled(step: WizardStep): boolean {
    return this.disableStepsAfterActiveStep && this._steps.indexOf(step) > this._steps.indexOf(this.activeStep)
  }
}
