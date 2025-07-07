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
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { NavigationEnd, Router, RouterEvent } from '@angular/router'
import { first, Observable, Subscription } from 'rxjs'
import { parse } from 'query-string'
import { isNumber } from 'lodash'
import { BalFormWrapper } from '../form-wrapper'
import { WizardStep } from './models'
import { WizardStepComponent } from './wizard-step/wizard-step.component'

const URL_PARAM_STEP = 'step'

export interface ValidationResult {
  errorLabel?: string;
  isValid: boolean;
}


@Component({
    selector: 'bal-form-wizard',
    templateUrl: 'form-wizard.component.html',
    standalone: false
})
export class FormWizardComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  @Input() steps: WizardStep[] = []
  @Input() isSubmitting: boolean = false
  @Input() form!: FormGroup
  @Input() startingStep!: WizardStep
  @Input() labels!: {
    button: {
      previous: string
      next: string
      save: string
    }
  }
  @Input() disableStepsAfterActiveStep = false
  @Input() enableDirectNavigationBackward = false
  @Input() beforeNavigateForwardValidation: Observable<ValidationResult> | undefined

  @Output() beforeNavigateForward = new EventEmitter<WizardStep>()
  @Output() navigateForward = new EventEmitter<WizardStep>()
  @Output() navigateBackward = new EventEmitter<WizardStep>()
  @Output() navigationFailed = new EventEmitter<any>()
  @Output() submitForm = new EventEmitter<FormGroup | null>()
  @Output() clickOnStep: EventEmitter<WizardStep> = new EventEmitter<WizardStep>()

  @ContentChildren(WizardStepComponent)
  stepComponents!: QueryList<WizardStepComponent>
  activeStep!: WizardStep
  subscriptions: Subscription[] = []

  constructor(private router: Router) {
    this.registerRoutingListener()
  }

  ngOnInit(): void {
    this.initForm()
    this.verifyInputs()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['steps'] != null) {
      this.initForm()
      this.activeStep = this.startingStep != null ? this.startingStep : this.steps[0]
    }
  }

  private initForm() {
    if (this.steps.some(step => step.form != null)) {
      const formMap: { [stepName: string]: FormGroup } = {}
      this.steps.forEach(step => {
        if (formMap !== undefined && formMap[step.name] !== undefined) {
          ;(formMap as any)[step.name] = step.form
        }
      })
      this.form = new FormGroup(formMap)
    }
  }

  ngAfterContentInit(): void {
    this.showActiveStepComponent()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  shouldShowValidationErrors(): boolean {
    return false
  }

  shouldShowStepOverview(): boolean {
    return this.activeStep.visible
  }

  shouldShowNavigationButtons(): boolean {
    return this.activeStep.navigation
  }

  shouldShowBackButton(): boolean {
    return this.getPreviousStep() != null
  }

  shouldDisableNextButton(): boolean {
    return (this.activeStepIsLastStep() && !this.form.valid) || this.isSubmitting
  }

  goForwardForce(): void {
    this.beforeNavigateForward.emit(this.activeStep)
    this.goForwardWithoutValidation()
    this.navigateForward.emit(this.activeStep)
  }

  goForward(): void {
    const formWrapper = new BalFormWrapper(this.form)
    let activeForm = this.activeStep.form

    if (activeForm) {
      formWrapper.validateAllFields(activeForm)
    } else {
      formWrapper.validateAllFields()
      activeForm = this.form
    }

    if (activeForm.pending) {
      // wait for async validators
      activeForm.statusChanges
        .pipe(first())
        .subscribe(() => this.beforeValidateCheckValidationResultAndPerformAction(activeForm, formWrapper))
    } else {
      this.beforeValidateCheckValidationResultAndPerformAction(activeForm, formWrapper)
    }
  }

  private beforeValidateCheckValidationResultAndPerformAction(activeForm: FormGroup | undefined, formWrapper: BalFormWrapper) {
    if (this.beforeNavigateForwardValidation) {
      this.subscriptions.push(this.beforeNavigateForwardValidation.subscribe(
        (validationResult) => validationResult.isValid ?
          this.checkValidationResultAndPerformAction(activeForm, formWrapper) :
          this.navigationFailed.emit(validationResult.errorLabel),
        (e) => this.navigationFailed.emit(e),
      ))
    } else {
      this.checkValidationResultAndPerformAction(activeForm, formWrapper)
    }
  }

  private checkValidationResultAndPerformAction(activeForm: FormGroup<any> | undefined, formWrapper: BalFormWrapper) {
    if (activeForm && activeForm.valid) {
      this.beforeNavigateForward.emit(this.activeStep)
      this.goForwardWithoutValidation()
      formWrapper.unvalidateAllFields()
      this.navigateForward.emit(this.activeStep)

      if (this.activeStepIsLastStep()) {
        formWrapper.validateAllFields()
      }
    } else {
      this.navigationFailed.emit()
    }
  }

  goBackward(): void {
    const previousStep = this.getPreviousStep()
    if (previousStep != null) {
      this.activeStep = previousStep
      this.showActiveStepComponent()
      this.navigateBackward.emit(this.activeStep)
    }
  }

  onClickNext(): void {
    this.goForward()
  }

  onClickPrevious(): void {
    this.goBackward()
  }

  isFirstStep(): boolean {
    const enabledSteps = this.getEnabledSteps()
    return this.activeStep === enabledSteps[0]
  }

  isLastStep(): boolean {
    const enabledSteps = this.getEnabledSteps()
    return this.activeStep === enabledSteps[enabledSteps.length - 1]
  }

  isStep(step: WizardStep): boolean {
    return this.activeStep === step
  }

  private showActiveStepComponent(): void {
    this.stepComponents.forEach(stepComponent => {
      stepComponent.visible = stepComponent.name === this.activeStep.name
    })
  }

  private getPreviousStep(): WizardStep | undefined {
    const enabledSteps = this.getEnabledSteps()
    for (let i = 1; i < enabledSteps.length; i++) {
      if (this.activeStep.name === enabledSteps[i].name) {
        return enabledSteps[i - 1]
      }
    }
    return undefined
  }

  private getNextStep(): WizardStep | undefined {
    const enabledSteps = this.getEnabledSteps()
    for (let i = 0; i < enabledSteps.length - 1; i++) {
      if (this.activeStep.name === enabledSteps[i].name) {
        return enabledSteps[i + 1]
      }
    }
    return undefined
  }

  private getEnabledSteps(): WizardStep[] {
    return this.steps.filter(step => step.enabled)
  }

  private goForwardWithoutValidation() {
    const nextStep = this.getNextStep()
    if (nextStep) {
      this.activeStep = nextStep
      this.showActiveStepComponent()
    } else {
      this.submitForm.emit(this.form)
    }
  }

  private verifyInputs() {
    if (this.form == null) {
      throw new Error('missing input: form')
    }
  }

  private activeStepIsLastStep(): boolean {
    return this.getActiveStepIndex() === this.steps.length - 1
  }

  private registerRoutingListener(): void {
    this.subscriptions.push(this.router.events.subscribe(event => this.handleRoutingEvent(event as RouterEvent)))
  }

  private handleRoutingEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationEnd) {
      const stepIndexFromUrl = this.getStepIndexFromUrl()
      const activeStepIndex = this.getActiveStepIndex()
      if (this.isForwardStep(activeStepIndex, stepIndexFromUrl)) {
        this.goForward()
      } else if (this.isBackwardStep(activeStepIndex, stepIndexFromUrl)) {
        this.goBackward()
      }
    }
  }

  private isForwardStep(activeStepIndex: number, testingStepIndex: number): boolean {
    return testingStepIndex === activeStepIndex + 1
  }

  private isBackwardStep(activeStepIndex: number, testingStepIndex: number): boolean {
    return testingStepIndex === activeStepIndex - 1
  }

  private getStepIndexFromUrl(): number {
    const parsed = parse(location.search)
    const stepIndexFromUrl = parsed[URL_PARAM_STEP] as string
    if (stepIndexFromUrl != null) {
      const parsedStepIndex = parseInt(stepIndexFromUrl, 10)
      if (isNumber(parsedStepIndex)) {
        return parsedStepIndex
      }
    }
    return this.getInitialStepIndex()
  }

  private getInitialStepIndex(): number {
    if (this.startingStep != null) {
      const index = this.steps.indexOf(this.startingStep)
      if (index >= 0) {
        return index
      }
    }
    return 0
  }

  private getActiveStepIndex(): number {
    const index = this.steps.indexOf(this.activeStep)
    return index >= 0 ? index : 0
  }

  onClickOnStep(clickedStep: WizardStep): void {
    if (this.steps.indexOf(clickedStep) > this.steps.indexOf(this.activeStep)) {
      return
    }
    // enable direct backward navigation
    this.activeStep = clickedStep
    this.showActiveStepComponent()
    this.clickOnStep.emit(clickedStep)
  }
}
