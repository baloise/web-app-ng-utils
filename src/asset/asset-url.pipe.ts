import { Pipe, PipeTransform } from "@angular/core";
import { AssetConfigProviderService } from "./asset-config.provider.service";

@Pipe({
  name: "balAssetUrl",
})
export class AssetUrlPipe implements PipeTransform {
  private applicationContextPath = "";

  constructor(assetConfigProviderService: AssetConfigProviderService) {
    this.applicationContextPath =
      assetConfigProviderService.getApplicationContextPath();
  }

  transform(value: string): string {
    return this.applicationContextPath + value;
  }
}
