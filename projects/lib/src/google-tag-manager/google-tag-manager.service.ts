import { Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'

import { GtmEvent } from '@baloise/web-app-google-utils'

const GTM_EVENT_NAME = 'bal.event'
const GTM_ROUTE_CHANGE_EVENT = 'bal.routeChange'

export interface GoogleTagManagerDataLayer<T = unknown> {
  dataLayer?: T[]
}

export interface GoogleTagManagerEvent extends GtmEvent {
  event?: string
  balUrl?: string
}

export interface GoogleTagManagerDataEvent {
  event?: string
  data?: any
  balUrl?: string
}

@Injectable({ providedIn: 'root' })
export class GoogleTagManagerDataService {
  private virtualUrl: string = ''

  constructor(private router: Router) {}

  triggerCustomEvent(event: GoogleTagManagerEvent): void {
    this.addVirtualUrlToData(event)
    this.trigger(GTM_EVENT_NAME, event)
  }

  triggerClick(event: GoogleTagManagerEvent): void {
    this.triggerCustomEvent({ ...event, action: 'CLICK' })
  }

  triggerLoad(event: GoogleTagManagerEvent): void {
    this.triggerCustomEvent({ ...event, action: 'LOAD' })
  }

  triggerFocus(event: GoogleTagManagerEvent): void {
    this.triggerCustomEvent({ ...event, action: 'FOCUS' })
  }

  triggerRouteChange(url?: string): void {
    const event = {} as GoogleTagManagerEvent
    this.virtualUrl = url || this.router.url
    this.addVirtualUrlToData(event)
    this.trigger(GTM_ROUTE_CHANGE_EVENT, event)
  }

  registerRouteEventListener(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.triggerRouteChange(event.urlAfterRedirects)
    })
  }

  private addVirtualUrlToData(event: GoogleTagManagerEvent): void {
    event.balUrl = this.virtualUrl
  }

  private trigger(event: string, data?: GoogleTagManagerDataEvent): void {
    this.push({
      event,
      ...data,
    })
  }

  private push(data: GoogleTagManagerDataEvent): void {
    this.getDataLayer().push(data)
  }

  private getDataLayer(): unknown[] {
    const win = window as GoogleTagManagerDataLayer
    if (win && win.dataLayer) {
      return win.dataLayer || []
    }
    return []
  }
}
