import {
  MatRipple
} from "./chunk-ELORD2Q2.js";
import {
  MatCommonModule
} from "./chunk-BM4AN22M.js";
import {
  NgModule,
  setClassMetadata,
  ɵɵdefineNgModule
} from "./chunk-3XKZCJEH.js";
import {
  ɵɵdefineInjector
} from "./chunk-NQJLCYP6.js";

// node_modules/@angular/material/fesm2022/ripple-module.mjs
var MatRippleModule = class _MatRippleModule {
  static ɵfac = function MatRippleModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRippleModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatRippleModule,
    imports: [MatCommonModule, MatRipple],
    exports: [MatRipple, MatCommonModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [MatCommonModule, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRippleModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, MatRipple],
      exports: [MatRipple, MatCommonModule]
    }]
  }], null, null);
})();

export {
  MatRippleModule
};
//# sourceMappingURL=chunk-LBD3M3FQ.js.map
