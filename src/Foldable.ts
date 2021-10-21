import { FoldableStatus, IFoldable, Keycode } from './types';
import * as a11y from './A11y';
import { debounce, is } from './utils';


export class Foldable {
  private readonly _triggers: HTMLElement[];
  private _originalTrigger: HTMLElement|undefined = undefined;
  private readonly _target: HTMLElement|null;
  private readonly _options: IFoldable;
  private readonly _handler: (e: Event) => Promise<void>;
  private readonly _clickOutside: (e: Event) => Promise<void>;
  private readonly _keyboardHandler: (e: KeyboardEvent) => Promise<void>;
  private readonly _breakpointsHandler: (e: UIEvent) => void;
  private _escapeHandlerAdded: boolean = false;
  private _eventListenersAdded: boolean = false;
  private _status: FoldableStatus;
  private _focusTrap: a11y.FocusTrap|undefined;
  private static defaults: IFoldable = {
    triggers: [],
    target: '',
    breakpoints: {
      min: null, // >= 0
      max: null // <= 640
    },
    classes: {
      busyClass: 'f_busy',
      closedClass: 'f_closed',
      openedClass: 'f_opened',
      disabledClass: 'f_disabled'
    },
    eventType: 'click',
    statusByDefault: 0,
    enableClickOutside: true,
    useFocusTrap: false,
    open: async () => {},
    close: async () => {},
  };

  get status(): FoldableStatus {
    return this._status;
  }

  get statusName(): string {
    return FoldableStatus[this.status];
  }

  set clickOutside(val: boolean) {
    this._options.enableClickOutside = val;
  }

  set focusTrap(val: boolean) {
    this._options.useFocusTrap = val;
  }

  constructor(options: IFoldable) {
    this._options = Object.assign({}, Foldable.defaults, options);
    this._options.classes = Object.assign({}, Foldable.defaults.classes, options.classes);
    this._options.breakpoints = Object.assign({}, Foldable.defaults.breakpoints, options.breakpoints);
    this._status = this._options.statusByDefault;
    this._triggers = Foldable.parseTriggersOptionsToArray(this._options.triggers);
    this._target = is.str(this._options.target) ? document.querySelector(<string>this._options.target) : <HTMLElement>this._options.target;

    this._handler = async (e: Event) => {
      e.preventDefault();

      if (this.status === this._options.statusByDefault) {
        this._originalTrigger = <HTMLElement>e.target;
      }

      await this.toggle();
    }

    this._clickOutside = async (e: Event) => {
      if (e.target !== null) {
        await this.clickOutsideHandler(<HTMLElement>e.target);
      }
    }

    this._keyboardHandler = async (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.keyCode === Keycode.Echap && this._status !== this._options.statusByDefault) {
        e.preventDefault();
        await this.toggle();
      }
    };

    this._breakpointsHandler = debounce<UIEvent, Promise<void>>(async (e: UIEvent) => {
      if (this.isInBreakpointArea()) {
        if (!this._eventListenersAdded) {
          this.addTriggersEvents();
        }
      } else {
       if (this._eventListenersAdded) {
         await this.toggle();
         this.removeTriggersEvents();
       }
       this.removeA11y();
      }
    }, 300);

    if (this._options.statusByDefault === FoldableStatus.Open) {
      this._status = FoldableStatus.Close;
      this.toggle();
    }

    // Add all events listeners
    this.enable();
  }

  // Reverse the Foldable status
  async toggle() {
    if (this._status === FoldableStatus.Busy ) return;

    switch (this._status) {
      case FoldableStatus.Open:
        await this._close().then(() => {
          this._status = FoldableStatus.Close;
          this.setClasses();
          this.setA11y();

          // if (is.nullOrUndefined(this._focusTrap)) {
          //   this._focusTrap?.dispose(); // Remove focusTrap event listener
          // }

          this._originalTrigger?.focus();
        });
        break;
      case FoldableStatus.Close:
        await this._open().then(() => {
          this._status = FoldableStatus.Open;
          this.setClasses();
          this.setA11y();
          this._target?.focus();
        });
        break;
    }

    // Enable clickOutside
    if (this._status !== this._options.statusByDefault && this._options.enableClickOutside) {
      document.documentElement.addEventListener('click', this._clickOutside);
    }

    // Enable focusTrap
    if (this._status !== this._options.statusByDefault && this._options.useFocusTrap) {
      this.enableFocusTrap();
    } else {
      this._focusTrap?.dispose();
    }
  }

  private async _open(): Promise<[HTMLElement[], HTMLElement]> {
    this._status = FoldableStatus.Busy;
    this.setClasses();
    return this._options.open.call<this, any[], any>(this, [
      this._triggers,
      this._target
    ]);
  }

  private async _close(): Promise<any> {
    this._status = FoldableStatus.Busy;
    this.setClasses();
    return this._options.close.call<this, any[], any>(this, [
      this._triggers,
      this._target
    ]);
  }

  /**
   * Init
   * Add all events listeners
   * Instantiate the focusTrap or not
   * Remove disable classe
   */
  enable() {
    if (this._options.breakpoints.min !== null || this._options.breakpoints.max !== null) {
      window.addEventListener('resize', this._breakpointsHandler);
    }

    if (this.isInBreakpointArea()) {
      this.addTriggersEvents();
      this._triggers.forEach((trigger) => {
        trigger.classList.remove(this._options.classes.disabledClass);
      });

      if (this._options.useFocusTrap) {
        this.enableFocusTrap();
      }
    }
  }

  /**
   * Disable all events listeners on triggers
   * Add disabled classe
   * Dispose the focus trap
   */
  disable() {
    this.removeTriggersEvents();
    this._triggers.forEach((trigger) => {
      trigger.classList.add(this._options.classes.disabledClass);
    });
    window.removeEventListener('resize', this._breakpointsHandler);
  }

  enableFocusTrap() {
    if (this._focusTrap === undefined && this._target !== null) {
      this._focusTrap = new a11y.FocusTrap(this._target);
    }

    if (this._focusTrap instanceof a11y.FocusTrap && this._target !== null) {
      this._focusTrap.listen();
      this._focusTrap.update();
    }
  }

  disableFocusTrap() {
    if (this._focusTrap instanceof a11y.FocusTrap) {
      this._focusTrap.dispose();
      this._focusTrap = undefined;
    }
  }

  enableEscapeHandler() {
    // Add eventListener if not added
    if (!this._escapeHandlerAdded) {
      this._target?.addEventListener('keyup', this._keyboardHandler);
      this._escapeHandlerAdded = true;
    }
  }

  disableEscapeHandler() {
    // Remove eventListener if already added
    if (this._escapeHandlerAdded) {
      this._target?.removeEventListener('keyup', this._keyboardHandler);
      this._escapeHandlerAdded = false;
    }
  }

  /**
   * Add attributes for a11Y
   * @private
   */
  private setA11y() {
    const isOpen = this._status === FoldableStatus.Open;
    const isClose = this._status === FoldableStatus.Close;

    // Add attributes on triggers
    for (let i = 0; i < this._triggers.length; i++) {
      this._triggers[i].setAttribute('aria-expanded', isOpen.toString());
    }

    // Add attributes on the target
    this._target?.setAttribute('aria-hidden', isClose.toString());
    this._target?.setAttribute('tabindex', isClose ? '-1' : '0');

    this.makeTabbable(isOpen);
  }

  private removeA11y() {
    for (let i = 0; i < this._triggers.length; i++) {
      this._triggers[i].removeAttribute('aria-expanded');
    }

    // Add attributes on the target
    this._target?.removeAttribute('aria-hidden');
    this._target?.removeAttribute('tabindex');
  }

  /**
   * A11y - Make focusable elements tabbable
   * @param {boolean} val // make tabbable or not...
   * @private
   */
  private makeTabbable(val: boolean) {
    const focusables = this._target !== null ? a11y.findFocusableElements(this._target) : [];
    for (let i = 0; i < focusables.length; i++) {
      focusables[i].setAttribute('tabindex', val ? '0' : '-1');
    }
  }

  private setClasses() {
    switch (this._status) {
      case FoldableStatus.Busy:
        this._triggers.forEach((trigger) => {
          trigger.classList.add(this._options.classes.busyClass);
        });
        break;
      case FoldableStatus.Close:
        this._triggers.forEach((trigger) => {
          trigger.classList.remove(this._options.classes.busyClass);
          trigger.classList.remove(this._options.classes.openedClass);
          trigger.classList.add(this._options.classes.closedClass);
        });
        break;
      case FoldableStatus.Open:
        this._triggers.forEach((trigger) => {
          trigger.classList.remove(this._options.classes.busyClass);
          trigger.classList.remove(this._options.classes.closedClass);
          trigger.classList.add(this._options.classes.openedClass);
        });
        break;
    }
  }

  /**
   * Click outside to reverse the foldable status
   * @param {HTMLElement} target
   * @private
   */
  private async clickOutsideHandler(target: HTMLElement|null) {
    if (target !== null && !this.isFoldableElement(target) && this._status !== this._options.statusByDefault) {
      // find ancestor
      let ancestor: HTMLElement|null = target.parentElement;

      while (ancestor !== null && !this.isFoldableElement(ancestor)) {
        ancestor = ancestor.parentElement;
      }

      if (!this.isFoldableElement(ancestor)) {
        await this.toggle();
        // Remove the event
        (() => {
          document.documentElement.removeEventListener('click', this._clickOutside);
        })();
      }
    }
  }

  /**
   * Add events
   * @private
   */
  private addTriggersEvents() {
    this._triggers.forEach((trigger: HTMLElement) => {
      trigger.addEventListener(this._options.eventType, this._handler);
    });

    // Escape keyup listener works only when the target is visible.
    // In case of statusByDefault is set to FoldableStatus.Opened this listener is useless
    // So it will use only when the statusByDefault is set to FoldableStatus.Closed
    if (this._options.statusByDefault === FoldableStatus.Close) {
      this._target?.addEventListener('keyup', this._keyboardHandler);
      this._escapeHandlerAdded = true;
    }

    this._eventListenersAdded = true;
  }

  /**
   * Remove events
   * @private
   */
  private removeTriggersEvents() {
    this._triggers.forEach((trigger) => {
      trigger.removeEventListener(this._options.eventType, this._handler);
    });

    if (this._escapeHandlerAdded) {
      this._target?.removeEventListener('keyup', this._keyboardHandler);
    }

    this._eventListenersAdded = false;
  }

  private isInBreakpointArea(): boolean {
    const min: null|number = this._options.breakpoints.min;
    const max: null|number = this._options.breakpoints.max;
    const wWidth = window.innerWidth;

    return min === null && max === null ||
      min !== null && max === null && wWidth >= min ||
      min === null && max !== null && wWidth <= max ||
      min !== null && max !== null && wWidth >= min && wWidth <= max;
  }

  /**
   * Check if the element is present into triggers or target
   * @param {HTMLElement} element
   * @private
   */
  private isFoldableElement(element: HTMLElement|null): boolean {
    if (element === null) return false;
    return this._triggers.indexOf(element) !== -1 || element === this._target;
  }

  private findOriginalTrigger(target: EventTarget | null) {
    return undefined;
  }

  /**
   * Transform value to HTMLElement[]
   * @private
   */
  private static parseTriggersOptionsToArray(value: string|NodeList|Node|HTMLElement|HTMLElement[]): HTMLElement[] {
    if (is.str(value)) return [].slice.call(document.querySelectorAll(value as string));

    if (is.node(value)) return [<HTMLElement>value];

    if (is.nodeList(value)) return [].slice.call(value);

    if (is.array(value)) return [...value as []];

    return [];
  }
}
