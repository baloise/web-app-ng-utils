export abstract class AssetConfigProviderService {
  abstract getApplicationContextPath(): string;

  toAssetUrl(url: string): string {
    return this.getApplicationContextPath() + url;
  }
}
