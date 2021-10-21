import { Keycode } from './types';

const findFocusableElements = function(container?: HTMLElement): HTMLElement[] {
  const parent = container ? container : document.body;
  const selectors: string[] = [
    'a[href]',
    'button',
    'input',
    'textarea',
    'select',
    'details > summary:first-of-type',
    'video[controls]',
    'audio[controls]',
    '[tabindex="0"]'
  ];
  const selectorStr = selectors.join(',');
  let elements = [].slice.call(parent.querySelectorAll(selectorStr));

  return elements.filter((element: HTMLElement) => element.getBoundingClientRect().width > 0);
}


class FocusTrap {
  private _focusables: HTMLElement[];
  private _lastElement: HTMLElement;
  private _firstElement: HTMLElement;
  private readonly _keyHandler: (e: KeyboardEvent) => void;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this._focusables = findFocusableElements(this.container);
    this._keyHandler = this.handle.bind(this);
    this._lastElement = this._focusables[this._focusables.length -1];
    this._firstElement = this._focusables[0];
  }

  handle(e: KeyboardEvent) {
    if (e.keyCode !== Keycode.Tab) return;

    if (e.shiftKey) {
      if (document.activeElement === this._firstElement) {
        e.preventDefault();
        this._lastElement.focus();
      }
    } else {
      if (document.activeElement === this._lastElement) {
        e.preventDefault();
        this._firstElement.focus();
      }
    }
  }

  update() {
    this._focusables = findFocusableElements(this.container);
    this._lastElement = this._focusables[this._focusables.length -1];
    this._firstElement = this._focusables[0];
  }

  listen() {
    this.container.addEventListener('keydown', this._keyHandler);
  }

  // Kill eventlistener ...
  dispose() {
    this.container.removeEventListener('keydown', this._keyHandler);
  }

}


export { findFocusableElements, FocusTrap };