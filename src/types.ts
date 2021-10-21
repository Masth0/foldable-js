export interface IFoldable {
  triggers: string|Node|NodeList|HTMLElement|HTMLElement[];
  target: string|Node|HTMLElement;
  classes: IStatusClasses;
  eventType: string;
  useFocusTrap: boolean;
  statusByDefault: FoldableStatus; // if set to FoldableStatus.Opened, it's up to you to ensure that element is visible and has tabindex="0" on his focusable elements
  enableClickOutside: boolean;
  open: () => Promise<any>;
  close: () => Promise<any>;
  breakpoints: IBreakpoints;
}

interface IBreakpoints {
  min: null|number;
  max: null|number;
}

export enum FoldableStatus {
  Close,
  Open,
  Busy,
}

export interface IStatusClasses {
  busyClass: string;
  closedClass: string;
  openedClass: string;
  disabledClass: string
}

export enum Keycode {
  Echap = 27,
  Tab = 9,
}