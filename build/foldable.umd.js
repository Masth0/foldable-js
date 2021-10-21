(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Foldable = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var FoldableStatus;
    (function (FoldableStatus) {
        FoldableStatus[FoldableStatus["Close"] = 0] = "Close";
        FoldableStatus[FoldableStatus["Open"] = 1] = "Open";
        FoldableStatus[FoldableStatus["Busy"] = 2] = "Busy";
    })(FoldableStatus || (FoldableStatus = {}));
    var Keycode;
    (function (Keycode) {
        Keycode[Keycode["Echap"] = 27] = "Echap";
        Keycode[Keycode["Tab"] = 9] = "Tab";
    })(Keycode || (Keycode = {}));

    var findFocusableElements = function (container) {
        var parent = container ? container : document.body;
        var selectors = [
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
        var selectorStr = selectors.join(',');
        var elements = [].slice.call(parent.querySelectorAll(selectorStr));
        return elements.filter(function (element) { return element.getBoundingClientRect().width > 0; });
    };
    var FocusTrap = /** @class */ (function () {
        function FocusTrap(container) {
            this.container = container;
            this._focusables = findFocusableElements(this.container);
            this._keyHandler = this.handle.bind(this);
            this._lastElement = this._focusables[this._focusables.length - 1];
            this._firstElement = this._focusables[0];
        }
        FocusTrap.prototype.handle = function (e) {
            if (e.keyCode !== Keycode.Tab)
                return;
            if (e.shiftKey) {
                if (document.activeElement === this._firstElement) {
                    e.preventDefault();
                    this._lastElement.focus();
                }
            }
            else {
                if (document.activeElement === this._lastElement) {
                    e.preventDefault();
                    this._firstElement.focus();
                }
            }
        };
        FocusTrap.prototype.update = function () {
            this._focusables = findFocusableElements(this.container);
            this._lastElement = this._focusables[this._focusables.length - 1];
            this._firstElement = this._focusables[0];
        };
        FocusTrap.prototype.listen = function () {
            this.container.addEventListener('keydown', this._keyHandler);
        };
        // Kill eventlistener ...
        FocusTrap.prototype.dispose = function () {
            this.container.removeEventListener('keydown', this._keyHandler);
        };
        return FocusTrap;
    }());

    var is = {
        array: function (v) { return Array.isArray(v); },
        str: function (v) { return typeof v === 'string'; },
        nodeList: function (v) { return v instanceof NodeList; },
        node: function (v) {
            var vNode = v;
            return !!vNode.nodeType;
        },
        nullOrUndefined: function (val) {
            return val === null || val === undefined;
        }
    };
    /**
     * Execute the callback after the delay
     * @param {Function} callback
     * @param {Number} delay
     * @returns {Function}
     */
    function debounce(callback, delay) {
        var timer;
        return function () {
            var args = arguments;
            // @ts-ignore
            var context = this;
            clearTimeout(timer);
            timer = setTimeout(function () {
                // @ts-ignore
                callback.apply(context, args);
            }, delay);
        };
    }

    var Foldable = /** @class */ (function () {
        function Foldable(options) {
            var _this = this;
            this._originalTrigger = undefined;
            this._escapeHandlerAdded = false;
            this._eventListenersAdded = false;
            this._options = Object.assign({}, Foldable.defaults, options);
            this._options.classes = Object.assign({}, Foldable.defaults.classes, options.classes);
            this._options.breakpoints = Object.assign({}, Foldable.defaults.breakpoints, options.breakpoints);
            this._status = this._options.statusByDefault;
            this._triggers = Foldable.parseTriggersOptionsToArray(this._options.triggers);
            this._target = is.str(this._options.target) ? document.querySelector(this._options.target) : this._options.target;
            this._handler = function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.preventDefault();
                            if (this.status === this._options.statusByDefault) {
                                this._originalTrigger = e.target;
                            }
                            return [4 /*yield*/, this.toggle()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            this._clickOutside = function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(e.target !== null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.clickOutsideHandler(e.target)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); };
            this._keyboardHandler = function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.stopPropagation();
                            if (!(e.keyCode === Keycode.Echap && this._status !== this._options.statusByDefault)) return [3 /*break*/, 2];
                            e.preventDefault();
                            return [4 /*yield*/, this.toggle()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); };
            this._breakpointsHandler = debounce(function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isInBreakpointArea()) return [3 /*break*/, 1];
                            if (!this._eventListenersAdded) {
                                this.addTriggersEvents();
                            }
                            return [3 /*break*/, 4];
                        case 1:
                            if (!this._eventListenersAdded) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.toggle()];
                        case 2:
                            _a.sent();
                            this.removeTriggersEvents();
                            _a.label = 3;
                        case 3:
                            this.removeA11y();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); }, 300);
            if (this._options.statusByDefault === FoldableStatus.Open) {
                this._status = FoldableStatus.Close;
                this.toggle();
            }
            // Add all events listeners
            this.enable();
        }
        Object.defineProperty(Foldable.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Foldable.prototype, "statusName", {
            get: function () {
                return FoldableStatus[this.status];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Foldable.prototype, "clickOutside", {
            set: function (val) {
                this._options.enableClickOutside = val;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Foldable.prototype, "focusTrap", {
            set: function (val) {
                this._options.useFocusTrap = val;
            },
            enumerable: false,
            configurable: true
        });
        // Reverse the Foldable status
        Foldable.prototype.toggle = function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (this._status === FoldableStatus.Busy)
                                return [2 /*return*/];
                            _b = this._status;
                            switch (_b) {
                                case FoldableStatus.Open: return [3 /*break*/, 1];
                                case FoldableStatus.Close: return [3 /*break*/, 3];
                            }
                            return [3 /*break*/, 5];
                        case 1: return [4 /*yield*/, this._close().then(function () {
                                var _a;
                                _this._status = FoldableStatus.Close;
                                _this.setClasses();
                                _this.setA11y();
                                // if (is.nullOrUndefined(this._focusTrap)) {
                                //   this._focusTrap?.dispose(); // Remove focusTrap event listener
                                // }
                                (_a = _this._originalTrigger) === null || _a === void 0 ? void 0 : _a.focus();
                            })];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this._open().then(function () {
                                var _a;
                                _this._status = FoldableStatus.Open;
                                _this.setClasses();
                                _this.setA11y();
                                (_a = _this._target) === null || _a === void 0 ? void 0 : _a.focus();
                            })];
                        case 4:
                            _c.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            // Enable clickOutside
                            if (this._status !== this._options.statusByDefault && this._options.enableClickOutside) {
                                document.documentElement.addEventListener('click', this._clickOutside);
                            }
                            // Enable focusTrap
                            if (this._status !== this._options.statusByDefault && this._options.useFocusTrap) {
                                this.enableFocusTrap();
                            }
                            else {
                                (_a = this._focusTrap) === null || _a === void 0 ? void 0 : _a.dispose();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        Foldable.prototype._open = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._status = FoldableStatus.Busy;
                    this.setClasses();
                    return [2 /*return*/, this._options.open.call(this, [
                            this._triggers,
                            this._target
                        ])];
                });
            });
        };
        Foldable.prototype._close = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._status = FoldableStatus.Busy;
                    this.setClasses();
                    return [2 /*return*/, this._options.close.call(this, [
                            this._triggers,
                            this._target
                        ])];
                });
            });
        };
        /**
         * Init
         * Add all events listeners
         * Instantiate the focusTrap or not
         * Remove disable classe
         */
        Foldable.prototype.enable = function () {
            var _this = this;
            if (this._options.breakpoints.min !== null || this._options.breakpoints.max !== null) {
                window.addEventListener('resize', this._breakpointsHandler);
            }
            if (this.isInBreakpointArea()) {
                this.addTriggersEvents();
                this._triggers.forEach(function (trigger) {
                    trigger.classList.remove(_this._options.classes.disabledClass);
                });
                if (this._options.useFocusTrap) {
                    this.enableFocusTrap();
                }
            }
        };
        /**
         * Disable all events listeners on triggers
         * Add disabled classe
         * Dispose the focus trap
         */
        Foldable.prototype.disable = function () {
            var _this = this;
            this.removeTriggersEvents();
            this._triggers.forEach(function (trigger) {
                trigger.classList.add(_this._options.classes.disabledClass);
            });
            window.removeEventListener('resize', this._breakpointsHandler);
        };
        Foldable.prototype.enableFocusTrap = function () {
            if (this._focusTrap === undefined && this._target !== null) {
                this._focusTrap = new FocusTrap(this._target);
            }
            if (this._focusTrap instanceof FocusTrap && this._target !== null) {
                this._focusTrap.listen();
                this._focusTrap.update();
            }
        };
        Foldable.prototype.disableFocusTrap = function () {
            if (this._focusTrap instanceof FocusTrap) {
                this._focusTrap.dispose();
                this._focusTrap = undefined;
            }
        };
        Foldable.prototype.enableEscapeHandler = function () {
            var _a;
            // Add eventListener if not added
            if (!this._escapeHandlerAdded) {
                (_a = this._target) === null || _a === void 0 ? void 0 : _a.addEventListener('keyup', this._keyboardHandler);
                this._escapeHandlerAdded = true;
            }
        };
        Foldable.prototype.disableEscapeHandler = function () {
            var _a;
            // Remove eventListener if already added
            if (this._escapeHandlerAdded) {
                (_a = this._target) === null || _a === void 0 ? void 0 : _a.removeEventListener('keyup', this._keyboardHandler);
                this._escapeHandlerAdded = false;
            }
        };
        /**
         * Add attributes for a11Y
         * @private
         */
        Foldable.prototype.setA11y = function () {
            var _a, _b;
            var isOpen = this._status === FoldableStatus.Open;
            var isClose = this._status === FoldableStatus.Close;
            // Add attributes on triggers
            for (var i = 0; i < this._triggers.length; i++) {
                this._triggers[i].setAttribute('aria-expanded', isOpen.toString());
            }
            // Add attributes on the target
            (_a = this._target) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-hidden', isClose.toString());
            (_b = this._target) === null || _b === void 0 ? void 0 : _b.setAttribute('tabindex', isClose ? '-1' : '0');
            this.makeTabbable(isOpen);
        };
        Foldable.prototype.removeA11y = function () {
            var _a, _b;
            for (var i = 0; i < this._triggers.length; i++) {
                this._triggers[i].removeAttribute('aria-expanded');
            }
            // Add attributes on the target
            (_a = this._target) === null || _a === void 0 ? void 0 : _a.removeAttribute('aria-hidden');
            (_b = this._target) === null || _b === void 0 ? void 0 : _b.removeAttribute('tabindex');
        };
        /**
         * A11y - Make focusable elements tabbable
         * @param {boolean} val // make tabbable or not...
         * @private
         */
        Foldable.prototype.makeTabbable = function (val) {
            var focusables = this._target !== null ? findFocusableElements(this._target) : [];
            for (var i = 0; i < focusables.length; i++) {
                focusables[i].setAttribute('tabindex', val ? '0' : '-1');
            }
        };
        Foldable.prototype.setClasses = function () {
            var _this = this;
            switch (this._status) {
                case FoldableStatus.Busy:
                    this._triggers.forEach(function (trigger) {
                        trigger.classList.add(_this._options.classes.busyClass);
                    });
                    break;
                case FoldableStatus.Close:
                    this._triggers.forEach(function (trigger) {
                        trigger.classList.remove(_this._options.classes.busyClass);
                        trigger.classList.remove(_this._options.classes.openedClass);
                        trigger.classList.add(_this._options.classes.closedClass);
                    });
                    break;
                case FoldableStatus.Open:
                    this._triggers.forEach(function (trigger) {
                        trigger.classList.remove(_this._options.classes.busyClass);
                        trigger.classList.remove(_this._options.classes.closedClass);
                        trigger.classList.add(_this._options.classes.openedClass);
                    });
                    break;
            }
        };
        /**
         * Click outside to reverse the foldable status
         * @param {HTMLElement} target
         * @private
         */
        Foldable.prototype.clickOutsideHandler = function (target) {
            return __awaiter(this, void 0, void 0, function () {
                var ancestor;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(target !== null && !this.isFoldableElement(target) && this._status !== this._options.statusByDefault)) return [3 /*break*/, 2];
                            ancestor = target.parentElement;
                            while (ancestor !== null && !this.isFoldableElement(ancestor)) {
                                ancestor = ancestor.parentElement;
                            }
                            if (!!this.isFoldableElement(ancestor)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.toggle()];
                        case 1:
                            _a.sent();
                            // Remove the event
                            (function () {
                                document.documentElement.removeEventListener('click', _this._clickOutside);
                            })();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Add events
         * @private
         */
        Foldable.prototype.addTriggersEvents = function () {
            var _this = this;
            var _a;
            this._triggers.forEach(function (trigger) {
                trigger.addEventListener(_this._options.eventType, _this._handler);
            });
            // Escape keyup listener works only when the target is visible.
            // In case of statusByDefault is set to FoldableStatus.Opened this listener is useless
            // So it will use only when the statusByDefault is set to FoldableStatus.Closed
            if (this._options.statusByDefault === FoldableStatus.Close) {
                (_a = this._target) === null || _a === void 0 ? void 0 : _a.addEventListener('keyup', this._keyboardHandler);
                this._escapeHandlerAdded = true;
            }
            this._eventListenersAdded = true;
        };
        /**
         * Remove events
         * @private
         */
        Foldable.prototype.removeTriggersEvents = function () {
            var _this = this;
            var _a;
            this._triggers.forEach(function (trigger) {
                trigger.removeEventListener(_this._options.eventType, _this._handler);
            });
            if (this._escapeHandlerAdded) {
                (_a = this._target) === null || _a === void 0 ? void 0 : _a.removeEventListener('keyup', this._keyboardHandler);
            }
            this._eventListenersAdded = false;
        };
        Foldable.prototype.isInBreakpointArea = function () {
            var min = this._options.breakpoints.min;
            var max = this._options.breakpoints.max;
            var wWidth = window.innerWidth;
            return min === null && max === null ||
                min !== null && max === null && wWidth >= min ||
                min === null && max !== null && wWidth <= max ||
                min !== null && max !== null && wWidth >= min && wWidth <= max;
        };
        /**
         * Check if the element is present into triggers or target
         * @param {HTMLElement} element
         * @private
         */
        Foldable.prototype.isFoldableElement = function (element) {
            if (element === null)
                return false;
            return this._triggers.indexOf(element) !== -1 || element === this._target;
        };
        Foldable.prototype.findOriginalTrigger = function (target) {
            return undefined;
        };
        /**
         * Transform value to HTMLElement[]
         * @private
         */
        Foldable.parseTriggersOptionsToArray = function (value) {
            if (is.str(value))
                return [].slice.call(document.querySelectorAll(value));
            if (is.node(value))
                return [value];
            if (is.nodeList(value))
                return [].slice.call(value);
            if (is.array(value))
                return __spreadArrays(value);
            return [];
        };
        Foldable.defaults = {
            triggers: [],
            target: '',
            breakpoints: {
                min: null,
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
            open: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); },
            close: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); },
        };
        return Foldable;
    }());

    exports.Foldable = Foldable;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
