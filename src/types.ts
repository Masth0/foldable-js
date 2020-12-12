export enum FoldableState {
  Close,
  Open,
  Busy,
}

export interface FoldableInterface {
  triggers: string|Node|NodeList|HTMLElement|HTMLElement[];
  targets: string|Node|NodeList|HTMLElement|HTMLElement[];
  classes: Classesinterface;
  eventType: string;
  stateByDefault: FoldableState;
  clickOutsideToResetState: boolean;
  open: () => Promise<any>;
  close: () => Promise<any>;
}

export interface Classesinterface {
  busyClass: string;
  closeClass: string;
  openClass: string;
  disabledClass: string
}
