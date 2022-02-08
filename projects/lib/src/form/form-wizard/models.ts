import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface WizardStep {
  name: string;
  label: string;
  visible: boolean;
  enabled: boolean;
  navigation: boolean;
  isDone?: boolean;
  form?: FormGroup;
}

@Injectable()
export class FormWizardState {
  activeStep!: WizardStep;
  steps: WizardStep[] = [];

  init(steps: WizardStep[]): void {
    if (steps != null && steps.length > 0) {
      this.steps = steps;
      this.activeStep = this.steps[0];
    }
  }
}
