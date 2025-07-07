import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser'

@Pipe({
    name: 'balSafe',
    standalone: false
})
export class MarkSanitizedPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  public transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    value = value || ''

    switch (type) {
      case 'html':
        return this.domSanitizer.bypassSecurityTrustHtml(value)
      case 'style':
        return this.domSanitizer.bypassSecurityTrustStyle(value)
      case 'script':
        return this.domSanitizer.bypassSecurityTrustScript(value)
      case 'url':
        return this.domSanitizer.bypassSecurityTrustUrl(value)
      case 'resourceUrl':
        return this.domSanitizer.bypassSecurityTrustResourceUrl(value)
      default:
        throw new Error(`Invalid safe type specified: ${type}`)
    }
  }
}
