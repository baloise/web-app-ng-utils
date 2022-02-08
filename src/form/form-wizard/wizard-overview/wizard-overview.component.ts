import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { WizardStep } from "../models";

@Component({
  selector: "bal-wizard-overview",
  templateUrl: "./wizard-overview.component.html",
  styleUrls: ["./wizard-overview.component.scss"],
})
export class WizardOverviewComponent implements OnInit {
  @Input() activeStep: WizardStep;
  @Input() steps: WizardStep[] = [];
  @Input() disableStepsAfterActiveStep = false;

  @Output() clickOnStep: EventEmitter<WizardStep> =
    new EventEmitter<WizardStep>();

  thereIsSubscriptionOnStepClick: boolean;

  ngOnInit(): void {
    this.thereIsSubscriptionOnStepClick = this.clickOnStep.observers.length > 0;
  }

  getVisibleSteps(): WizardStep[] {
    return this.steps.filter((step) => step.visible && step.enabled);
  }

  isDone(step: WizardStep): boolean {
    return (
      step.isDone ||
      this.steps.indexOf(step) < this.steps.indexOf(this.activeStep)
    );
  }

  isActive(step: WizardStep): boolean {
    return this.steps.indexOf(step) === this.steps.indexOf(this.activeStep);
  }

  shouldMarkAsDisabled(step: WizardStep): boolean {
    return this.disableStepsAfterActiveStep && this.steps.indexOf(step) > this.steps.indexOf(this.activeStep);
  }
}
