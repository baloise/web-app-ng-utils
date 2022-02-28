import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MarkSanitizedPipe } from './mark-sanitized.pipe'

@NgModule({
  imports: [CommonModule],
  declarations: [MarkSanitizedPipe],
  exports: [MarkSanitizedPipe],
  providers: [MarkSanitizedPipe],
})
export class BalNgPipesModule {}
