import { Directive, HostListener, Input } from '@angular/core'
import { GtmAction, GtmEvent } from '@baloise/web-app-google-utils'
import { GoogleTagManagerDataService, GoogleTagManagerEvent } from './google-tag-manager.service'

@Directive({
  selector: '[balGtmFocus]',
})
export class GoogleTagManagerFocusDirective {
  @Input()
  balGtmFocus!: GtmEvent

  constructor(private gtmService: GoogleTagManagerDataService) {}

  @HostListener('focus')
  onFocus(): void {
    this.gtmService.triggerFocus(this.getGtmData())
  }

  getGtmData(): GoogleTagManagerEvent {
    return {
      action: GtmAction.Focus,
      label: this.balGtmFocus.label,
      category: this.balGtmFocus.category,
      value: this.balGtmFocus.value,
    }
  }
}
