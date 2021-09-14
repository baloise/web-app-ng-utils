import { Directive, HostListener, Input } from "@angular/core";
import { GtmAction, GtmEvent } from "@baloise/web-app-google-utils";
import {
  GoogleTagManagerDataEvent,
  GoogleTagManagerDataService,
} from "./google-tag-manager.service";

@Directive({
  selector: "[cipGtmFocus]",
})
export class GoogleTagManagerFocusDirective {
  @Input()
  cipGtmFocus: GtmEvent;

  constructor(private gtmService: GoogleTagManagerDataService) {}

  @HostListener("focus")
  onFocus(): void {
    this.gtmService.triggerFocus(this.getGtmData());
  }

  getGtmData(): GoogleTagManagerDataEvent {
    return {
      action: GtmAction.Focus,
      label: this.cipGtmFocus.label,
      category: this.cipGtmFocus.category,
      value: this.cipGtmFocus.value,
    };
  }
}
