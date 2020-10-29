(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Foldable = {}));
}(this, (function (exports) { 'use strict';

  (function (FoldableState) {
      FoldableState[FoldableState["Close"] = 0] = "Close";
      FoldableState[FoldableState["Open"] = 1] = "Open";
      FoldableState[FoldableState["Animating"] = 2] = "Animating";
  })(exports.FoldableState || (exports.FoldableState = {}));
  var Foldable = /** @class */ (function () {
      function Foldable(options) {
          var _this_1 = this;
          var defaults = Foldable.getDefaults();
          this.config = Object.assign({}, defaults, options);
          try {
              this.checkEventType();
          }
          catch (err) {
              console.error(err);
          }
          this._triggers = [].slice.call(document.querySelectorAll(this.config.triggers));
          this._targets = [].slice.call(document.querySelectorAll(this.config.targets));
          this.state = this.config.stateByDefault;
          this._eventHandler = function (e) {
              e.preventDefault();
              _this_1.toggle(e);
          };
          this.manageEventsOnTriggers();
          window.addEventListener('resize', this.debounce(function () {
              _this_1.manageEventsOnTriggers();
          }, 100));
      }
      Object.defineProperty(Foldable.prototype, "stateName", {
          get: function () {
              return exports.FoldableState[this.state];
          },
          enumerable: false,
          configurable: true
      });
      /**
       *
       * @param {FoldableState} state
       */
      Foldable.prototype.setState = function (state) {
          this.state = state;
      };
      Foldable.prototype.hardReset = function () {
          if (this.state !== this.config.stateByDefault) {
              switch (this.state) {
                  case exports.FoldableState.Open:
                      this.close();
                      break;
                  case exports.FoldableState.Close:
                      this.open();
                      break;
              }
          }
      };
      Foldable.prototype.open = function (e) {
          var _this_1 = this;
          if (this.config.open !== undefined && typeof this.config.open === 'function') {
              this.state = exports.FoldableState.Animating;
              Foldable.executeCallback(this.config.open, this, {
                  event: e,
                  triggers: this._triggers,
                  targets: this._targets,
                  done: function () {
                      _this_1.setState(exports.FoldableState.Open);
                  },
              });
          }
      };
      Foldable.prototype.close = function (e) {
          var _this_1 = this;
          if (this.config.close !== undefined && typeof this.config.close === 'function') {
              this.state = exports.FoldableState.Animating;
              Foldable.executeCallback(this.config.close, this, {
                  event: e,
                  triggers: this._triggers,
                  targets: this._targets,
                  done: function () {
                      _this_1.setState(exports.FoldableState.Close);
                  },
              });
          }
      };
      Foldable.prototype.toggle = function (e) {
          switch (this.state) {
              case exports.FoldableState.Open:
                  this.close(e);
                  break;
              case exports.FoldableState.Close:
                  this.open(e);
                  break;
          }
          var _this = this;
          function handler(e) {
              var target = e.target;
              if (target !== null) {
                  var isOutsideFoldableElements = [_this.config.triggers, _this.config.targets].filter(function (s) { return target.closest(s); }).length > 0;
                  if (!isOutsideFoldableElements && _this.state !== _this.config.stateByDefault) {
                      _this.toggle();
                      // Remove the event
                      return (function () {
                          document.documentElement.removeEventListener('click', handler);
                      })();
                  }
              }
          }
          // Close userNav Foldable when user click outside
          if (this.config.clickOutsideToResetState) {
              document.documentElement.addEventListener('click', handler);
          }
      };
      Foldable.prototype.checkEventType = function () {
          if (this.config.eventType !== 'click' && this.config.eventType !== 'change') {
              throw "Events types allowed are click and change. Your config.eventType = '" + this.config.eventType + "'";
          }
      };
      Foldable.prototype.subscribeTriggers = function () {
          var _this_1 = this;
          this._triggers.forEach(function (trigger) {
              // Add events to each trigger
              trigger.addEventListener(_this_1.config.eventType, _this_1._eventHandler);
          });
      };
      Foldable.prototype.unsubscribeTriggers = function () {
          var _this_1 = this;
          var _a, _b;
          if ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.breakpoint) === null || _b === void 0 ? void 0 : _b.reset) {
              console.log('RESET');
              this.hardReset();
          }
          this._triggers.forEach(function (trigger) {
              // Add events to each trigger
              trigger.removeEventListener(_this_1.config.eventType, _this_1._eventHandler);
          });
      };
      Foldable.prototype.manageEventsOnTriggers = function () {
          var _a, _b;
          if (this.config.breakpoint === null) {
              this.subscribeTriggers();
              return;
          }
          var wWidth = window.innerWidth;
          // subscribeTriggers or unsubscribeTriggers depending on breakpoint
          if (wWidth > ((_a = this.config.breakpoint) === null || _a === void 0 ? void 0 : _a.min) && wWidth < ((_b = this.config.breakpoint) === null || _b === void 0 ? void 0 : _b.max)) {
              this.subscribeTriggers();
          }
          else {
              this.unsubscribeTriggers();
          }
      };
      /**
       * Execute callback after the delay
       * @param {Function} callback
       * @param {Number} delay
       * @returns {Function}
       * @private
       */
      Foldable.prototype.debounce = function (callback, delay) {
          var timer;
          var _this = this;
          return function () {
              var args = arguments;
              var context = _this;
              clearTimeout(timer);
              timer = window.setTimeout(function () {
                  callback.apply(context, args);
              }, delay);
          };
      };
      /**
       * Call call callback
       * @param {function} fn
       * @param {Foldable} ctx
       * @param {} args
       */
      Foldable.executeCallback = function (fn, ctx, args) {
          (function () {
              // @ts-ignore
              fn.call(ctx, args);
          })();
      };
      Foldable.getDefaults = function () {
          return {
              triggers: 'foldable-trigger',
              targets: 'foldable-target',
              activeClass: 'active',
              eventType: 'click',
              stateByDefault: exports.FoldableState.Close,
              clickOutsideToResetState: true,
              breakpoint: null,
              open: undefined,
              close: undefined,
          };
      };
      return Foldable;
  }());
  window.Foldable = Foldable;
  window.FoldableState = exports.FoldableState;

  exports.Foldable = Foldable;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
