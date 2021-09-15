export class Option<T> {
  constructor(public name: string, public label: string, public value: T) {}

  equals(other: Option<T>): boolean {
    if (other) {
      return this.equalsIgnoreCase(other.value);
    } else {
      return false;
    }
  }

  equalsValue(otherValue: T): boolean {
    return this.equalsIgnoreCase(otherValue);
  }

  private equalsIgnoreCase(otherValue: T) {
    if (this.value && otherValue) {
      return (
        JSON.stringify(this.value).toLowerCase() ===
        JSON.stringify(otherValue).toLowerCase()
      );
    } else {
      return this.value === otherValue;
    }
  }
}

export class MSDropdownOption<T> extends Option<T> {
  constructor(
    public name: string,
    public label: string,
    public value: T,
    public icon?: string,
    public badgeType?: BadgeType
  ) {
    super(name, label, value);
  }
}

export type BadgeType =
  | "default"
  | "danger"
  | "success"
  | "warning"
  | "primary";
