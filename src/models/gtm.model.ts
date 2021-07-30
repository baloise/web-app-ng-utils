export const GtmAction = {
  Click: "CLICK",
  Focus: "FOCUS",
  Load: "LOAD",
  Search: "SEARCH",
};

export interface GtmEvent {
  action: string;
  category: string;
  label?: string;
  value?: NonNegativeInteger;
}

export type NonNegativeInteger = number;
