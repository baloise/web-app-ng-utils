import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GoogleTagManagerClickDirective } from "./google-tag-manager-click.directive";
import { GoogleTagManagerFocusDirective } from "./google-tag-manager-focus.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [
    GoogleTagManagerClickDirective,
    GoogleTagManagerFocusDirective,
  ],
  exports: [GoogleTagManagerClickDirective, GoogleTagManagerFocusDirective],
})
export class BaloiseAngularGoogleTagManagerModule {}
