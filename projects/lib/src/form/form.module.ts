import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormWizardComponent } from './form-wizard/form-wizard.component'
import { WizardOverviewComponent } from './form-wizard/wizard-overview/wizard-overview.component'
import { WizardStepComponent } from './form-wizard/wizard-step/wizard-step.component'
import { BrowserModule } from '@angular/platform-browser'
import { BalTabsModule, BalButtonModule, BalNotificationModule } from '@baloise/design-system-next-components-angular'

const components = [FormWizardComponent, WizardOverviewComponent, WizardStepComponent]
@NgModule({
  imports: [CommonModule, BrowserModule, BalTabsModule, BalButtonModule, BalNotificationModule],
  declarations: [...components],
  exports: [...components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BalNgFormWizardModule {}
