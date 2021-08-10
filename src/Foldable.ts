import { FoldableStatus, IFoldable, Keycode } from './types';
import * as a11y from './A11y';
import { is } from './utils';


export class Foldable {
  private readonly _triggers: HTMLElement[];
  private readonly _target: HTMLElement|null;
  private readonly _options: IFoldable;
  private readonly _handler: (e: Event) => Promise<any>;
  private readonly _clickOutside: (e: Event) => Promise<any>;
  private readonly _keyboardHandler: (e: KeyboardEvent) => Promise<any>;
  private _status: FoldableStatus;
  private _focusTrap: a11y.FocusTrap|undefined;
  private static defaults: IFoldable = {
    triggers: [],
    target: '',
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
    return FoldableStatus[this._status];
  }

  set clickOutside(val: boolean) {
    this._options.enableClickOutside = val;
  }

  constructor(options: IFoldable) {
    this._options = Object.assign({}, Foldable.defaults, options);
    this._status = this._options.statusByDefault;
    this._triggers = Foldable.parseTriggersOptionsToArray(this._options.triggers);
    this._target = is.str(this._options.target) ? document.querySelector(<string>this._options.target) : <HTMLElement>this._options.target;

    this._handler = async (e: Event) => {
      e.preventDefault();
      await this.toggle();
    }

    this._clickOutside = async (e: Event) => {
      if (e.target !== null) {
        await this.clickOutsideHandler(<HTMLElement>e.target);
      }
    }

    this._keyboardHandler = async (e: KeyboardEvent) => {
      if (e.keyCode === Keycode.Echap && this._status !== this._options.statusByDefault) {
        e.preventDefault();
        await this.toggle();
      }
    };

    this.subscribeTriggers();

    if (this._options.useFocusTrap) {
      this.enableFocusTrap();
    }

    if (this._options.statusByDefault === FoldableStatus.Opened) {
      this._status = FoldableStatus.Closed;
      this.toggle();
    }
  }

  // Reverse the Foldable status
  async toggle() {
    if (this._status === FoldableStatus.Busy ) return;

    switch (this._status) {
      case FoldableStatus.Opened:
        await this._close().then(() => {
          this._status = FoldableStatus.Closed;
          this.setClasses();
          this.setA11y();

          if (is.nullOrUndefined(this._focusTrap)) {
            this._focusTrap?.dispose(); // Remove focusTrap event listener
          }
        });
        break;
      case FoldableStatus.Closed:
        await this._open().then(() => {
          this._status = FoldableStatus.Opened;
          this.setClasses();
          this.setA11y();
          this._target?.focus();

          // Enable the focus trap
          this._focusTrap?.listen();
        });
        break;
    }

    // Enable clickOutside
    if (this._status !== this._options.statusByDefault && this._options.enableClickOutside) {
      document.documentElement.addEventListener('click', this._clickOutside);
    }
  }

  private async _open(): Promise<any> {
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
   * Enable all events listeners on triggers
   * Remove disable classe
   */
  enable() {
    this.subscribeTriggers();
    this._triggers.forEach((trigger) => {
      trigger.classList.remove(this._options.classes.disabledClass);
    });
  }

  /**
   * Disable all events listeners on triggers
   * Add disabled classe
   * Dispose the focus trap
   */
  disable() {
    this.unsubscribeTriggers();
    this._triggers.forEach((trigger) => {
      trigger.classList.add(this._options.classes.disabledClass);
    });
  }

  enableFocusTrap() {
    if (this._focusTrap === undefined && this._target !== null) {
      this._focusTrap = new a11y.FocusTrap(this._target);
    }

    if (this._focusTrap instanceof a11y.FocusTrap && this._target !== null) {
      this._focusTrap.listen();
    }
  }

  disableFocusTrap() {
    if (this._focusTrap instanceof a11y.FocusTrap) {
      this._focusTrap.dispose();
    }
  }

  /**
   * Add attributes for a11Y
   * @private
   */
  private setA11y() {
    const isOpened = this._status === FoldableStatus.Opened;
    const isOpenedStr = (this._status === FoldableStatus.Opened).toString();
    const isClosed = this._status === FoldableStatus.Closed;
    const isClosedStr = (this._status === FoldableStatus.Closed).toString();

    // Add attributes on triggers
    for (let i = 0; i < this._triggers.length; i++) {
      this._triggers[i].setAttribute('aria-expanded', isOpenedStr);
    }

    // Add attributes on the target
    this._target?.setAttribute('aria-hidden', isClosedStr);
    this._target?.setAttribute('tabindex', isClosed ? '-1' : '0');

    this.makeTabbable(isOpened);
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
      case FoldableStatus.Closed:
        this._triggers.forEach((trigger) => {
          trigger.classList.remove(this._options.classes.busyClass);
          trigger.classList.remove(this._options.classes.openedClass);
          trigger.classList.add(this._options.classes.closedClass);
        });
        break;
      case FoldableStatus.Opened:
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
  private subscribeTriggers() {
    this._triggers.forEach((trigger: HTMLElement) => {
      trigger.addEventListener(this._options.eventType, this._handler);
    });

    // Echap keyup listener works only when the target is visible.
    // In case of statusByDefault is set to FoldableStatus.Opened this listener is useless
    // So it will use only when the statusByDefault is set to FoldableStatus.Closed
    if (this._options.statusByDefault === FoldableStatus.Closed) {
      this._target?.addEventListener('keyup', this._keyboardHandler);
    }
  }

  /***
   * Remove events
   * @private
   */
  private unsubscribeTriggers() {
    this._triggers.forEach((trigger) => {
      trigger.removeEventListener(this._options.eventType, this._handler);
    });
  }

  /**
   * Check if the element is present into triggers or target
   * @param {HTMLElement} element
   * @private
   */
  private isFoldableElement(element: HTMLElement|null): boolean {
    if (element === null) return false;
    return this._triggers.indexOf(element) !== -1 && element !== this._target;
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
