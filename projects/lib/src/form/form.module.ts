import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BaloiseAngularAssetConfigModule } from '../asset/asset-config.module';
import { FormControlClusterComponent } from './form-control-cluster/form-control-cluster.component';
import { FormWizardComponent } from './form-wizard/form-wizard.component';
import { WizardOverviewComponent } from './form-wizard/wizard-overview/wizard-overview.component';
import { WizardStepComponent } from './form-wizard/wizard-step/wizard-step.component';
import { BaloiseDesignSystemModule } from '@baloise/design-system-components-angular';
import { BrowserModule } from '@angular/platform-browser';

const components = [
  FormWizardComponent,
  WizardOverviewComponent,
  WizardStepComponent,
  FormControlClusterComponent,
];
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BaloiseAngularAssetConfigModule,
    BaloiseDesignSystemModule.forRoot(),
  ],
  declarations: [...components],
  exports: [...components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BaloiseAngularFormModule {}
