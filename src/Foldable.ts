irstenum FoldableState {
  Close,
  Open,
  Animating
}

interface FoldableInterface {
  triggers: string;
  targets: string;
  activeClass: string;
  eventType: string;
  stateByDefault: FoldableState;
  clickOutsideToResetState: boolean;
  breakpoint: BreakpointInterface|null;
  open?: () => void;
  close?: () => void;
}

interface BreakpointInterface {
  reset: boolean;
  min: number;
  max: number;
}

interface CallbackArgumentsInterface {
  event: Event|undefined|null;
  triggers: HTMLElement[];
  targets: HTMLElement[];
  done: () => void;
}

class Foldable {
  private readonly _triggers: HTMLElement[];
  private readonly _targets: HTMLElement[];
  private readonly _eventHandler: (e: Event) => void;
  public config: FoldableInterface;
  public state: FoldableState;

  get stateName(): string {
    return FoldableState[this.state];
  }

  constructor(options?: FoldableInterface) {
    const defaults: FoldableInterface = Foldable.getDefaults();
    this.config = Object.assign({}, defaults, options);

    try {
      this.checkEventType();
    } catch (err) {
      console.error(err);
    }

    this._triggers = [].slice.call(document.querySelectorAll(this.config.triggers));
    this._targets = [].slice.call(document.querySelectorAll(this.config.targets));
    this.state = this.config.stateByDefault;

    this._eventHandler = (e: Event) => {
      e.preventDefault();
      this.toggle(e);
    }

    this.manageEventsOnTriggers();
    window.addEventListener('resize', this.debounce(() => {
      this.manageEventsOnTriggers();
    }, 100));
  }

  /**
   *
   * @param {FoldableState} state
   */
  public setState(state: FoldableState) {
    this.state = state;
  }

  public hardReset() {
    if (this.state !== this.config.stateByDefault) {
      switch (this.state) {
        case FoldableState.Open:
          this.close();
          break;
        case FoldableState.Close:
          this.open();
          break;
      }
    }
  }

  public open(e?: Event) {
    if (this.config.open !== undefined && typeof this.config.open === 'function') {
      this.state = FoldableState.Animating;
      Foldable.executeCallback(this.config.open, this, {
        event: e,
        triggers: this._triggers,
        targets: this._targets,
        done: () => {
          this.setState(FoldableState.Open);
        },
      });
    }
  }

  public close(e?: Event) {
    if (this.config.close !== undefined && typeof this.config.close === 'function') {
      this.state = FoldableState.Animating;
      Foldable.executeCallback(this.config.close, this, {
        event: e,
        triggers: this._triggers,
        targets: this._targets,
        done: () => {
          this.setState(FoldableState.Close);
        },
      });
    }
  }

  public toggle(e?: Event) {
    switch (this.state) {
      case FoldableState.Open:
        this.close(e);
        break;
      case FoldableState.Close:
        this.open(e);
        break;
    }

    const _this = this;
    function handler(e: MouseEvent|TouchEvent) {
      const target = <HTMLElement>e.target;
      if (target !== null) {
        const isOutsideFoldableElements = [_this.config.triggers, _this.config.targets].filter((s) => target.closest(s)).length > 0;
        if (!isOutsideFoldableElements && _this.state !== _this.config.stateByDefault) {
          _this.toggle();
          // Remove the event
          return (() => {
            document.documentElement.removeEventListener('click', handler);
          })();
        }
      }
    }

    // Close userNav Foldable when user click outside
    if (this.config.clickOutsideToResetState) {
      document.documentElement.addEventListener('click', handler);
    }
  }

  private checkEventType() {
    if (this.config.eventType !== 'click' && this.config.eventType !== 'change') {
      throw `Events types allowed are click and change. Your config.eventType = '${this.config.eventType}'`;
    }
  }

  private subscribeTriggers() {
    this._triggers.forEach((trigger) => {
      // Add events to each trigger
      trigger.addEventListener(this.config.eventType, this._eventHandler);
    });
  }

  private unsubscribeTriggers() {
    if (this.config?.breakpoint?.reset) {
      console.log('RESET');
      this.hardReset();
    }
    this._triggers.forEach((trigger) => {
      // Add events to each trigger
      trigger.removeEventListener(this.config.eventType, this._eventHandler);
    });
  }

  private manageEventsOnTriggers() {
    if (this.config.breakpoint === null) {
      this.subscribeTriggers();
      return;
    }

    let wWidth = window.innerWidth;
    // subscribeTriggers or unsubscribeTriggers depending on breakpoint
    if (wWidth > this.config.breakpoint?.min && wWidth < this.config.breakpoint?.max) {
      this.subscribeTriggers();
    } else {
      this.unsubscribeTriggers();
    }
  }

  /**
   * Execute callback after the delay
   * @param {Function} callback
   * @param {Number} delay
   * @returns {Function}
   * @private
   */
  private debounce(callback: () => void, delay: number) {
    let timer: number;
    let _this = this;
    return function() {
      let args: any = arguments;
      let context: Foldable = _this;
      clearTimeout(timer);
      timer = window.setTimeout(function () {
        callback.apply(context, args);
      }, delay);
    }
  }

  /**
   * Call call callback
   * @param {function} fn
   * @param {Foldable} ctx
   * @param {} args
   */
  private static executeCallback(fn: () => void, ctx: Foldable, args: CallbackArgumentsInterface) {
    (function() {
      // @ts-ignore
      fn.call(ctx, args);
    })();
  }

  private static getDefaults(): FoldableInterface {
    return {
      triggers: 'foldable-trigger',
      targets: 'foldable-target',
      activeClass: 'active',
      eventType: 'click',
      stateByDefault: FoldableState.Close,
      clickOutsideToResetState: true,
      breakpoint: null,
      open: undefined,
      close: undefined,
    };
  }
}

export {Foldable, FoldableState};

(<any>window).Foldable = Foldable;
(<any>window).FoldableState = FoldableState;

