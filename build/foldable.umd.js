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

    (function (FoldableState) {
        FoldableState[FoldableState["Close"] = 0] = "Close";
        FoldableState[FoldableState["Open"] = 1] = "Open";
        FoldableState[FoldableState["Busy"] = 2] = "Busy";
    })(exports.FoldableState || (exports.FoldableState = {}));

    var is = {
        str: function (v) { return typeof v === 'string'; },
        node: function (v) {
            var vNode = v;
            return !!vNode.nodeType;
        },
        nodeList: function (v) {
            return v instanceof NodeList;
        },
        array: function (v) {
            return Array.isArray(v);
        },
    };

    var Foldable = /** @class */ (function () {
        function Foldable(options) {
            var _this = this;
            this._targets = [];
            var defaults = Foldable.getDefaults();
            this._options = Object.assign({}, defaults, options);
            this._state = this._options.stateByDefault;
            this._triggers = Foldable.parseToHtmlElementArray(this._options.triggers);
            this._targets = Foldable.parseToHtmlElementArray(this._options.targets);
            this._handler = function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.preventDefault();
                            return [4 /*yield*/, this.eventHandler()];
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
            this.subscribeTriggers();
        }
        Object.defineProperty(Foldable.prototype, "state", {
            get: function () {
                return this._state;
            },
            set: function (newState) {
                this._state = newState;
                this.setClassOnTriggers();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Foldable.prototype, "stateName", {
            get: function () {
                return exports.FoldableState[this._state];
            },
            enumerable: false,
            configurable: true
        });
        Foldable.prototype.open = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this._state !== exports.FoldableState.Busy)) return [3 /*break*/, 2];
                            this.state = exports.FoldableState.Busy;
                            return [4 /*yield*/, this._options.open.call(this, [
                                    this._triggers,
                                    this._targets
                                ])];
                        case 1:
                            result = _a.sent();
                            this.state = exports.FoldableState.Open;
                            if (this._options.clickOutsideToResetState) {
                                // Return to config.stateByDefault if the current state is not the state by default.
                                document.documentElement.addEventListener('click', this._clickOutside);
                            }
                            return [2 /*return*/, result];
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        Foldable.prototype.close = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this._state !== exports.FoldableState.Busy)) return [3 /*break*/, 2];
                            this.state = exports.FoldableState.Busy;
                            return [4 /*yield*/, this._options.close.call(this, [
                                    this._triggers,
                                    this._targets
                                ])];
                        case 1:
                            result = _a.sent();
                            this.state = exports.FoldableState.Close;
                            if (this._options.clickOutsideToResetState) {
                                // Return to config.stateByDefault if the current state is not the state by default.
                                document.documentElement.addEventListener('click', this._clickOutside);
                            }
                            return [2 /*return*/, result];
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        Foldable.prototype.enable = function () {
            // subscribe events
            this.subscribeTriggers();
        };
        Foldable.prototype.disable = function () {
            // unscubscribe events
            this.unsubscribeTriggers();
        };
        Foldable.prototype.eventHandler = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this._state === exports.FoldableState.Busy)
                                return [2 /*return*/];
                            _a = this._state;
                            switch (_a) {
                                case exports.FoldableState.Open: return [3 /*break*/, 1];
                                case exports.FoldableState.Close: return [3 /*break*/, 3];
                            }
                            return [3 /*break*/, 5];
                        case 1: 
                        // Close
                        return [4 /*yield*/, this.close()];
                        case 2:
                            // Close
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 3: 
                        // Open
                        return [4 /*yield*/, this.open()];
                        case 4:
                            // Open
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        Foldable.prototype.clickOutsideHandler = function (target) {
            return __awaiter(this, void 0, void 0, function () {
                var ancestor;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(target !== null && !this.isFoldableElement(target) && this._state !== this._options.stateByDefault)) return [3 /*break*/, 2];
                            ancestor = target.parentElement;
                            while (ancestor !== null && !this.isFoldableElement(ancestor)) {
                                ancestor = ancestor.parentElement;
                            }
                            if (!!this.isFoldableElement(ancestor)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.eventHandler()];
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
        Foldable.prototype.subscribeTriggers = function () {
            var _this = this;
            this._triggers.forEach(function (trigger) {
                trigger.addEventListener(_this._options.eventType, _this._handler);
            });
        };
        /***
         * Remove events
         * @private
         */
        Foldable.prototype.unsubscribeTriggers = function () {
            var _this = this;
            this._triggers.forEach(function (trigger) {
                trigger.removeEventListener(_this._options.eventType, _this._handler);
            });
        };
        Foldable.prototype.setClassOnTriggers = function () {
            var _this = this;
            switch (this._state) {
                case exports.FoldableState.Busy:
                    this._triggers.forEach(function (trigger) {
                        trigger.classList.add(_this._options.classes.busyClass);
                    });
                    break;
                case exports.FoldableState.Close:
                    this._triggers.forEach(function (trigger) {
                        trigger.classList.remove(_this._options.classes.busyClass);
                        trigger.classList.remove(_this._options.classes.openClass);
                        trigger.classList.add(_this._options.classes.closeClass);
                    });
                    break;
                case exports.FoldableState.Open:
                    this._triggers.forEach(function (trigger) {
                        trigger.classList.remove(_this._options.classes.busyClass);
                        trigger.classList.remove(_this._options.classes.closeClass);
                        trigger.classList.add(_this._options.classes.openClass);
                    });
                    break;
            }
        };
        /**
         * Check if the element is present into triggers or targets
         * @param {HTMLElement} element
         * @private
         */
        Foldable.prototype.isFoldableElement = function (element) {
            if (element === null)
                return false;
            return this._triggers.indexOf(element) !== -1 || this._targets.indexOf(element) !== -1;
        };
        /**
         * Transform value to HTMLElement[]
         * @private
         */
        Foldable.parseToHtmlElementArray = function (value) {
            if (is.str(value)) {
                return [].slice.call(document.querySelectorAll(value));
            }
            if (is.node(value)) {
                return [value];
            }
            if (is.nodeList(value)) {
                return [].slice.call(value);
            }
            if (is.array(value)) {
                return __spreadArrays(value);
            }
            return [];
        };
        /**
         * Return options by default
         * @private
         */
        Foldable.getDefaults = function () {
            var _this = this;
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
                stateByDefault: exports.FoldableState.Close,
                clickOutsideToResetState: true,
                open: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); },
                close: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); },
            };
        };
        return Foldable;
    }());
    window.Foldable = Foldable;
    window.FoldableState = exports.FoldableState;

    exports.Foldable = Foldable;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
