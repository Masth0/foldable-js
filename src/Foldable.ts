import {FoldableInterface, FoldableState} from "./types";
import {is} from "./utils";

class Foldable {
  private readonly _triggers: HTMLElement[];
  private readonly _targets: HTMLElement[] = [];
  private readonly _options: FoldableInterface;
  private readonly _handler: (e: Event) => Promise<any>;
  private readonly _clickOutside: (e: Event) => Promise<any>;
  private _state: FoldableState;

  set state(newState: FoldableState) {
    this._state = newState;
    this.setClassOnTriggers();
  }

  get state(): FoldableState {
    return this._state;
  }

  get stateName(): string {
    return FoldableState[this._state];
  }

  constructor(options: FoldableInterface) {
    const defaults: FoldableInterface = Foldable.getDefaults();
    this._options = Object.assign({}, defaults, options);
    this._state = this._options.stateByDefault;
    this._triggers = Foldable.parseToHtmlElementArray(this._options.triggers);
    this._targets = Foldable.parseToHtmlElementArray(this._options.targets);

    this._handler = async (e: Event) => {
      e.preventDefault();
      await this.eventHandler();
    }

    this._clickOutside = async (e: Event) => {
      if (e.target !== null) {
        await this.clickOutsideHandler(<HTMLElement>e.target);
      }
    }

    this.subscribeTriggers();
  }

  async open(): Promise<any> {
    if (this._state !== FoldableState.Busy) {
      this.state = FoldableState.Busy;
       const result = await this._options.open.call<this, any[], any>(this, [
        this._triggers,
        this._targets
      ]);
      this.state = FoldableState.Open;
      if (this._options.clickOutsideToResetState) {
        // Return to config.stateByDefault if the current state is not the state by default.
        document.documentElement.addEventListener('click', this._clickOutside);
      }
      return result;
    }
  }

  async close(): Promise<any> {
    if (this._state !== FoldableState.Busy) {
      this.state = FoldableState.Busy;
      const result = await this._options.close.call<this, any[], any>(this, [
        this._triggers,
        this._targets
      ]);
      this.state = FoldableState.Close;
      if (this._options.clickOutsideToResetState) {
        // Return to config.stateByDefault if the current state is not the state by default.
        document.documentElement.addEventListener('click', this._clickOutside);
      }
      return result;
    }
  }

  enable() {
    // subscribe events
    this.subscribeTriggers();
    this._triggers.forEach((trigger) => {
      trigger.classList.remove(this._options.classes.disabledClass);
    });
  }

  disable() {
    // unscubscribe events
    this.unsubscribeTriggers();
    this._triggers.forEach((trigger) => {
      trigger.classList.add(this._options.classes.disabledClass);
    });
  }

  private async eventHandler() {
    if (this._state === FoldableState.Busy ) return;

    switch (this._state) {
      case FoldableState.Open:
        // Close
        await this.close();
        break;
      case FoldableState.Close:
        // Open
        await this.open();
        break;
    }
  }

  private async clickOutsideHandler(target: HTMLElement|null) {
    if (target !== null && !this.isFoldableElement(target) && this._state !== this._options.stateByDefault) {
      // find ancestor
      let ancestor: HTMLElement|null = target.parentElement;
      while (ancestor !== null && !this.isFoldableElement(ancestor)) {
        ancestor = ancestor.parentElement;
      }
      if (!this.isFoldableElement(ancestor)) {
        await this.eventHandler();
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

  private setClassOnTriggers() {
    switch (this._state) {
      case FoldableState.Busy:
        this._triggers.forEach((trigger) => {
          trigger.classList.add(this._options.classes.busyClass);
        });
        break;
      case FoldableState.Close:
        this._triggers.forEach((trigger) => {
          trigger.classList.remove(this._options.classes.busyClass);
          trigger.classList.remove(this._options.classes.openClass);
          trigger.classList.add(this._options.classes.closeClass);
        });
        break;
      case FoldableState.Open:
        this._triggers.forEach((trigger) => {
          trigger.classList.remove(this._options.classes.busyClass);
          trigger.classList.remove(this._options.classes.closeClass);
          trigger.classList.add(this._options.classes.openClass);
        });
        break;
    }
  }

  /**
   * Check if the element is present into triggers or targets
   * @param {HTMLElement} element
   * @private
   */
  private isFoldableElement(element: HTMLElement|null): boolean {
    if (element === null) return false;
    return this._triggers.indexOf(element) !== -1 || this._targets.indexOf(element) !== -1;
  }

  /**
   * Transform value to HTMLElement[]
   * @private
   */
  private static parseToHtmlElementArray(value: string|NodeList|Node|HTMLElement|HTMLElement[]): HTMLElement[] {
    if (is.str(value)) {
      return [].slice.call(document.querySelectorAll(value as string));
    }

    if (is.node(value)) {
      return [<HTMLElement>value];
    }

    if (is.nodeList(value)) {
      return [].slice.call(value);
    }

    if (is.array(value)) {
      return [...value as []];
    }

    return [];
  }

  /**
   * Return options by default
   * @private
   */
  private static getDefaults(): FoldableInterface {
    return {
      triggers: '',
      targets: '',
      classes: {
        busyClass: 'f_busy',
        closeClass: 'f_close',
        openClass: 'f_open',
        disabledClass: 'f_disabled'
      },
      eventType: 'click',
      stateByDefault: FoldableState.Close,
      clickOutsideToResetState: true,
      open: async () => {},
      close: async () => {},
    };
  }
}

export {Foldable, FoldableState};

(<any>window).Foldable = Foldable;
(<any>window).FoldableState = FoldableState;
