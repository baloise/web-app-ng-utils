import { Directive, HostListener, Input } from "@angular/core";
import { GtmAction, GtmEvent } from "@baloise/web-app-google-utils";
import {
  GoogleTagManagerDataEvent,
  GoogleTagManagerDataService,
} from "./google-tag-manager.service";

@Directive({
  selector: "[balGtmClick]",
})
export class GoogleTagManagerClickDirective {
  @Input() cipGtmClick: GtmEvent;

  constructor(private gtmService: GoogleTagManagerDataService) {}

  @HostListener("click")
  onClick(): void {
    this.gtmService.triggerClick(this.getGtmData());
  }

  getGtmData(): GoogleTagManagerDataEvent {
    return {
      action: GtmAction.Click,
      label: this.cipGtmClick.label,
      category: this.cipGtmClick.category,
      value: this.cipGtmClick.value,
    };
  }
}
