import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AppRoutingModule } from './app-routing.module'

import {
  BalCoreModule,
  BalCardModule,
  BalButtonModule,
  BalHeadingModule,
  BalFieldModule,
  BalInputModule,
} from '@baloise/design-system-components-angular'
import { BalNgFormWizardModule } from '../../../lib/src/public-api'

import { AppComponent } from './app.component'
import { HomeComponent } from './home.component'

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BalNgFormWizardModule,
    BalCoreModule.forRoot(),
    BalCardModule,
    BalButtonModule,
    BalHeadingModule,
    BalFieldModule,
    BalInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
