import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "bal-form-control-cluster",
  templateUrl: "./form-control-cluster.component.html",
  styleUrls: ["./form-control-cluster.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlClusterComponent {
  @Input() header: string;

  hasHeader(): boolean {
    return !!this.header;
  }
}
