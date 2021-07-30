import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AssetUrlPipe } from "./asset-url.pipe";

@NgModule({
  imports: [CommonModule],
  declarations: [AssetUrlPipe],
  exports: [AssetUrlPipe],
  providers: [AssetUrlPipe],
})
export class BaloiseAngularAssetConfigModule {}
