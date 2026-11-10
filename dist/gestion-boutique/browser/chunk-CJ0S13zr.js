import{a as Qt,c as Zt,d as qt,f as tn,i as Kt,l as en,n as Gt,o as Wt,p as un,r as Jt,s as Yt,t as $t,u as fn}from"./chunk-D8a5vavW.js";import{n as _,t as I}from"./chunk-DqtD4cjg.js";import{t as d}from"./chunk-BopogVBY.js";import{C as ln,Et as g$1,G as st$1,K as Vt,L as et$1,St as U,U as G,W as mt$1,_ as S,b as Yn$1,bt as N,f as C,g as Ln$1,h as Je,i as Z,k as ve,p as Hn$1,q as _t$1,r as J$1,u as Bn$1,v as Wn$1,w as mn,y as Wt$1,z as g}from"./main-RHRV5L36.js";import{r as qt$1,t as Ht}from"./chunk-D44m0xVB.js";import{a as je,c as ze,i as Ve,o as tt$1,s as w,t as $t$1}from"./chunk-Du8walHl.js";import{a as Qi,c as _e,f as ye,i as Pt,l as bt$1,n as Ne,r as Ot,s as Xi,u as ot$1}from"./chunk-_GEzkmx0.js";import{T as re,d as Rs,n as Ds,r as Ee}from"./chunk-Drbq3HVB.js";import{a as ie,n as at$1,o as lt$1,s as oe}from"./chunk-DFHbGO0e.js";import"./chunk-DHM4SRhF.js";import{s as Jr}from"./chunk-B4tPdyDy.js";import{$t as Wc,Br as wD,Ct as QE,Dr as sh,Er as se,Et as Qp,F as Fh,Fr as v0,Ft as S$1,Gt as Um,Hn as hh,Ht as Tu,Ir as ve$1,K as ID,Kr as y0,M as FD,Mn as eD,N as Fe,Nn as eh,O as ED,Qn as kI,Qr as zD,R as Fu,Rr as vw,Tr as sD,U as Hc,Vn as hD,Vr as wE,W as Ho,Wt as Uc,Yr as yi,Zn as ju,_ as Cu,an as YE,br as qc,cr as mD,en as Wv,et as KE,f as CE,fn as _$1,fr as nh,g as Cr,jn as dw,kt as RI,m as Ch,nn as XE,or as lw,q as Io,qr as yD,qt as Up,rn as Xl,sn as Yp,st as Me,tn as XD,un as Zp,vr as ph,wr as rw,xn as bh,zn as g0}from"./chunk-97p5mxa8.js";var J={color:`accent`,clickAction:`check-indeterminate`,disabledInteractive:!1};var zn=new S$1(`mat-checkbox-default-options`,{providedIn:`root`,factory:()=>J});var k=(function(n){return n[n.Init=0]=`Init`,n[n.Checked=1]=`Checked`,n[n.Unchecked=2]=`Unchecked`,n[n.Indeterminate=3]=`Indeterminate`,n})(k||{});var Y=class{source;checked};var ee=(()=>{class n{_elementRef=_$1(Cr);_changeDetectorRef=_$1(g0);_ngZone=_$1(Me);_animationsDisabled=re();_options=_$1(zn,{optional:!0});_injector=_$1(se);_signalFormField=null;focus(){this._inputElement.nativeElement.focus()}_createChangeEvent(e){let i=new Y;return i.source=this,i.checked=e,i}_getAnimationTargetElement(){return this._inputElement?.nativeElement}_animationClasses={uncheckedToChecked:`mdc-checkbox--anim-unchecked-checked`,uncheckedToIndeterminate:`mdc-checkbox--anim-unchecked-indeterminate`,checkedToUnchecked:`mdc-checkbox--anim-checked-unchecked`,checkedToIndeterminate:`mdc-checkbox--anim-checked-indeterminate`,indeterminateToChecked:`mdc-checkbox--anim-indeterminate-checked`,indeterminateToUnchecked:`mdc-checkbox--anim-indeterminate-unchecked`};ariaLabel=``;ariaLabelledby=null;ariaDescribedby;ariaExpanded;ariaControls;ariaOwns;_uniqueId;id;get inputId(){return`${this.id||this._uniqueId}-input`}required=!1;labelPosition=`after`;name=null;change=new Fe;indeterminateChange=new Fe;value;disableRipple=!1;_inputElement;tabIndex;color;disabledInteractive;_onTouched=()=>{};_currentAnimationClass=``;_currentCheckState=k.Init;_controlValueAccessorChangeFn=()=>{};_validatorChangeFn=()=>{};constructor(){_$1(lt$1).load(Rs);let e=_$1(new Fh(`tabindex`),{optional:!0});this._options=this._options||J,this.color=this._options.color||J.color,this.tabIndex=e==null?0:parseInt(e)||0,this.id=this._uniqueId=_$1(Ee).getId(`mat-mdc-checkbox-`),this.disabledInteractive=this._options?.disabledInteractive??!1}ngOnChanges(e){e.required&&this._validatorChangeFn()}ngOnInit(){this._signalFormField=this._injector.get(ot$1,void 0,{optional:!0,self:!0})}ngAfterViewInit(){this._syncIndeterminate(this.indeterminate)}get checked(){return this._checked}set checked(e){e!=this.checked&&(this._checked=e,this._changeDetectorRef.markForCheck())}_checked=!1;get disabled(){return this._disabled}set disabled(e){e!==this.disabled&&(this._disabled=e,this._changeDetectorRef.markForCheck())}_disabled=!1;get indeterminate(){return this._indeterminate()}set indeterminate(e){let i=e!=this._indeterminate();this._indeterminate.set(e),i&&(e?this._transitionCheckState(k.Indeterminate):this._transitionCheckState(this.checked?k.Checked:k.Unchecked),this.indeterminateChange.emit(e)),this._syncIndeterminate(e)}_indeterminate=Ho(!1);_isRippleDisabled(){return this.disableRipple||this.disabled}_onLabelTextChange(){this._changeDetectorRef.detectChanges()}writeValue(e){this.checked=!!e}registerOnChange(e){this._controlValueAccessorChangeFn=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e}validate(e){return this.required&&e.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(e){this._validatorChangeFn=e}_transitionCheckState(e){let i=this._currentCheckState,a=this._getAnimationTargetElement();if(!(i===e||!a)&&(this._currentAnimationClass&&a.classList.remove(this._currentAnimationClass),this._currentAnimationClass=this._getAnimationClassForCheckStateTransition(i,e),this._currentCheckState=e,this._currentAnimationClass.length>0)){a.classList.add(this._currentAnimationClass);let l=this._currentAnimationClass;this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{a.classList.remove(l)},1e3)})}}_emitChangeEvent(){this._controlValueAccessorChangeFn(this.checked),this.change.emit(this._createChangeEvent(this.checked)),this._inputElement&&(this._inputElement.nativeElement.checked=this.checked)}toggle(){this.checked=!this.checked,this._controlValueAccessorChangeFn(this.checked)}_handleInputClick(){let e=this._options?.clickAction;!this.disabled&&e!==`noop`?(this.indeterminate&&e!==`check`&&Promise.resolve().then(()=>{this._indeterminate.set(!1),this.indeterminateChange.emit(!1)}),this._checked=!this._checked,this._transitionCheckState(this._checked?k.Checked:k.Unchecked),this._emitChangeEvent()):(this.disabled&&this.disabledInteractive||!this.disabled&&e===`noop`)&&(this._inputElement.nativeElement.checked=this.checked,this._inputElement.nativeElement.indeterminate=this.indeterminate)}_onInteractionEvent(e){e.stopPropagation()}_onBlur(){Promise.resolve().then(()=>{this._onTouched(),this._changeDetectorRef.markForCheck()})}_getAnimationClassForCheckStateTransition(e,i){if(this._animationsDisabled)return``;switch(e){case k.Init:if(i===k.Checked)return this._animationClasses.uncheckedToChecked;if(i==k.Indeterminate)return this._checked?this._animationClasses.checkedToIndeterminate:this._animationClasses.uncheckedToIndeterminate;break;case k.Unchecked:return i===k.Checked?this._animationClasses.uncheckedToChecked:this._animationClasses.uncheckedToIndeterminate;case k.Checked:return i===k.Unchecked?this._animationClasses.checkedToUnchecked:this._animationClasses.checkedToIndeterminate;case k.Indeterminate:return i===k.Checked?this._animationClasses.indeterminateToChecked:this._animationClasses.indeterminateToUnchecked}return``}_syncIndeterminate(e){let i=this._inputElement;i&&(i.nativeElement.indeterminate=e)}_onInputClick(){this._handleInputClick()}_preventBubblingFromLabel(e){e.target&&this._inputElement&&e.target!==this._inputElement.nativeElement&&e.stopPropagation()}static ɵfac=function(i){return new(i||n)};static ɵcmp=(function(){let e=[`input`];return wE({type:n,selectors:[[`mat-checkbox`]],viewQuery:function(l,r){if(l&1&&sh(e,5),l&2){let g;ID(g=ED())&&(r._inputElement=g.first)}},hostAttrs:[1,`mat-mdc-checkbox`],hostVars:16,hostBindings:function(l,r){l&2&&(eh(`id`,r.id),Qp(`tabindex`,null)(`aria-label`,null)(`aria-labelledby`,null),FD(r.color?`mat-`+r.color:`mat-accent`),hh(`_mat-animation-noopable`,r._animationsDisabled)(`mdc-checkbox--disabled`,r.disabled)(`mat-mdc-checkbox-disabled`,r.disabled)(`mat-mdc-checkbox-checked`,r.checked)(`mat-mdc-checkbox-disabled-interactive`,r.disabledInteractive))},inputs:{ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],ariaExpanded:[2,`aria-expanded`,`ariaExpanded`,y0],ariaControls:[0,`aria-controls`,`ariaControls`],ariaOwns:[0,`aria-owns`,`ariaOwns`],id:`id`,required:[2,`required`,`required`,y0],labelPosition:`labelPosition`,name:`name`,value:`value`,disableRipple:[2,`disableRipple`,`disableRipple`,y0],tabIndex:[2,`tabIndex`,`tabIndex`,a=>a==null?void 0:v0(a)],color:`color`,disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,y0],checked:[2,`checked`,`checked`,y0],disabled:[2,`disabled`,`disabled`,y0],indeterminate:[2,`indeterminate`,`indeterminate`,y0]},outputs:{change:`change`,indeterminateChange:`indeterminateChange`},exportAs:[`matCheckbox`],features:[rw([{provide:S,useExisting:Io(()=>n),multi:!0},{provide:C,useExisting:n,multi:!0}]),Um],ngContentSelectors:[`*`],decls:15,vars:23,consts:[[`checkbox`,``],[`input`,``],[`label`,``],[`mat-internal-form-field`,``,3,`click`,`labelPosition`,`for`],[1,`mdc-checkbox`],[`aria-hidden`,`true`,1,`mat-mdc-checkbox-touch-target`],[`type`,`checkbox`,1,`mdc-checkbox__native-control`,3,`blur`,`click`,`change`,`checked`,`indeterminate`,`disabled`,`id`,`required`,`tabIndex`],[`aria-hidden`,`true`,1,`mdc-checkbox__ripple`],[`aria-hidden`,`true`,1,`mdc-checkbox__background`],[`focusable`,`false`,`viewBox`,`0 0 24 24`,1,`mdc-checkbox__checkmark`],[`fill`,`none`,`d`,`M1.73,12.91 8.1,19.28 22.79,4.59`,1,`mdc-checkbox__checkmark-path`],[1,`mdc-checkbox__mixedmark`],[`mat-ripple`,``,`aria-hidden`,`true`,1,`mat-mdc-checkbox-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mat-internal-form-field-label`,`mdc-label`]],template:function(l,r){if(l&1&&(mD(),yi(0,`label`,3),nh(`click`,function(z){return r._preventBubblingFromLabel(z)}),yi(1,`span`,4,0),Yp(3,`span`,5),yi(4,`input`,6,1),nh(`blur`,function(){return r._onBlur()})(`click`,function(){return r._onInputClick()})(`change`,function(z){return r._onInteractionEvent(z)}),Hc(),Yp(6,`span`,7),yi(7,`span`,8),Fu(),yi(8,`svg`,9),Yp(9,`path`,10),Hc(),ju(),Yp(10,`span`,11),Hc(),Yp(11,`span`,12),Hc(),yi(12,`span`,13,2),yD(14),Hc()()),l&2){let g=wD(2);Zp(`labelPosition`,r.labelPosition)(`for`,r.inputId),Wv(4),hh(`mdc-checkbox--selected`,r.checked),Zp(`checked`,r.checked)(`indeterminate`,r.indeterminate)(`disabled`,r.disabled&&!r.disabledInteractive)(`id`,r.inputId)(`required`,r.required)(`tabIndex`,r.disabled&&!r.disabledInteractive?-1:r.tabIndex),Qp(`aria-label`,r.ariaLabel||null)(`aria-labelledby`,r.ariaLabelledby)(`aria-describedby`,r.ariaDescribedby)(`aria-checked`,r.indeterminate?`mixed`:null)(`aria-controls`,r.ariaControls)(`aria-disabled`,r.disabled&&r.disabledInteractive?!0:null)(`aria-expanded`,r.ariaExpanded)(`aria-owns`,r.ariaOwns)(`name`,r.name)(`value`,r.value),Wv(7),Zp(`matRippleTrigger`,g)(`matRippleDisabled`,r.disableRipple||r.disabled)(`matRippleCentered`,!0)}},dependencies:[Ds,g],styles:[`.mdc-checkbox {
  display: inline-block;
  position: relative;
  flex: 0 0 18px;
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  line-height: 0;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: bottom;
  padding: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  margin: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
}
.mdc-checkbox:hover > .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:hover > .mat-mdc-checkbox-ripple > .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control {
  position: absolute;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: inherit;
  z-index: 1;
  width: var(--%NS%mat-checkbox-state-layer-size, 40px);
  height: var(--%NS%mat-checkbox-state-layer-size, 40px);
  top: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
  right: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
  left: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
}

.mdc-checkbox--disabled {
  cursor: default;
  pointer-events: none;
}

.mdc-checkbox__background {
  display: inline-flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-radius: 2px;
  background-color: transparent;
  pointer-events: none;
  will-change: background-color, border-color;
  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  border-color: var(--%NS%mat-checkbox-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));
  top: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  left: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
}

.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox--disabled .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--%NS%mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}
@media (forced-colors: active) {
  .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
  .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-unselected-hover-icon-color, var(--%NS%mat-sys-on-surface));
  background-color: transparent;
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-hover-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-hover-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-unselected-focus-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-focus-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-focus-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
    border-color: GrayText;
  }
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--%NS%mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}

.mdc-checkbox__checkmark {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);
  color: var(--%NS%mat-checkbox-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__checkmark {
    color: CanvasText;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
  color: var(--%NS%mat-checkbox-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
    color: GrayText;
  }
}

.mdc-checkbox__checkmark-path {
  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);
  stroke: currentColor;
  stroke-width: 3.12px;
  stroke-dashoffset: 29.7833385;
  stroke-dasharray: 29.7833385;
}

.mdc-checkbox__mixedmark {
  width: 100%;
  height: 0;
  transform: scaleX(0) rotate(0deg);
  border-width: 1px;
  border-style: solid;
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
  border-color: var(--%NS%mat-checkbox-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__mixedmark {
    margin: 0 1px;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
  border-color: var(--%NS%mat-checkbox-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
    border-color: GrayText;
  }
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,
.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,
.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,
.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {
  animation-duration: 180ms;
  animation-timing-function: linear;
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;
  transition: none;
}

.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {
  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;
  transition: none;
}
.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {
  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;
  transition: none;
}
.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;
  transition: none;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {
  stroke-dashoffset: 0;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);
  opacity: 1;
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(-45deg);
}

.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(0deg);
  opacity: 1;
}

@keyframes mdc-checkbox-unchecked-checked-checkmark-path {
  0%, 50% {
    stroke-dashoffset: 29.7833385;
  }
  50% {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
  0%, 68.2% {
    transform: scaleX(0);
  }
  68.2% {
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes mdc-checkbox-checked-unchecked-checkmark-path {
  from {
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    opacity: 1;
    stroke-dashoffset: 0;
  }
  to {
    opacity: 0;
    stroke-dashoffset: -29.7833385;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-checkmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(45deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-checkmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(45deg);
    opacity: 0;
  }
  to {
    transform: rotate(360deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: rotate(0deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(315deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
  0% {
    animation-timing-function: linear;
    transform: scaleX(1);
    opacity: 1;
  }
  32.8%, 100% {
    transform: scaleX(0);
    opacity: 0;
  }
}
.mat-mdc-checkbox {
  display: inline-block;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-touch-target,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__native-control,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__ripple,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-checkbox label {
  cursor: pointer;
}
.mat-mdc-checkbox .mat-internal-form-field {
  color: var(--%NS%mat-checkbox-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-checkbox-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-checkbox-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-checkbox-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-checkbox-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-checkbox-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive input {
  cursor: default;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled label {
  cursor: default;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled .mat-internal-form-field-label {
  color: var(--%NS%mat-checkbox-disabled-label-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mat-mdc-checkbox.mat-mdc-checkbox-disabled .mat-internal-form-field-label {
    color: GrayText;
  }
}
.mat-mdc-checkbox .mat-internal-form-field-label:empty {
  display: none;
}
.mat-mdc-checkbox .mdc-checkbox__ripple {
  opacity: 0;
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple,
.mdc-checkbox__ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-checkbox .mat-mdc-checkbox-ripple:not(:empty),
.mdc-checkbox__ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-mdc-checkbox-ripple .mat-ripple-element {
  opacity: 0.1;
}

.mat-mdc-checkbox-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-checkbox-touch-target-size, 48px);
  width: var(--%NS%mat-checkbox-touch-target-size, 48px);
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-checkbox-touch-target-display, block);
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple::before {
  border-radius: 50%;
}

.mdc-checkbox__native-control:focus-visible ~ .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})})()}return n})();var On=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=CE({type:n});static ɵinj=Xl({imports:[ee,at$1]})}return n})();var Ln=(n,m)=>m.value;var Vn=(n,m)=>m.id;function qn(n,m){n&1&&(yi(0,`mat-error`),zD(1,`Titre requis (max 200 caractères)`),Hc())}function Bn(n,m){n&1&&(yi(0,`mat-error`),zD(1,`Contenu requis (max 2000 caractères)`),Hc())}function Gn(n,m){if(n&1&&(yi(0,`mat-option`,13),zD(1),Hc()),n&2){let e=m.$implicit;Zp(`value`,e.value),Wv(),bh(e.label)}}function jn(n,m){n&1&&(yi(0,`mat-option`,20),Yp(1,`mat-spinner`,26),zD(2,` Chargement… `),Hc())}function $n(n,m){n&1&&(yi(0,`mat-option`,20),zD(1,`Aucune boutique trouvée`),Hc())}function Un(n,m){if(n&1&&(yi(0,`mat-option`,13),zD(1),Hc()),n&2){let e=m.$implicit;Zp(`value`,e.id),Wv(),bh(e.name)}}function Xn(n,m){if(n&1&&XE(0,Un,2,2,`mat-option`,13,Vn),n&2){let e=hD();eD(e.filteredShops())}}var Tn=(()=>{class n{constructor(){this.data=_$1($t$1),this.dialogRef=_$1(w),this.fb=_$1(Wn$1),this.adminService=_$1(d),this.shops=Ho([]),this.shopsLoading=Ho(!1),this.shopSearch=Ho(``),this.filteredShops=vw(()=>{let e=this.shopSearch().toLowerCase().trim();return e?this.shops().filter(i=>i.name.toLowerCase().includes(e)):this.shops()}),this.typeOptions=[{value:`info`,label:`ℹ️ Information`},{value:`success`,label:`✅ Succès`},{value:`warning`,label:`⚠️ Avertissement`},{value:`urgent`,label:`🚨 Urgent`}]}ngOnInit(){let e=this.data.announcement;this.form=this.fb.group({title:[e?.title??``,[ve.required,ve.maxLength(200)]],content:[e?.content??``,[ve.required,ve.maxLength(2e3)]],type:[e?.type??`info`],active:[e?.active??!0],expireAt:[e?.expireAt?e.expireAt.substring(0,10):``],targetShops:[e?.targetShops??[]]}),this.shopsLoading.set(!0),this.adminService.getShops({limit:100}).subscribe({next:i=>{this.shops.set(i.shops),this.shopsLoading.set(!1)},error:()=>this.shopsLoading.set(!1)})}iconFor(e){return{info:`info`,success:`check_circle`,warning:`warning`,urgent:`priority_high`}[e]??`info`}submit(){if(this.form.invalid)return;let{title:e,content:i,type:a,active:l,expireAt:r,targetShops:g}=this.form.value,z={title:e,content:i,type:a,active:l,expireAt:r||null,targetShops:g??[]};this.dialogRef.close(z)}cancel(){this.dialogRef.close(null)}static{this.ɵfac=function(i){return new(i||n)}}static{this.ɵcmp=wE({type:n,selectors:[[`app-admin-announcement-form-dialog`]],decls:61,vars:17,consts:[[1,`dlg-header`],[1,`dlg-header-icon`],[1,`dlg-title`],[1,`dlg-content`],[1,`ann-form`,3,`formGroup`],[`appearance`,`outline`,1,`full-width`],[`matInput`,``,`formControlName`,`title`,`placeholder`,`Titre de l'annonce`,`maxlength`,`200`],[`align`,`end`],[`matInput`,``,`formControlName`,`content`,`rows`,`4`,`placeholder`,`Message de l'annonce…`,`maxlength`,`2000`],[1,`row-fields`],[`appearance`,`outline`,1,`type-field`],[`matPrefix`,``],[`formControlName`,`type`],[3,`value`],[`appearance`,`outline`,1,`expire-field`],[`matInput`,``,`type`,`date`,`formControlName`,`expireAt`],[`formControlName`,`targetShops`,`multiple`,``,3,`openedChange`],[`disabled`,``,1,`shop-search-opt`],[1,`shop-search-icon`],[`type`,`text`,`placeholder`,`Rechercher une boutique…`,1,`shop-search-input`,3,`input`,`click`,`keydown`,`value`],[`disabled`,``],[1,`active-row`],[`formControlName`,`active`,`color`,`primary`],[`align`,`end`,1,`dlg-actions`],[`mat-button`,``,3,`click`],[`mat-flat-button`,``,`color`,`primary`,3,`click`,`disabled`],[`diameter`,`18`,2,`display`,`inline-block`,`margin-right`,`8px`]],template:function(i,a){if(i&1&&(yi(0,`div`,0)(1,`mat-icon`,1),zD(2),Hc(),yi(3,`h2`,2),zD(4),Hc()(),yi(5,`mat-dialog-content`,3)(6,`form`,4)(7,`mat-form-field`,5)(8,`mat-label`),zD(9,`Titre`),Hc(),yi(10,`input`,6),RI(),Hc(),yi(11,`mat-hint`,7),zD(12),Hc(),QE(13,qn,2,0,`mat-error`),Hc(),yi(14,`mat-form-field`,5)(15,`mat-label`),zD(16,`Contenu`),Hc(),yi(17,`textarea`,8),RI(),Hc(),yi(18,`mat-hint`,7),zD(19),Hc(),QE(20,Bn,2,0,`mat-error`),Hc(),yi(21,`div`,9)(22,`mat-form-field`,10)(23,`mat-label`),zD(24,`Type`),Hc(),yi(25,`mat-icon`,11),zD(26),Hc(),yi(27,`mat-select`,12),RI(),XE(28,Gn,2,2,`mat-option`,13,Ln),Hc()(),yi(30,`mat-form-field`,14)(31,`mat-label`),zD(32,`Expire le (optionnel)`),Hc(),yi(33,`mat-icon`,11),zD(34,`event`),Hc(),yi(35,`input`,15),RI(),Hc()()(),yi(36,`mat-form-field`,5)(37,`mat-label`),zD(38,`Boutiques ciblées (vide = annonce globale)`),Hc(),yi(39,`mat-icon`,11),zD(40,`storefront`),Hc(),yi(41,`mat-select`,16),RI(),nh(`openedChange`,function(r){return r?null:a.shopSearch.set(``)}),yi(42,`mat-option`,17)(43,`mat-icon`,18),zD(44,`search`),Hc(),yi(45,`input`,19),nh(`input`,function(r){return a.shopSearch.set(r.target.value)})(`click`,function(r){return r.stopPropagation()})(`keydown`,function(r){return r.stopPropagation()}),Hc()(),QE(46,jn,3,0,`mat-option`,20)(47,$n,2,0,`mat-option`,20)(48,Xn,2,0),Hc(),yi(49,`mat-hint`),zD(50,`Laisser vide = toutes les boutiques`),Hc()(),yi(51,`div`,21)(52,`mat-checkbox`,22),RI(),zD(53,` Annonce active (visible par les boutiques) `),Hc()()()(),yi(54,`mat-dialog-actions`,23)(55,`button`,24),nh(`click`,function(){return a.cancel()}),zD(56,`Annuler`),Hc(),yi(57,`button`,25),nh(`click`,function(){return a.submit()}),yi(58,`mat-icon`),zD(59),Hc(),zD(60),Hc()()),i&2){let l,r;Wv(),FD(`type-`+a.form.get(`type`)?.value),Wv(),qc(` `,a.iconFor((l=a.form.get(`type`))==null?null:l.value),` `),Wv(2),qc(` `,a.data.announcement?`Modifier l'annonce`:`Nouvelle annonce`,` `),Wv(2),Zp(`formGroup`,a.form),Wv(4),kI(),Wv(2),qc(``,a.form.get(`title`)?.value?.length??0,`/200`),Wv(),YE(a.form.get(`title`)?.invalid&&a.form.get(`title`)?.touched?13:-1),Wv(4),kI(),Wv(2),qc(``,a.form.get(`content`)?.value?.length??0,`/2000`),Wv(),YE(a.form.get(`content`)?.invalid&&a.form.get(`content`)?.touched?20:-1),Wv(5),FD(`type-icon type-`+a.form.get(`type`)?.value),Wv(),qc(` `,a.iconFor((r=a.form.get(`type`))==null?null:r.value),` `),Wv(),kI(),Wv(),eD(a.typeOptions),Wv(7),kI(),Wv(6),kI(),Wv(4),Zp(`value`,a.shopSearch()),Wv(),YE(a.shopsLoading()?46:a.filteredShops().length===0?47:48),Wv(6),kI(),Wv(5),Zp(`disabled`,a.form.invalid),Wv(2),bh(a.data.announcement?`save`:`add`),Wv(),qc(` `,a.data.announcement?`Sauvegarder`:`Créer`,` `)}},dependencies:[Yn$1,Hn$1,Je,Ln$1,Bn$1,Wt$1,ln,mn,Ve,ze,je,st$1,mt$1,Ne,bt$1,_e,ye,Ot,Pt,Xi,Qi,Ht,qt$1,et$1,On,ee,ie,oe,J$1,Z],styles:[`.dlg-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:20px 24px 0}.dlg-header-icon[_ngcontent-%COMP%]{font-size:26px;width:26px;height:26px}.dlg-title[_ngcontent-%COMP%]{margin:0;font-size:18px;font-weight:700}.dlg-content[_ngcontent-%COMP%]{padding:16px 24px!important}.ann-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px}.full-width[_ngcontent-%COMP%]{width:100%}.row-fields[_ngcontent-%COMP%]{display:flex;gap:12px;flex-wrap:wrap}.type-field[_ngcontent-%COMP%]{flex:1;min-width:150px}.expire-field[_ngcontent-%COMP%]{flex:1;min-width:180px}.active-row[_ngcontent-%COMP%]{padding:4px 0 8px}.dlg-actions[_ngcontent-%COMP%]{padding:8px 16px 16px!important;gap:8px}.shop-search-opt[_ngcontent-%COMP%]{position:sticky!important;top:0;z-index:10;background:#fff!important;border-bottom:1px solid #e5e7eb;cursor:default!important;pointer-events:all!important;height:44px!important;display:flex!important;align-items:center;padding:0 12px!important;gap:6px}.shop-search-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px;color:#9ca3af;flex-shrink:0}.shop-search-input[_ngcontent-%COMP%]{border:none;outline:none;background:transparent;font-size:14px;flex:1;color:#111827;font-family:inherit}.shop-search-input[_ngcontent-%COMP%]::placeholder{color:#9ca3af}.type-info[_ngcontent-%COMP%]{color:#3b82f6}.type-success[_ngcontent-%COMP%]{color:#22c55e}.type-warning[_ngcontent-%COMP%]{color:#f59e0b}.type-urgent[_ngcontent-%COMP%]{color:#ef4444}.type-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px}`],changeDetection:1})}}return n})();function Hn(n,m){if(n&1&&(yi(0,`span`,7),zD(1),Hc()),n&2){let e=hD();Wv(),Ch(``,e.total(),` annonce`,e.total()>1?`s`:``)}}function Zn(n,m){n&1&&Yp(0,`mat-progress-bar`,10)}function Qn(n,m){n&1&&(yi(0,`div`,15),Yp(1,`div`,16),yi(2,`div`,17),Yp(3,`div`,18)(4,`div`,19),Hc(),Yp(5,`div`,20)(6,`div`,21)(7,`div`,20),yi(8,`div`,22),Yp(9,`div`,23)(10,`div`,23)(11,`div`,23),Hc()())}function Kn(n,m){if(n&1&&(yi(0,`div`,11),XE(1,Qn,12,0,`div`,15,KE),Hc()),n&2){let e=hD();Wv(),eD(e.skeletonRows)}}function Wn(n,m){if(n&1){let e=sD();yi(0,`div`,12)(1,`div`,24)(2,`mat-icon`),zD(3,`cloud_off`),Hc()(),yi(4,`h3`),zD(5,`Erreur de chargement`),Hc(),yi(6,`p`),zD(7),Hc(),yi(8,`button`,25),nh(`click`,function(){Cu(e);let a=hD();return Tu(a.load())}),yi(9,`mat-icon`),zD(10,`refresh`),Hc(),zD(11,` Réessayer `),Hc()()}if(n&2){let e=hD();Wv(7),bh(e.error())}}function Jn(n,m){if(n&1){let e=sD();yi(0,`div`,13)(1,`div`,26)(2,`mat-icon`),zD(3,`campaign`),Hc()(),yi(4,`h3`),zD(5,`Aucune annonce`),Hc(),yi(6,`p`),zD(7,`Créez votre première annonce pour les boutiques.`),Hc(),yi(8,`button`,25),nh(`click`,function(){Cu(e);let a=hD();return Tu(a.openForm())}),yi(9,`mat-icon`),zD(10,`add`),Hc(),zD(11,` Créer une annonce `),Hc()()}}function Yn(n,m){n&1&&(yi(0,`th`,41),zD(1,`Type`),Hc())}function et(n,m){if(n&1&&(yi(0,`td`,42)(1,`div`)(2,`mat-icon`),zD(3),Hc(),yi(4,`span`),zD(5),Hc()()()),n&2){let e=m.$implicit,i=hD(2);Wv(),FD(XD(`type-badge type-`,e.type)),Wv(2),bh(i.typeIcon(e.type)),Wv(2),bh(i.typeLabel(e.type))}}function nt(n,m){n&1&&(yi(0,`th`,41),zD(1,`Annonce`),Hc())}function tt(n,m){if(n&1&&(yi(0,`td`,42)(1,`span`,43),zD(2),Hc(),yi(3,`span`,44),zD(4),Hc()()),n&2){let e=m.$implicit;Wv(2),bh(e.title),Wv(2),bh(e.content)}}function ct(n,m){n&1&&(yi(0,`th`,41),zD(1,`Cible`),Hc())}function at(n,m){n&1&&(yi(0,`span`,45)(1,`mat-icon`),zD(2,`public`),Hc(),zD(3,` Toutes les boutiques `),Hc())}function ot(n,m){if(n&1&&(yi(0,`span`,46)(1,`mat-icon`),zD(2,`storefront`),Hc(),zD(3),Hc()),n&2){let e=hD().$implicit;Wv(3),Ch(` `,e.targetShops.length,` boutique`,e.targetShops.length>1?`s`:``,` `)}}function it(n,m){if(n&1&&(yi(0,`td`,42),QE(1,at,4,0,`span`,45)(2,ot,4,2,`span`,46),Hc()),n&2){let e=m.$implicit;Wv(),YE(e.targetShops?.length?2:1)}}function rt(n,m){n&1&&(yi(0,`th`,41),zD(1,`Statut`),Hc())}function dt(n,m){if(n&1&&(yi(0,`td`,42)(1,`span`,47),zD(2),Hc()()),n&2){let e=m.$implicit;Wv(),hh(`active`,e.active)(`inactive`,!e.active),Wv(),qc(` `,e.active?`Active`:`Inactive`,` `)}}function mt(n,m){n&1&&(yi(0,`th`,41),zD(1,`Expiration`),Hc())}function lt(n,m){if(n&1&&(zD(0),lw(1,`date`)),n&2){let e=hD().$implicit;qc(` `,dw(1,1,e.expireAt,`dd/MM/yyyy`),` `)}}function st(n,m){n&1&&(yi(0,`span`,49),zD(1,`—`),Hc())}function ht(n,m){if(n&1&&(yi(0,`td`,48),QE(1,lt,2,4)(2,st,2,0,`span`,49),Hc()),n&2){let e=m.$implicit;Wv(),YE(e.expireAt?1:2)}}function bt(n,m){n&1&&(yi(0,`th`,41),zD(1,`Créée le`),Hc())}function pt(n,m){if(n&1&&(yi(0,`td`,48),zD(1),lw(2,`date`),Hc()),n&2){let e=m.$implicit;Wv(),qc(` `,dw(2,1,e.createdAt,`dd/MM/yyyy`),` `)}}function kt(n,m){n&1&&(yi(0,`th`,50),zD(1,`Actions`),Hc())}function xt(n,m){if(n&1){let e=sD();yi(0,`td`,42)(1,`div`,51)(2,`button`,52),nh(`click`,function(){let a=Cu(e).$implicit,l=hD(2);return Tu(l.toggleActive(a))}),yi(3,`mat-icon`),zD(4),Hc()(),yi(5,`button`,53),nh(`click`,function(){let a=Cu(e).$implicit,l=hD(2);return Tu(l.openForm(a))}),yi(6,`mat-icon`),zD(7,`edit`),Hc()(),yi(8,`button`,54),nh(`click`,function(){let a=Cu(e).$implicit,l=hD(2);return Tu(l.deleteAnnouncement(a))}),yi(9,`mat-icon`),zD(10,`delete_outline`),Hc()()()()}if(n&2){let e=m.$implicit,i=hD(2);Wv(2),ph(`color`,e.active?`#22c55e`:`#9ca3af`),Zp(`matTooltip`,e.active?`Désactiver`:`Activer`)(`disabled`,i.togglingId()===e.id),Wv(2),bh(e.active?`toggle_on`:`toggle_off`),Wv(4),ph(`color`,`#ef4444`),Zp(`disabled`,i.deletingId()===e.id)}}function ut(n,m){n&1&&Yp(0,`tr`,55)}function _t(n,m){n&1&&Yp(0,`tr`,56)}function ft(n,m){if(n&1&&(yi(0,`div`,14)(1,`table`,27),Uc(2,28),Up(3,Yn,2,0,`th`,29)(4,et,6,5,`td`,30),Wc(),Uc(5,31),Up(6,nt,2,0,`th`,29)(7,tt,5,2,`td`,30),Wc(),Uc(8,32),Up(9,ct,2,0,`th`,29)(10,it,3,1,`td`,30),Wc(),Uc(11,33),Up(12,rt,2,0,`th`,29)(13,dt,3,5,`td`,30),Wc(),Uc(14,34),Up(15,mt,2,0,`th`,29)(16,ht,3,1,`td`,35),Wc(),Uc(17,36),Up(18,bt,2,0,`th`,29)(19,pt,3,4,`td`,35),Wc(),Uc(20,37),Up(21,kt,2,0,`th`,38)(22,xt,11,8,`td`,30),Wc(),Up(23,ut,1,0,`tr`,39)(24,_t,1,0,`tr`,40),Hc()()),n&2){let e=hD();Wv(),Zp(`dataSource`,e.announcements()),Wv(22),Zp(`matHeaderRowDef`,e.displayedColumns),Wv(),Zp(`matRowDefColumns`,e.displayedColumns)}}var yc=(()=>{class n{constructor(){this.svc=_$1(g$1),this.authService=_$1(N),this.dialog=_$1(tt$1),this.destroyRef=_$1(ve$1),this.coverColor=vw(()=>this.authService.company()?.coverColor??``),this.loading=Ho(!1),this.saving=Ho(!1),this.announcements=Ho([]),this.total=Ho(0),this.error=Ho(null),this.deletingId=Ho(null),this.togglingId=Ho(null),this.displayedColumns=[`type`,`title`,`target`,`status`,`expireAt`,`createdAt`,`actions`],this.skeletonRows=Array(4).fill(0)}ngOnInit(){this.load()}load(){this.loading.set(!0),this.error.set(null),this.svc.list().pipe(U(this.destroyRef)).subscribe({next:e=>{this.announcements.set(e.data),this.total.set(e.total),this.loading.set(!1)},error:()=>{this.error.set(`Impossible de charger les annonces.`),this.loading.set(!1)}})}openForm(e){this.dialog.open(Tn,{data:{announcement:e},width:`560px`,maxWidth:`95vw`}).afterClosed().pipe(U(this.destroyRef)).subscribe(a=>{if(!a)return;this.saving.set(!0),(e?this.svc.update(e.id,a):this.svc.create(a)).pipe(U(this.destroyRef)).subscribe({next:()=>{this.saving.set(!1),this.load()},error:()=>this.saving.set(!1)})})}toggleActive(e){this.togglingId.set(e.id),this.svc.toggle(e.id).pipe(U(this.destroyRef)).subscribe({next:i=>{this.announcements.update(a=>a.map(l=>l.id===i.id?i:l)),this.togglingId.set(null)},error:()=>this.togglingId.set(null)})}deleteAnnouncement(e){this.deletingId()||(this.deletingId.set(e.id),this.svc.delete(e.id).pipe(U(this.destroyRef)).subscribe({next:()=>{this.announcements.update(i=>i.filter(a=>a.id!==e.id)),this.total.update(i=>i-1),this.deletingId.set(null)},error:()=>this.deletingId.set(null)}))}typeLabel(e){return{info:`Information`,success:`Succès`,warning:`Avertissement`,urgent:`Urgent`}[e]??e}typeIcon(e){return{info:`info`,success:`check_circle`,warning:`warning`,urgent:`priority_high`}[e]??`info`}static{this.ɵfac=function(i){return new(i||n)}}static{this.ɵcmp=wE({type:n,selectors:[[`app-admin-announcements`]],decls:23,vars:5,consts:[[1,`admin-ann-page`],[1,`page-header`],[1,`header-left`],[1,`page-icon`],[1,`page-title`],[1,`page-subtitle`],[1,`header-right`],[1,`total-badge`],[`mat-flat-button`,``,`color`,`primary`,1,`new-btn`,3,`click`],[1,`table-card`],[`mode`,`indeterminate`,1,`save-bar`],[1,`skeleton-table`],[1,`empty-state`,`error-state`],[1,`empty-state`],[1,`table-wrapper`],[1,`skel-row`],[1,`skel-block`,`skel-type`],[1,`skel-name-col`],[1,`skel-line`,`skel-wide`],[1,`skel-line`,`skel-narrow`],[1,`skel-line`,`skel-short`],[1,`skel-block`,`skel-status`],[1,`skel-actions-wrap`],[1,`skel-block`,`skel-act-btn`],[1,`empty-icon-wrap`,`err-wrap`],[`mat-flat-button`,``,`color`,`primary`,3,`click`],[1,`empty-icon-wrap`],[`mat-table`,``,1,`ann-table`,3,`dataSource`],[`matColumnDef`,`type`],[`mat-header-cell`,``,4,`matHeaderCellDef`],[`mat-cell`,``,4,`matCellDef`],[`matColumnDef`,`title`],[`matColumnDef`,`target`],[`matColumnDef`,`status`],[`matColumnDef`,`expireAt`],[`mat-cell`,``,`class`,`date-cell`,4,`matCellDef`],[`matColumnDef`,`createdAt`],[`matColumnDef`,`actions`],[`mat-header-cell`,``,`class`,`actions-th`,4,`matHeaderCellDef`],[`mat-header-row`,``,4,`matHeaderRowDef`],[`mat-row`,``,`class`,`ann-row`,4,`matRowDef`,`matRowDefColumns`],[`mat-header-cell`,``],[`mat-cell`,``],[1,`ann-title`],[1,`ann-preview`],[1,`target-global`],[1,`target-specific`],[1,`status-badge`],[`mat-cell`,``,1,`date-cell`],[1,`no-expire`],[`mat-header-cell`,``,1,`actions-th`],[1,`actions-cell`],[`mat-icon-button`,``,3,`click`,`matTooltip`,`disabled`],[`mat-icon-button`,``,`matTooltip`,`Modifier`,3,`click`],[`mat-icon-button`,``,`matTooltip`,`Supprimer`,3,`click`,`disabled`],[`mat-header-row`,``],[`mat-row`,``,1,`ann-row`]],template:function(i,a){i&1&&(yi(0,`div`,0)(1,`header`,1)(2,`div`,2)(3,`div`,3)(4,`mat-icon`),zD(5,`campaign`),Hc()(),yi(6,`div`)(7,`h1`,4),zD(8,`Annonces administrateur`),Hc(),yi(9,`p`,5),zD(10,`Messages globaux ou ciblés envoyés aux boutiques`),Hc()()(),yi(11,`div`,6),QE(12,Hn,2,2,`span`,7),yi(13,`button`,8),nh(`click`,function(){return a.openForm()}),yi(14,`mat-icon`),zD(15,`add`),Hc(),zD(16,` Nouvelle annonce `),Hc()()(),yi(17,`mat-card`,9),QE(18,Zn,1,0,`mat-progress-bar`,10),QE(19,Kn,3,0,`div`,11)(20,Wn,12,1,`div`,12)(21,Jn,12,0,`div`,13)(22,ft,25,3,`div`,14),Hc()()),i&2&&(ph(`--%NS%cover-color`,a.coverColor()),Wv(12),YE(a.total()>0?12:-1),Wv(6),YE(a.saving()?18:-1),Wv(),YE(a.loading()?19:a.error()?20:a.announcements().length?22:21))},dependencies:[_,I,tn,Wt,$t,Zt,qt,Qt,Yt,Kt,Gt,Jt,en,st$1,mt$1,G,ie,oe,Ve,Vt,_t$1,fn,un,Jr],styles:[`[_nghost-%COMP%]{display:block;width:100%}.admin-ann-page[_ngcontent-%COMP%]{padding:28px 24px;width:100%;box-sizing:border-box}.page-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px}.header-left[_ngcontent-%COMP%]{display:flex;align-items:center;gap:16px}.page-icon[_ngcontent-%COMP%]{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,var(--%NS%cover-color, #f59e0b),color-mix(in srgb,var(--%NS%cover-color, #f59e0b) 70%,white));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px color-mix(in srgb,var(--%NS%cover-color, #f59e0b) 35%,transparent)}.page-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#fff;font-size:26px;width:26px;height:26px}.page-title[_ngcontent-%COMP%]{margin:0;font-size:22px;font-weight:700;color:#1a1a2e}.page-subtitle[_ngcontent-%COMP%]{margin:3px 0 0;font-size:13px;color:#9ca3af}.header-right[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.total-badge[_ngcontent-%COMP%]{background:#fef3c7;color:#92400e;font-size:13px;font-weight:600;padding:6px 14px;border-radius:20px;border:1px solid #fde68a}.new-btn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px;margin-right:4px}.table-card[_ngcontent-%COMP%]{border-radius:16px!important;overflow:hidden;padding:0!important;box-shadow:0 2px 14px #00000012!important}.save-bar[_ngcontent-%COMP%]{height:3px}.table-wrapper[_ngcontent-%COMP%]{overflow-x:auto}.ann-table[_ngcontent-%COMP%]{width:100%;min-width:700px}.ann-table[_ngcontent-%COMP%]   th.mat-header-cell[_ngcontent-%COMP%]{background:#fafbff;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:14px 16px;border-bottom:2px solid #f0f0f8;white-space:nowrap}.ann-table[_ngcontent-%COMP%]   td.mat-cell[_ngcontent-%COMP%]{padding:12px 16px;border-bottom:1px solid #f8f8f8;vertical-align:middle}.ann-table[_ngcontent-%COMP%]   .ann-row[_ngcontent-%COMP%]{transition:background .15s}.ann-table[_ngcontent-%COMP%]   .ann-row[_ngcontent-%COMP%]:hover{background:#fffef5}.ann-table[_ngcontent-%COMP%]   .ann-row[_ngcontent-%COMP%]:last-child   td.mat-cell[_ngcontent-%COMP%]{border-bottom:none}.type-badge[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}.type-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:14px;width:14px;height:14px}.type-badge.type-info[_ngcontent-%COMP%]{background:#dbeafe;color:#1d4ed8}.type-badge.type-success[_ngcontent-%COMP%]{background:#dcfce7;color:#16a34a}.type-badge.type-warning[_ngcontent-%COMP%]{background:#fef3c7;color:#d97706}.type-badge.type-urgent[_ngcontent-%COMP%]{background:#fee2e2;color:#dc2626}.ann-title[_ngcontent-%COMP%]{display:block;font-size:14px;font-weight:600;color:#111827}.ann-preview[_ngcontent-%COMP%]{display:block;font-size:12px;color:#9ca3af;margin-top:2px;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.target-global[_ngcontent-%COMP%], .target-specific[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:4px;font-size:12px;white-space:nowrap}.target-global[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .target-specific[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:14px;width:14px;height:14px}.target-global[_ngcontent-%COMP%]{color:#6366f1}.target-specific[_ngcontent-%COMP%]{color:#f59e0b}.status-badge[_ngcontent-%COMP%]{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700}.status-badge.active[_ngcontent-%COMP%]{background:#dcfce7;color:#16a34a}.status-badge.inactive[_ngcontent-%COMP%]{background:#f3f4f6;color:#9ca3af}.date-cell[_ngcontent-%COMP%]{font-size:13px;color:#9ca3af;white-space:nowrap}.no-expire[_ngcontent-%COMP%]{color:#d1d5db}.actions-th[_ngcontent-%COMP%]{text-align:right}.actions-cell[_ngcontent-%COMP%]{display:flex;gap:2px;justify-content:flex-end}@keyframes _ngcontent-%COMP%_shimmer{0%{background-position:-600px 0}to{background-position:600px 0}}.skeleton-table[_ngcontent-%COMP%]{padding:8px 0}.skel-row[_ngcontent-%COMP%]{display:flex;align-items:center;gap:20px;padding:14px 24px;border-bottom:1px solid #f5f5f5}.skel-block[_ngcontent-%COMP%]{background:linear-gradient(90deg,#f0f0f0 25%,#e4e4e4,#f0f0f0 75%);background-size:1200px 100%;animation:_ngcontent-%COMP%_shimmer 1.4s infinite linear;border-radius:10px;flex-shrink:0}.skel-line[_ngcontent-%COMP%]{background:linear-gradient(90deg,#f0f0f0 25%,#e4e4e4,#f0f0f0 75%);background-size:1200px 100%;animation:_ngcontent-%COMP%_shimmer 1.4s infinite linear;border-radius:6px;height:12px}.skel-type[_ngcontent-%COMP%]{width:90px;height:28px;border-radius:14px}.skel-name-col[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:column;gap:6px}.skel-wide[_ngcontent-%COMP%]{width:55%}.skel-narrow[_ngcontent-%COMP%]{width:80%}.skel-short[_ngcontent-%COMP%]{width:80px}.skel-status[_ngcontent-%COMP%]{width:60px;height:24px;border-radius:12px}.skel-actions-wrap[_ngcontent-%COMP%]{display:flex;gap:6px}.skel-act-btn[_ngcontent-%COMP%]{width:34px;height:34px;border-radius:50%}.empty-state[_ngcontent-%COMP%]{text-align:center;padding:64px 24px}.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:16px;color:#374151;margin:14px 0 8px}.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px;color:#9ca3af;margin:0 0 24px}.empty-icon-wrap[_ngcontent-%COMP%]{width:76px;height:76px;border-radius:50%;background:#fef3c7;display:flex;align-items:center;justify-content:center;margin:0 auto}.empty-icon-wrap[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:38px;width:38px;height:38px;color:#f59e0b}.err-wrap[_ngcontent-%COMP%]{background:#fef2f2}.err-wrap[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#fca5a5}@media(max-width:768px){.admin-ann-page[_ngcontent-%COMP%]{padding:16px 12px}.page-title[_ngcontent-%COMP%]{font-size:18px}.header-right[_ngcontent-%COMP%]{width:100%;justify-content:flex-end}}`],changeDetection:1})}}return n})();export{yc as AdminAnnouncementsComponent};