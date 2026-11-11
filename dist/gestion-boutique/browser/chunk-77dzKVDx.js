<<<<<<< HEAD:dist/gestion-boutique/browser/chunk-g9SNIMbT.js
<<<<<<< HEAD:dist/gestion-boutique/browser/chunk-CRZeLsW1.js
<<<<<<< HEAD:dist/gestion-boutique/browser/chunk-jZ5tJ1tn.js
<<<<<<<< HEAD:dist/gestion-boutique/browser/chunk-D2QJBeMb.js
import{_ as S,f as C,z as g}from"./main-OXGFZLHT.js";import{u as ot}from"./chunk-DRXgs0SI.js";import{T as re,d as Rs,f as Rt,n as Ds,r as Ee}from"./chunk-Drbq3HVB.js";import{n as at,o as lt}from"./chunk-DFHbGO0e.js";import{Br as wD,Ct as QE,Dr as sh,Er as se,Et as Qp,F as Fh,Fr as v0,Ft as S$1,Gt as Um,Hn as hh,K as ID,Kr as y0,M as FD,N as Fe,Nn as eh,O as ED,R as Fu,U as Hc,Vr as wE,Yr as yi,an as YE,cr as mD,en as Wv,f as CE,fn as _,fr as nh,g as Cr,q as Io,qr as yD,rn as Xl,sn as Yp,un as Zp,wr as rw,zn as g0}from"./chunk-97p5mxa8.js";var ae=new S$1(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var u=class{source;checked;constructor(K,t){this.source=K,this.checked=t}};var ie=(()=>{class a{_elementRef=_(Cr);_focusMonitor=_(Rt);_changeDetectorRef=_(g0);defaults=_(ae);_injector=_(se);_signalFormField=null;_onChange=t=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(t){return new u(this,t)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=re();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(t){this._checked=t,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new Fe;toggleChange=new Fe;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){_(lt).load(Rs);let t=_(new Fh(`tabindex`),{optional:!0}),i=this.defaults;this.tabIndex=t==null?0:parseInt(t)||0,this.color=i.color||`accent`,this.id=this._uniqueId=_(Ee).getId(`mat-mdc-slide-toggle-`),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngOnInit(){this._signalFormField=this._injector.get(ot,void 0,{optional:!0,self:!0})}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(t=>{t===`keyboard`||t===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):t||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(t){t.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(t){this.checked=!!t}registerOnChange(t){this._onChange=t}registerOnTouched(t){this._onTouched=t}validate(t){return this.required&&t.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(t){this._validatorOnChange=t}setDisabledState(t){this.disabled=t,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new u(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(i){return new(i||a)};static ɵcmp=(function(){let t=[`switch`],i=[`*`];function ee(l,c){l&1&&(yi(0,`span`,11),Fu(),yi(1,`svg`,13),Yp(2,`path`,14),Hc(),yi(3,`svg`,15),Yp(4,`path`,16),Hc()())}return wE({type:a,selectors:[[`mat-slide-toggle`]],viewQuery:function(c,e){if(c&1&&sh(t,5),c&2){let o;ID(o=ED())&&(e._switchElement=o.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(c,e){c&2&&(eh(`id`,e.id),Qp(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),FD(e.color?`mat-`+e.color:``),hh(`mat-mdc-slide-toggle-focused`,e._focused)(`mat-mdc-slide-toggle-checked`,e.checked)(`mat-slide-toggle-full-width`,e.fullWidth)(`_mat-animation-noopable`,e._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,y0],color:`color`,disabled:[2,`disabled`,`disabled`,y0],fullWidth:[2,`fullWidth`,`fullWidth`,y0],disableRipple:[2,`disableRipple`,`disableRipple`,y0],tabIndex:[2,`tabIndex`,`tabIndex`,l=>l==null?0:v0(l)],checked:[2,`checked`,`checked`,y0],hideIcon:[2,`hideIcon`,`hideIcon`,y0],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,y0]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[rw([{provide:S,useExisting:Io(()=>a),multi:!0},{provide:C,useExisting:a,multi:!0}]),Um],ngContentSelectors:i,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(c,e){if(c&1&&(mD(),yi(0,`div`,1)(1,`button`,2,0),nh(`click`,function(){return e._handleClick()}),Yp(3,`div`,3)(4,`span`,4),yi(5,`span`,5)(6,`span`,6)(7,`span`,7),Yp(8,`span`,8),Hc(),yi(9,`span`,9),Yp(10,`span`,10),Hc(),QE(11,ee,5,0,`span`,11),Hc()()(),yi(12,`label`,12),nh(`click`,function(te){return te.stopPropagation()}),yD(13),Hc()()),c&2){let o=wD(2);Zp(`labelPosition`,e.labelPosition),Wv(),hh(`mdc-switch--selected`,e.checked)(`mdc-switch--unselected`,!e.checked)(`mdc-switch--checked`,e.checked)(`mdc-switch--disabled`,e.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,e.disabledInteractive),Zp(`tabIndex`,e.disabled&&!e.disabledInteractive?-1:e.tabIndex)(`disabled`,e.disabled&&!e.disabledInteractive),Qp(`id`,e.buttonId)(`name`,e.name)(`aria-label`,e.ariaLabel)(`aria-labelledby`,e._getAriaLabelledBy())(`aria-describedby`,e.ariaDescribedby)(`aria-required`,e.required||null)(`aria-checked`,e.checked)(`aria-disabled`,e.disabled&&e.disabledInteractive?`true`:null),Wv(9),Zp(`matRippleTrigger`,o)(`matRippleDisabled`,e.disableRipple||e.disabled)(`matRippleCentered`,!0),Wv(),YE(e.hideIcon?-1:11),Wv(),Zp(`for`,e.buttonId),Qp(`id`,e._labelId)}},dependencies:[Ds,g],styles:[`.mdc-switch {
========
import{_ as S,f as C,z as g}from"./main-R7QUP3QG.js";import{u as ot}from"./chunk-9RU4Eom3.js";import{T as re,d as Rs,f as Rt,n as Ds,r as Ee}from"./chunk-Drbq3HVB.js";import{n as at,o as lt}from"./chunk-DFHbGO0e.js";import{Br as wD,Ct as QE,Dr as sh,Er as se,Et as Qp,F as Fh,Fr as v0,Ft as S$1,Gt as Um,Hn as hh,K as ID,Kr as y0,M as FD,N as Fe,Nn as eh,O as ED,R as Fu,U as Hc,Vr as wE,Yr as yi,an as YE,cr as mD,en as Wv,f as CE,fn as _,fr as nh,g as Cr,q as Io,qr as yD,rn as Xl,sn as Yp,un as Zp,wr as rw,zn as g0}from"./chunk-97p5mxa8.js";var ae=new S$1(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var u=class{source;checked;constructor(K,t){this.source=K,this.checked=t}};var ie=(()=>{class a{_elementRef=_(Cr);_focusMonitor=_(Rt);_changeDetectorRef=_(g0);defaults=_(ae);_injector=_(se);_signalFormField=null;_onChange=t=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(t){return new u(this,t)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=re();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(t){this._checked=t,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new Fe;toggleChange=new Fe;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){_(lt).load(Rs);let t=_(new Fh(`tabindex`),{optional:!0}),i=this.defaults;this.tabIndex=t==null?0:parseInt(t)||0,this.color=i.color||`accent`,this.id=this._uniqueId=_(Ee).getId(`mat-mdc-slide-toggle-`),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngOnInit(){this._signalFormField=this._injector.get(ot,void 0,{optional:!0,self:!0})}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(t=>{t===`keyboard`||t===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):t||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(t){t.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(t){this.checked=!!t}registerOnChange(t){this._onChange=t}registerOnTouched(t){this._onTouched=t}validate(t){return this.required&&t.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(t){this._validatorOnChange=t}setDisabledState(t){this.disabled=t,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new u(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(i){return new(i||a)};static ɵcmp=(function(){let t=[`switch`],i=[`*`];function ee(l,c){l&1&&(yi(0,`span`,11),Fu(),yi(1,`svg`,13),Yp(2,`path`,14),Hc(),yi(3,`svg`,15),Yp(4,`path`,16),Hc()())}return wE({type:a,selectors:[[`mat-slide-toggle`]],viewQuery:function(c,e){if(c&1&&sh(t,5),c&2){let o;ID(o=ED())&&(e._switchElement=o.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(c,e){c&2&&(eh(`id`,e.id),Qp(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),FD(e.color?`mat-`+e.color:``),hh(`mat-mdc-slide-toggle-focused`,e._focused)(`mat-mdc-slide-toggle-checked`,e.checked)(`mat-slide-toggle-full-width`,e.fullWidth)(`_mat-animation-noopable`,e._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,y0],color:`color`,disabled:[2,`disabled`,`disabled`,y0],fullWidth:[2,`fullWidth`,`fullWidth`,y0],disableRipple:[2,`disableRipple`,`disableRipple`,y0],tabIndex:[2,`tabIndex`,`tabIndex`,l=>l==null?0:v0(l)],checked:[2,`checked`,`checked`,y0],hideIcon:[2,`hideIcon`,`hideIcon`,y0],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,y0]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[rw([{provide:S,useExisting:Io(()=>a),multi:!0},{provide:C,useExisting:a,multi:!0}]),Um],ngContentSelectors:i,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(c,e){if(c&1&&(mD(),yi(0,`div`,1)(1,`button`,2,0),nh(`click`,function(){return e._handleClick()}),Yp(3,`div`,3)(4,`span`,4),yi(5,`span`,5)(6,`span`,6)(7,`span`,7),Yp(8,`span`,8),Hc(),yi(9,`span`,9),Yp(10,`span`,10),Hc(),QE(11,ee,5,0,`span`,11),Hc()()(),yi(12,`label`,12),nh(`click`,function(te){return te.stopPropagation()}),yD(13),Hc()()),c&2){let o=wD(2);Zp(`labelPosition`,e.labelPosition),Wv(),hh(`mdc-switch--selected`,e.checked)(`mdc-switch--unselected`,!e.checked)(`mdc-switch--checked`,e.checked)(`mdc-switch--disabled`,e.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,e.disabledInteractive),Zp(`tabIndex`,e.disabled&&!e.disabledInteractive?-1:e.tabIndex)(`disabled`,e.disabled&&!e.disabledInteractive),Qp(`id`,e.buttonId)(`name`,e.name)(`aria-label`,e.ariaLabel)(`aria-labelledby`,e._getAriaLabelledBy())(`aria-describedby`,e.ariaDescribedby)(`aria-required`,e.required||null)(`aria-checked`,e.checked)(`aria-disabled`,e.disabled&&e.disabledInteractive?`true`:null),Wv(9),Zp(`matRippleTrigger`,o)(`matRippleDisabled`,e.disableRipple||e.disabled)(`matRippleCentered`,!0),Wv(),YE(e.hideIcon?-1:11),Wv(),Zp(`for`,e.buttonId),Qp(`id`,e._labelId)}},dependencies:[Ds,g],styles:[`.mdc-switch {
>>>>>>>> feat/integration-lot2:dist/gestion-boutique/browser/chunk-jZ5tJ1tn.js
=======
import{_ as S,f as C,z as g}from"./main-AAXVCAD2.js";import{u as ot}from"./chunk-Dr1nfu7I.js";import{T as re,d as Rs,f as Rt,n as Ds,r as Ee}from"./chunk-Drbq3HVB.js";import{n as at,o as lt}from"./chunk-DFHbGO0e.js";import{Br as wD,Ct as QE,Dr as sh,Er as se,Et as Qp,F as Fh,Fr as v0,Ft as S$1,Gt as Um,Hn as hh,K as ID,Kr as y0,M as FD,N as Fe,Nn as eh,O as ED,R as Fu,U as Hc,Vr as wE,Yr as yi,an as YE,cr as mD,en as Wv,f as CE,fn as _,fr as nh,g as Cr,q as Io,qr as yD,rn as Xl,sn as Yp,un as Zp,wr as rw,zn as g0}from"./chunk-97p5mxa8.js";var ae=new S$1(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var u=class{source;checked;constructor(K,t){this.source=K,this.checked=t}};var ie=(()=>{class a{_elementRef=_(Cr);_focusMonitor=_(Rt);_changeDetectorRef=_(g0);defaults=_(ae);_injector=_(se);_signalFormField=null;_onChange=t=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(t){return new u(this,t)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=re();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(t){this._checked=t,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new Fe;toggleChange=new Fe;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){_(lt).load(Rs);let t=_(new Fh(`tabindex`),{optional:!0}),i=this.defaults;this.tabIndex=t==null?0:parseInt(t)||0,this.color=i.color||`accent`,this.id=this._uniqueId=_(Ee).getId(`mat-mdc-slide-toggle-`),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngOnInit(){this._signalFormField=this._injector.get(ot,void 0,{optional:!0,self:!0})}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(t=>{t===`keyboard`||t===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):t||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(t){t.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(t){this.checked=!!t}registerOnChange(t){this._onChange=t}registerOnTouched(t){this._onTouched=t}validate(t){return this.required&&t.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(t){this._validatorOnChange=t}setDisabledState(t){this.disabled=t,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new u(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(i){return new(i||a)};static ɵcmp=(function(){let t=[`switch`],i=[`*`];function ee(l,c){l&1&&(yi(0,`span`,11),Fu(),yi(1,`svg`,13),Yp(2,`path`,14),Hc(),yi(3,`svg`,15),Yp(4,`path`,16),Hc()())}return wE({type:a,selectors:[[`mat-slide-toggle`]],viewQuery:function(c,e){if(c&1&&sh(t,5),c&2){let o;ID(o=ED())&&(e._switchElement=o.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(c,e){c&2&&(eh(`id`,e.id),Qp(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),FD(e.color?`mat-`+e.color:``),hh(`mat-mdc-slide-toggle-focused`,e._focused)(`mat-mdc-slide-toggle-checked`,e.checked)(`mat-slide-toggle-full-width`,e.fullWidth)(`_mat-animation-noopable`,e._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,y0],color:`color`,disabled:[2,`disabled`,`disabled`,y0],fullWidth:[2,`fullWidth`,`fullWidth`,y0],disableRipple:[2,`disableRipple`,`disableRipple`,y0],tabIndex:[2,`tabIndex`,`tabIndex`,l=>l==null?0:v0(l)],checked:[2,`checked`,`checked`,y0],hideIcon:[2,`hideIcon`,`hideIcon`,y0],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,y0]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[rw([{provide:S,useExisting:Io(()=>a),multi:!0},{provide:C,useExisting:a,multi:!0}]),Um],ngContentSelectors:i,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(c,e){if(c&1&&(mD(),yi(0,`div`,1)(1,`button`,2,0),nh(`click`,function(){return e._handleClick()}),Yp(3,`div`,3)(4,`span`,4),yi(5,`span`,5)(6,`span`,6)(7,`span`,7),Yp(8,`span`,8),Hc(),yi(9,`span`,9),Yp(10,`span`,10),Hc(),QE(11,ee,5,0,`span`,11),Hc()()(),yi(12,`label`,12),nh(`click`,function(te){return te.stopPropagation()}),yD(13),Hc()()),c&2){let o=wD(2);Zp(`labelPosition`,e.labelPosition),Wv(),hh(`mdc-switch--selected`,e.checked)(`mdc-switch--unselected`,!e.checked)(`mdc-switch--checked`,e.checked)(`mdc-switch--disabled`,e.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,e.disabledInteractive),Zp(`tabIndex`,e.disabled&&!e.disabledInteractive?-1:e.tabIndex)(`disabled`,e.disabled&&!e.disabledInteractive),Qp(`id`,e.buttonId)(`name`,e.name)(`aria-label`,e.ariaLabel)(`aria-labelledby`,e._getAriaLabelledBy())(`aria-describedby`,e.ariaDescribedby)(`aria-required`,e.required||null)(`aria-checked`,e.checked)(`aria-disabled`,e.disabled&&e.disabledInteractive?`true`:null),Wv(9),Zp(`matRippleTrigger`,o)(`matRippleDisabled`,e.disableRipple||e.disabled)(`matRippleCentered`,!0),Wv(),YE(e.hideIcon?-1:11),Wv(),Zp(`for`,e.buttonId),Qp(`id`,e._labelId)}},dependencies:[Ds,g],styles:[`.mdc-switch {
>>>>>>> feat/integration-lot2:dist/gestion-boutique/browser/chunk-CRZeLsW1.js
=======
import{_ as S,f as C,z as g}from"./main-RHRV5L36.js";import{u as ot}from"./chunk-_GEzkmx0.js";import{T as re,d as Rs,f as Rt,n as Ds,r as Ee}from"./chunk-Drbq3HVB.js";import{n as at,o as lt}from"./chunk-DFHbGO0e.js";import{Br as wD,Ct as QE,Dr as sh,Er as se,Et as Qp,F as Fh,Fr as v0,Ft as S$1,Gt as Um,Hn as hh,K as ID,Kr as y0,M as FD,N as Fe,Nn as eh,O as ED,R as Fu,U as Hc,Vr as wE,Yr as yi,an as YE,cr as mD,en as Wv,f as CE,fn as _,fr as nh,g as Cr,q as Io,qr as yD,rn as Xl,sn as Yp,un as Zp,wr as rw,zn as g0}from"./chunk-97p5mxa8.js";var ae=new S$1(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var u=class{source;checked;constructor(K,t){this.source=K,this.checked=t}};var ie=(()=>{class a{_elementRef=_(Cr);_focusMonitor=_(Rt);_changeDetectorRef=_(g0);defaults=_(ae);_injector=_(se);_signalFormField=null;_onChange=t=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(t){return new u(this,t)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=re();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(t){this._checked=t,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new Fe;toggleChange=new Fe;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){_(lt).load(Rs);let t=_(new Fh(`tabindex`),{optional:!0}),i=this.defaults;this.tabIndex=t==null?0:parseInt(t)||0,this.color=i.color||`accent`,this.id=this._uniqueId=_(Ee).getId(`mat-mdc-slide-toggle-`),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngOnInit(){this._signalFormField=this._injector.get(ot,void 0,{optional:!0,self:!0})}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(t=>{t===`keyboard`||t===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):t||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(t){t.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(t){this.checked=!!t}registerOnChange(t){this._onChange=t}registerOnTouched(t){this._onTouched=t}validate(t){return this.required&&t.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(t){this._validatorOnChange=t}setDisabledState(t){this.disabled=t,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new u(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(i){return new(i||a)};static ɵcmp=(function(){let t=[`switch`],i=[`*`];function ee(l,c){l&1&&(yi(0,`span`,11),Fu(),yi(1,`svg`,13),Yp(2,`path`,14),Hc(),yi(3,`svg`,15),Yp(4,`path`,16),Hc()())}return wE({type:a,selectors:[[`mat-slide-toggle`]],viewQuery:function(c,e){if(c&1&&sh(t,5),c&2){let o;ID(o=ED())&&(e._switchElement=o.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(c,e){c&2&&(eh(`id`,e.id),Qp(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),FD(e.color?`mat-`+e.color:``),hh(`mat-mdc-slide-toggle-focused`,e._focused)(`mat-mdc-slide-toggle-checked`,e.checked)(`mat-slide-toggle-full-width`,e.fullWidth)(`_mat-animation-noopable`,e._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,y0],color:`color`,disabled:[2,`disabled`,`disabled`,y0],fullWidth:[2,`fullWidth`,`fullWidth`,y0],disableRipple:[2,`disableRipple`,`disableRipple`,y0],tabIndex:[2,`tabIndex`,`tabIndex`,l=>l==null?0:v0(l)],checked:[2,`checked`,`checked`,y0],hideIcon:[2,`hideIcon`,`hideIcon`,y0],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,y0]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[rw([{provide:S,useExisting:Io(()=>a),multi:!0},{provide:C,useExisting:a,multi:!0}]),Um],ngContentSelectors:i,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(c,e){if(c&1&&(mD(),yi(0,`div`,1)(1,`button`,2,0),nh(`click`,function(){return e._handleClick()}),Yp(3,`div`,3)(4,`span`,4),yi(5,`span`,5)(6,`span`,6)(7,`span`,7),Yp(8,`span`,8),Hc(),yi(9,`span`,9),Yp(10,`span`,10),Hc(),QE(11,ee,5,0,`span`,11),Hc()()(),yi(12,`label`,12),nh(`click`,function(te){return te.stopPropagation()}),yD(13),Hc()()),c&2){let o=wD(2);Zp(`labelPosition`,e.labelPosition),Wv(),hh(`mdc-switch--selected`,e.checked)(`mdc-switch--unselected`,!e.checked)(`mdc-switch--checked`,e.checked)(`mdc-switch--disabled`,e.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,e.disabledInteractive),Zp(`tabIndex`,e.disabled&&!e.disabledInteractive?-1:e.tabIndex)(`disabled`,e.disabled&&!e.disabledInteractive),Qp(`id`,e.buttonId)(`name`,e.name)(`aria-label`,e.ariaLabel)(`aria-labelledby`,e._getAriaLabelledBy())(`aria-describedby`,e.ariaDescribedby)(`aria-required`,e.required||null)(`aria-checked`,e.checked)(`aria-disabled`,e.disabled&&e.disabledInteractive?`true`:null),Wv(9),Zp(`matRippleTrigger`,o)(`matRippleDisabled`,e.disableRipple||e.disabled)(`matRippleCentered`,!0),Wv(),YE(e.hideIcon?-1:11),Wv(),Zp(`for`,e.buttonId),Qp(`id`,e._labelId)}},dependencies:[Ds,g],styles:[`.mdc-switch {
>>>>>>> feat/integration-lot2:dist/gestion-boutique/browser/chunk-g9SNIMbT.js
=======
import{_ as S,f as C,z as g}from"./main-SUFXP2ZL.js";import{u as ot}from"./chunk-Dt6Vv8-F.js";import{T as re,d as Rs,f as Rt,n as Ds,r as Ee}from"./chunk-Drbq3HVB.js";import{n as at,o as lt}from"./chunk-DFHbGO0e.js";import{Br as wD,Ct as QE,Dr as sh,Er as se,Et as Qp,F as Fh,Fr as v0,Ft as S$1,Gt as Um,Hn as hh,K as ID,Kr as y0,M as FD,N as Fe,Nn as eh,O as ED,R as Fu,U as Hc,Vr as wE,Yr as yi,an as YE,cr as mD,en as Wv,f as CE,fn as _,fr as nh,g as Cr,q as Io,qr as yD,rn as Xl,sn as Yp,un as Zp,wr as rw,zn as g0}from"./chunk-97p5mxa8.js";var ae=new S$1(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var u=class{source;checked;constructor(K,t){this.source=K,this.checked=t}};var ie=(()=>{class a{_elementRef=_(Cr);_focusMonitor=_(Rt);_changeDetectorRef=_(g0);defaults=_(ae);_injector=_(se);_signalFormField=null;_onChange=t=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(t){return new u(this,t)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=re();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(t){this._checked=t,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new Fe;toggleChange=new Fe;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){_(lt).load(Rs);let t=_(new Fh(`tabindex`),{optional:!0}),i=this.defaults;this.tabIndex=t==null?0:parseInt(t)||0,this.color=i.color||`accent`,this.id=this._uniqueId=_(Ee).getId(`mat-mdc-slide-toggle-`),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngOnInit(){this._signalFormField=this._injector.get(ot,void 0,{optional:!0,self:!0})}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(t=>{t===`keyboard`||t===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):t||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(t){t.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(t){this.checked=!!t}registerOnChange(t){this._onChange=t}registerOnTouched(t){this._onTouched=t}validate(t){return this.required&&t.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(t){this._validatorOnChange=t}setDisabledState(t){this.disabled=t,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new u(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(i){return new(i||a)};static ɵcmp=(function(){let t=[`switch`],i=[`*`];function ee(l,c){l&1&&(yi(0,`span`,11),Fu(),yi(1,`svg`,13),Yp(2,`path`,14),Hc(),yi(3,`svg`,15),Yp(4,`path`,16),Hc()())}return wE({type:a,selectors:[[`mat-slide-toggle`]],viewQuery:function(c,e){if(c&1&&sh(t,5),c&2){let o;ID(o=ED())&&(e._switchElement=o.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(c,e){c&2&&(eh(`id`,e.id),Qp(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),FD(e.color?`mat-`+e.color:``),hh(`mat-mdc-slide-toggle-focused`,e._focused)(`mat-mdc-slide-toggle-checked`,e.checked)(`mat-slide-toggle-full-width`,e.fullWidth)(`_mat-animation-noopable`,e._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,y0],color:`color`,disabled:[2,`disabled`,`disabled`,y0],fullWidth:[2,`fullWidth`,`fullWidth`,y0],disableRipple:[2,`disableRipple`,`disableRipple`,y0],tabIndex:[2,`tabIndex`,`tabIndex`,l=>l==null?0:v0(l)],checked:[2,`checked`,`checked`,y0],hideIcon:[2,`hideIcon`,`hideIcon`,y0],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,y0]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[rw([{provide:S,useExisting:Io(()=>a),multi:!0},{provide:C,useExisting:a,multi:!0}]),Um],ngContentSelectors:i,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(c,e){if(c&1&&(mD(),yi(0,`div`,1)(1,`button`,2,0),nh(`click`,function(){return e._handleClick()}),Yp(3,`div`,3)(4,`span`,4),yi(5,`span`,5)(6,`span`,6)(7,`span`,7),Yp(8,`span`,8),Hc(),yi(9,`span`,9),Yp(10,`span`,10),Hc(),QE(11,ee,5,0,`span`,11),Hc()()(),yi(12,`label`,12),nh(`click`,function(te){return te.stopPropagation()}),yD(13),Hc()()),c&2){let o=wD(2);Zp(`labelPosition`,e.labelPosition),Wv(),hh(`mdc-switch--selected`,e.checked)(`mdc-switch--unselected`,!e.checked)(`mdc-switch--checked`,e.checked)(`mdc-switch--disabled`,e.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,e.disabledInteractive),Zp(`tabIndex`,e.disabled&&!e.disabledInteractive?-1:e.tabIndex)(`disabled`,e.disabled&&!e.disabledInteractive),Qp(`id`,e.buttonId)(`name`,e.name)(`aria-label`,e.ariaLabel)(`aria-labelledby`,e._getAriaLabelledBy())(`aria-describedby`,e.ariaDescribedby)(`aria-required`,e.required||null)(`aria-checked`,e.checked)(`aria-disabled`,e.disabled&&e.disabledInteractive?`true`:null),Wv(9),Zp(`matRippleTrigger`,o)(`matRippleDisabled`,e.disableRipple||e.disabled)(`matRippleCentered`,!0),Wv(),YE(e.hideIcon?-1:11),Wv(),Zp(`for`,e.buttonId),Qp(`id`,e._labelId)}},dependencies:[Ds,g],styles:[`.mdc-switch {
>>>>>>> feat/integration-lot2:dist/gestion-boutique/browser/chunk-77dzKVDx.js
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 0;
  position: relative;
  width: var(--%NS%mat-slide-toggle-track-width, 52px);
}
.mdc-switch.mdc-switch--disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-switch.mat-mdc-slide-toggle-disabled-interactive {
  pointer-events: auto;
}

.mdc-switch__track {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: var(--%NS%mat-slide-toggle-track-height, 32px);
  border-radius: var(--%NS%mat-slide-toggle-track-shape, var(--%NS%mat-sys-corner-full));
}
.mdc-switch--disabled.mdc-switch .mdc-switch__track {
  opacity: var(--%NS%mat-slide-toggle-disabled-track-opacity, 0.12);
}
.mdc-switch__track::before, .mdc-switch__track::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  border-width: var(--%NS%mat-slide-toggle-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-track-outline-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--selected .mdc-switch__track::before, .mdc-switch--selected .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-selected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-selected-track-outline-color, transparent);
}
.mdc-switch--disabled .mdc-switch__track::before, .mdc-switch--disabled .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-color, var(--%NS%mat-sys-on-surface));
}
@media (forced-colors: active) {
  .mdc-switch__track {
    border-color: currentColor;
  }
}
.mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: translateX(0);
  background: var(--%NS%mat-slide-toggle-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch--selected .mdc-switch__track::before {
  transform: translateX(-100%);
}
.mdc-switch--selected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-hover-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-focus-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:active .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-track-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::before, .mdc-switch.mdc-switch--disabled .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch__track::after {
  transform: translateX(-100%);
  background: var(--%NS%mat-slide-toggle-selected-track-color, var(--%NS%mat-sys-primary));
}
[dir=rtl] .mdc-switch__track::after {
  transform: translateX(100%);
}
.mdc-switch--selected .mdc-switch__track::after {
  transform: translateX(0);
}
.mdc-switch--selected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:active .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-track-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::after, .mdc-switch.mdc-switch--disabled .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-track-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch__handle-track {
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  left: 0;
  right: auto;
  transform: translateX(0);
  width: calc(100% - var(--%NS%mat-slide-toggle-handle-width));
}
[dir=rtl] .mdc-switch__handle-track {
  left: auto;
  right: 0;
}
.mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(-100%);
}

.mdc-switch__handle {
  display: flex;
  pointer-events: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: auto;
  transition: width 75ms cubic-bezier(0.4, 0, 0.2, 1), height 75ms cubic-bezier(0.4, 0, 0.2, 1), margin 75ms cubic-bezier(0.4, 0, 0.2, 1);
  width: var(--%NS%mat-slide-toggle-handle-width);
  height: var(--%NS%mat-slide-toggle-handle-height);
  border-radius: var(--%NS%mat-slide-toggle-handle-shape, var(--%NS%mat-sys-corner-full));
}
[dir=rtl] .mdc-switch__handle {
  left: auto;
  right: 0;
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  margin: var(--%NS%mat-slide-toggle-unselected-handle-horizontal-margin, 0 8px);
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-unselected-with-icon-handle-horizontal-margin, 0 4px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  margin: var(--%NS%mat-slide-toggle-selected-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-selected-with-icon-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons) {
  width: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
}
.mat-mdc-slide-toggle .mdc-switch:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
  height: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%selected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-selected-pressed-handle-horizontal-margin, 0 22px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%unselected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-unselected-pressed-handle-horizontal-margin, 0 2px);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-handle-opacity, 1);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-handle-opacity, 0.38);
}
.mdc-switch__handle::before, .mdc-switch__handle::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  width: 100%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1), border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}
@media (forced-colors: active) {
  .mdc-switch__handle::before, .mdc-switch__handle::after {
    border-color: currentColor;
  }
}
.mdc-switch--%NS%selected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-handle-color, var(--%NS%mat-sys-on-primary));
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-handle-color, var(--%NS%mat-sys-primary-container));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:hover:not(:focus):not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:focus:not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:active .mdc-switch__handle::after, .mdc-switch--selected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-handle-color, var(--%NS%mat-sys-surface));
}
.mdc-switch--%NS%unselected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-handle-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--%NS%unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-handle-color, var(--%NS%mat-sys-on-surface));
}
.mdc-switch__handle::before {
  background: var(--%NS%mat-slide-toggle-handle-surface-color);
}

.mdc-switch__shadow {
  border-radius: inherit;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.mdc-switch:enabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-handle-elevation-shadow);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__shadow, .mdc-switch.mdc-switch--disabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-disabled-handle-elevation-shadow);
}

.mdc-switch__ripple {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  width: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
  height: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
}
.mdc-switch__ripple::after {
  content: "";
  opacity: 0;
}
.mdc-switch--disabled .mdc-switch__ripple::after {
  display: none;
}
.mat-mdc-slide-toggle-disabled-interactive .mdc-switch__ripple::after {
  display: block;
}
.mdc-switch:hover .mdc-switch__ripple::after {
  transition: 75ms opacity cubic-bezier(0, 0, 0.2, 1);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:focus .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:active .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:hover:not(:focus) .mdc-switch__ripple::after, .mdc-switch--%NS%unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}

.mdc-switch__icons {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1;
  transform: translateZ(0);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-icon-opacity, 0.38);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-icon-opacity, 0.38);
}

.mdc-switch__icon {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1);
}
.mdc-switch--unselected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-selected-icon-color, var(--%NS%mat-sys-on-primary-container));
}
.mdc-switch--selected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-selected-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch--selected .mdc-switch__icon--on,
.mdc-switch--unselected .mdc-switch__icon--off {
  opacity: 1;
  transition: opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1);
}

.mat-mdc-slide-toggle {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  -webkit-tap-highlight-color: transparent;
  outline: 0;
}
.mat-mdc-slide-toggle .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,
.mat-mdc-slide-toggle .mdc-switch__ripple::after {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),
.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty) {
  transform: translateZ(0);
}
.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-focus-indicator::before {
  content: "";
}
.mat-mdc-slide-toggle .mat-internal-form-field {
  color: var(--%NS%mat-slide-toggle-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-slide-toggle-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-slide-toggle-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-slide-toggle-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-slide-toggle-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-slide-toggle-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-slide-toggle .mat-ripple-element {
  opacity: 0.12;
}
.mat-mdc-slide-toggle .mat-focus-indicator::before {
  border-radius: 50%;
}
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after {
  transition: none;
}
.mat-mdc-slide-toggle .mdc-switch:enabled + .mdc-label {
  cursor: pointer;
}
.mat-mdc-slide-toggle .mdc-switch--disabled + label {
  color: var(--%NS%mat-slide-toggle-disabled-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-slide-toggle label:empty {
  display: none;
}

.mat-slide-toggle-full-width {
  width: 100%;
}
.mat-slide-toggle-full-width .mat-internal-form-field {
  width: 100%;
  justify-content: space-between;
}
.mat-slide-toggle-full-width .mat-internal-form-field label {
  margin: 0;
  flex-grow: 1;
  text-align: end;
}
.mat-slide-toggle-full-width .mdc-form-field--align-end label {
  text-align: start;
}

.mat-mdc-slide-toggle-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-slide-toggle-touch-target-size, 48px);
  width: 100%;
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-slide-toggle-touch-target-display, block);
}
[dir=rtl] .mat-mdc-slide-toggle-touch-target {
  left: auto;
  right: 50%;
  transform: translate(50%, -50%);
}
`],encapsulation:2})})()}return a})();var ke=(()=>{class a{static ɵfac=function(i){return new(i||a)};static ɵmod=CE({type:a});static ɵinj=Xl({imports:[ie,at]})}return a})();export{ke as n,ie as t};