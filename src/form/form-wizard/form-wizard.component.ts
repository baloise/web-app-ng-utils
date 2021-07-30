import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { Subscription } from "rxjs";
import * as queryString from "query-string";
import { isNumber } from "lodash";
import { BalFormWrapper } from "../form-wrapper";
import { WizardStep } from "./models";
import { WizardStepComponent } from "./wizard-step/wizard-step.component";

const URL_PARAM_STEP = "step";

@Component({
  selector: "bal-form-wizard",
  templateUrl: "form-wizard.component.html",
  styleUrls: ["form-wizard.component.scss"],
})
export class FormWizardComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy
{
  @Input() steps: WizardStep[] = [];
  @Input() form: FormGroup;
  @Input() isSubmitting: boolean;
  @Input() startingStep: WizardStep;
  @Input() labels: {
    button: {
      previous: string;
      next: string;
      save: string;
    };
  };

  @Output() beforeNavigateForward = new EventEmitter<WizardStep>();
  @Output() navigateForward = new EventEmitter<WizardStep>();
  @Output() navigateBackward = new EventEmitter<WizardStep>();
  @Output() navigationFailed = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<FormGroup | void>();

  @ContentChildren(WizardStepComponent)
  stepComponents: QueryList<WizardStepComponent>;
  activeStep: WizardStep;
  subscriptions: Subscription[] = [];

  constructor(private router: Router) {
    this.registerRoutingListener();
  }

  ngOnInit(): void {
    this.initForm();
    this.verifyInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["steps"] != null) {
      this.initForm();
      this.activeStep =
        this.startingStep != null ? this.startingStep : this.steps[0];
    }
  }

  private initForm() {
    if (this.steps.some((step) => step.form != null)) {
      const formMap: { [stepName: string]: FormGroup } = {};
      this.steps.forEach((step) => {
        formMap[step.name] = step.form;
      });
      this.form = new FormGroup(formMap);
    }
  }

  ngAfterContentInit(): void {
    this.showActiveStepComponent();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  shouldShowValidationErrors(): boolean {
    return false;
  }

  shouldShowStepOverview(): boolean {
    return this.activeStep.visible;
  }

  shouldShowNavigationButtons(): boolean {
    return this.activeStep.navigation;
  }

  shouldShowBackButton(): boolean {
    return this.getPreviousStep() != null;
  }

  shouldDisableNextButton(): boolean {
    return (
      (this.activeStepIsLastStep() && !this.form.valid) || this.isSubmitting
    );
  }

  goForward(): void {
    this.beforeNavigateForward.emit(this.activeStep);
    const formWrapper = new BalFormWrapper(this.form);
    let activeForm = this.activeStep.form;

    if (activeForm) {
      formWrapper.validateAllFields(activeForm);
    } else {
      formWrapper.validateAllFields();
      activeForm = this.form;
    }

    if (activeForm.valid) {
      this.goForwardWithoutValidation();
      formWrapper.unvalidateAllFields();
      this.navigateForward.emit(this.activeStep);
      if (this.activeStepIsLastStep()) {
        formWrapper.validateAllFields();
      }
    } else {
      this.navigationFailed.emit();
    }
  }

  goBackward(): void {
    const previousStep = this.getPreviousStep();
    if (previousStep != null) {
      this.activeStep = previousStep;
      this.showActiveStepComponent();
      this.navigateBackward.emit(this.activeStep);
    }
  }

  onClickNext(): void {
    this.goForward();
  }

  onClickPrevious(): void {
    this.goBackward();
  }

  isFirstStep(): boolean {
    const enabledSteps = this.getEnabledSteps();
    return this.activeStep === enabledSteps[0];
  }

  isLastStep(): boolean {
    const enabledSteps = this.getEnabledSteps();
    return this.activeStep === enabledSteps[enabledSteps.length - 1];
  }

  isStep(step: WizardStep): boolean {
    return this.activeStep === step;
  }

  private showActiveStepComponent(): void {
    this.stepComponents.forEach((stepComponent) => {
      stepComponent.visible = stepComponent.name === this.activeStep.name;
    });
  }

  private getPreviousStep(): WizardStep {
    const enabledSteps = this.getEnabledSteps();
    for (let i = 1; i < enabledSteps.length; i++) {
      if (this.activeStep.name === enabledSteps[i].name) {
        return enabledSteps[i - 1];
      }
    }
    return undefined;
  }

  private getNextStep(): WizardStep {
    const enabledSteps = this.getEnabledSteps();
    for (let i = 0; i < enabledSteps.length - 1; i++) {
      if (this.activeStep.name === enabledSteps[i].name) {
        return enabledSteps[i + 1];
      }
    }
    return undefined;
  }

  private getEnabledSteps(): WizardStep[] {
    return this.steps.filter((step) => step.enabled);
  }

  private goForwardWithoutValidation() {
    const nextStep = this.getNextStep();
    if (nextStep != null) {
      this.activeStep = this.getNextStep();
      this.showActiveStepComponent();
    } else {
      this.submitForm.emit(this.form);
    }
  }
  private verifyInputs() {
    if (this.form == null) {
      throw new Error("missing input: form");
    }
  }

  private activeStepIsLastStep(): boolean {
    return this.getActiveStepIndex() === this.steps.length - 1;
  }

  private registerRoutingListener(): void {
    this.subscriptions.push(
      this.router.events.subscribe(this.handleRoutingEvent.bind(this))
    );
  }

  private handleRoutingEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationEnd) {
      const stepIndexFromUrl = this.getStepIndexFromUrl();
      const activeStepIndex = this.getActiveStepIndex();
      if (this.isForwardStep(activeStepIndex, stepIndexFromUrl)) {
        this.goForward();
      } else if (this.isBackwardStep(activeStepIndex, stepIndexFromUrl)) {
        this.goBackward();
      }
    }
  }

  private isForwardStep(
    activeStepIndex: number,
    testingStepIndex: number
  ): boolean {
    return testingStepIndex === activeStepIndex + 1;
  }

  private isBackwardStep(
    activeStepIndex: number,
    testingStepIndex: number
  ): boolean {
    return testingStepIndex === activeStepIndex - 1;
  }

  private getStepIndexFromUrl(): number {
    const parsed = queryString.parse(location.search);
    const stepIndexFromUrl = parsed[URL_PARAM_STEP] as string;
    if (stepIndexFromUrl != null) {
      const parsedStepIndex = parseInt(stepIndexFromUrl, 10);
      if (isNumber(parsedStepIndex)) {
        return parsedStepIndex;
      }
    }
    return this.getInitialStepIndex();
  }

  private getInitialStepIndex(): number {
    if (this.startingStep != null) {
      const index = this.steps.indexOf(this.startingStep);
      if (index >= 0) {
        return index;
      }
    }
    return 0;
  }

  private getActiveStepIndex(): number {
    const index = this.steps.indexOf(this.activeStep);
    return index >= 0 ? index : 0;
  }
}
