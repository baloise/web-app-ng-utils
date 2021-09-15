import { FormGroup } from "@angular/forms";
import { FormConfig } from "./form-config";
import { WizardStep } from "./form-wizard/models";

export abstract class FormControlVisibilityHandler {
  constructor(protected form: FormGroup, protected steps: WizardStep[]) {}

  handleNavigationChange(formConfig: FormConfig, activeStep: WizardStep): void {
    const activeStepIndex = this.getStepIndex(activeStep);
    Object.keys(formConfig).forEach((key) => {
      if (formConfig[key].visible != null) {
        formConfig[key].visible = formConfig[key].step <= activeStepIndex;
      }
    });
    this.handleFormChange(formConfig, activeStep);
  }

  abstract handleFormChange(
    formConfig: FormConfig,
    activeStep: WizardStep
  ): void;

  protected getStepIndex(step: WizardStep): number {
    for (let i = 0; i < this.steps.length; i++) {
      if (this.steps[i].name === step.name) {
        return i;
      }
    }
    return -1;
  }
}
