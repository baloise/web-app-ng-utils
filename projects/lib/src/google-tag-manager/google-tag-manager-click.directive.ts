import { Directive, HostListener, Input } from '@angular/core'
import { GtmAction, GtmEvent } from '@baloise/web-app-google-utils'
import { GoogleTagManagerEvent, GoogleTagManagerDataService } from './google-tag-manager.service'

@Directive({
  selector: '[balGtmClick]',
})
export class GoogleTagManagerClickDirective {
  @Input() balGtmClick!: GtmEvent

  constructor(private gtmService: GoogleTagManagerDataService) {}

  @HostListener('click')
  onClick(): void {
    this.gtmService.triggerClick(this.getGtmData())
  }

  getGtmData(): GoogleTagManagerEvent {
    return {
      action: GtmAction.Click,
      label: this.balGtmClick.label,
      category: this.balGtmClick.category,
      value: this.balGtmClick.value,
    }
  }
}
