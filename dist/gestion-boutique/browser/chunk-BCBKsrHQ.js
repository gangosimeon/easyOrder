import{n as Ye$1}from"./chunk-BwWf8887.js";import{$ as Oe,Z as Ct,_t as vi,it as W,nt as T,st as Zt$1}from"./main-WGZMDDHP.js";import{E as u,S as ii}from"./chunk-Drbq3HVB.js";import{i as gt,n as at}from"./chunk-DFHbGO0e.js";import{Ct as QE,Dn as cy,Er as se$1,Et as Qp,F as Fh,Fr as v0,Ft as S,Gt as Um,Hn as hh,K as ID,Kr as y0,M as FD,N as Fe,O as ED,Tn as cg,U as Hc,Vr as wE,Wn as ih,Y as J,Yn as jg,Yr as yi,Yt as Vo,an as YE,ar as lg,c as Bc,cr as mD,en as Wv,f as CE,fn as _,g as Cr,gt as Nw,in as Xp,k as Eg,kn as dg,lr as mr,mr as og,n as $c,o as Ai,pt as Ng,qr as yD,rn as Xl,s as An,st as Me,t as $a,tt as Kp,u as Bp,ut as NE,v as Cv,vr as ph,wr as rw,zn as g0}from"./chunk-97p5mxa8.js";var D=new S(`CDK_TABLE`);var oe=(()=>{class n{template=_(mr);static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`cdkCellDef`,``]]})}return n})();var se=(()=>{class n{template=_(mr);static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`cdkHeaderCellDef`,``]]})}return n})();var Ye=(()=>{class n{template=_(mr);static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`cdkFooterCellDef`,``]]})}return n})();var X=(()=>{class n{_table=_(D,{optional:!0});_hasStickyChanged=!1;get name(){return this._name}set name(e){this._setNameInput(e)}_name;get sticky(){return this._sticky}set sticky(e){e!==this._sticky&&(this._sticky=e,this._hasStickyChanged=!0)}_sticky=!1;get stickyEnd(){return this._stickyEnd}set stickyEnd(e){e!==this._stickyEnd&&(this._stickyEnd=e,this._hasStickyChanged=!0)}_stickyEnd=!1;cell;headerCell;footerCell;cssClassFriendlyName;_columnCssClassName;hasStickyChanged(){let e=this._hasStickyChanged;return this.resetStickyChanged(),e}resetStickyChanged(){this._hasStickyChanged=!1}_updateColumnCssClassName(){this._columnCssClassName=[`cdk-column-${this.cssClassFriendlyName}`]}_setNameInput(e){e&&(this._name=e,this.cssClassFriendlyName=e.replace(/[^a-z0-9_-]/gi,`-`),this._updateColumnCssClassName())}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`cdkColumnDef`,``]],contentQueries:function(t,r,a){if(t&1&&ih(a,oe,5)(a,se,5)(a,Ye,5),t&2){let i;ID(i=ED())&&(r.cell=i.first),ID(i=ED())&&(r.headerCell=i.first),ID(i=ED())&&(r.footerCell=i.first)}},inputs:{name:[0,`cdkColumnDef`,`name`],sticky:[2,`sticky`,`sticky`,y0],stickyEnd:[2,`stickyEnd`,`stickyEnd`,y0]}})}return n})();var ie=class{constructor(o,e){e.nativeElement.classList.add(...o._columnCssClassName)}};var Je=(()=>{class n extends ie{constructor(){super(_(X),_(Cr))}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[`cdk-header-cell`],[`th`,`cdk-header-cell`,``]],hostAttrs:[`role`,`columnheader`,1,`cdk-header-cell`],features:[Bp]})}return n})();var et=(()=>{class n extends ie{constructor(){let e=_(X),t=_(Cr);super(e,t);let r=e._table?._getCellRole();r&&t.nativeElement.setAttribute(`role`,r)}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[`cdk-cell`],[`td`,`cdk-cell`,``]],hostAttrs:[1,`cdk-cell`],features:[Bp]})}return n})();var pe=(()=>{class n{template=_(mr);_differs=_(Nw);columns;_columnsDiffer;ngOnChanges(e){if(!this._columnsDiffer){let t=e.columns&&e.columns.currentValue||[];this._columnsDiffer=this._differs.find(t).create(),this._columnsDiffer.diff(t)}}getColumnsDiff(){return this._columnsDiffer.diff(this.columns)}extractCellTemplate(e){return this instanceof q?e.headerCell.template:this instanceof ge?e.footerCell.template:e.cell.template}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,features:[Um]})}return n})();var q=(()=>{class n extends pe{_table=_(D,{optional:!0});_hasStickyChanged=!1;get sticky(){return this._sticky}set sticky(e){e!==this._sticky&&(this._sticky=e,this._hasStickyChanged=!0)}_sticky=!1;ngOnChanges(e){super.ngOnChanges(e)}hasStickyChanged(){let e=this._hasStickyChanged;return this.resetStickyChanged(),e}resetStickyChanged(){this._hasStickyChanged=!1}static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[``,`cdkHeaderRowDef`,``]],inputs:{columns:[0,`cdkHeaderRowDef`,`columns`],sticky:[2,`cdkHeaderRowDefSticky`,`sticky`,y0]},features:[Bp,Um]})}return n})();var ge=(()=>{class n extends pe{_table=_(D,{optional:!0});_hasStickyChanged=!1;get sticky(){return this._sticky}set sticky(e){e!==this._sticky&&(this._sticky=e,this._hasStickyChanged=!0)}_sticky=!1;ngOnChanges(e){super.ngOnChanges(e)}hasStickyChanged(){let e=this._hasStickyChanged;return this.resetStickyChanged(),e}resetStickyChanged(){this._hasStickyChanged=!1}static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[``,`cdkFooterRowDef`,``]],inputs:{columns:[0,`cdkFooterRowDef`,`columns`],sticky:[2,`cdkFooterRowDefSticky`,`sticky`,y0]},features:[Bp,Um]})}return n})();var le=(()=>{class n extends pe{_table=_(D,{optional:!0});when;static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[``,`cdkRowDef`,``]],inputs:{columns:[0,`cdkRowDefColumns`,`columns`],when:[0,`cdkRowDefWhen`,`when`]},features:[Bp]})}return n})();var A=(()=>{class n{_viewContainer=_(Ai);cells;context;static mostRecentCellOutlet=null;constructor(){n.mostRecentCellOutlet=this}ngOnDestroy(){n.mostRecentCellOutlet===this&&(n.mostRecentCellOutlet=null)}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`cdkCellOutlet`,``]]})}return n})();var ye=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵcmp=wE({type:n,selectors:[[`cdk-header-row`],[`tr`,`cdk-header-row`,``]],hostAttrs:[`role`,`row`,1,`cdk-header-row`],decls:1,vars:0,consts:[[`cdkCellOutlet`,``]],template:function(t,r){t&1&&Xp(0,0)},dependencies:[A],encapsulation:2,changeDetection:1})}return n})();var _e=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵcmp=wE({type:n,selectors:[[`cdk-row`],[`tr`,`cdk-row`,``]],hostAttrs:[`role`,`row`,1,`cdk-row`],decls:1,vars:0,consts:[[`cdkCellOutlet`,``]],template:function(t,r){t&1&&Xp(0,0)},dependencies:[A],encapsulation:2,changeDetection:1})}return n})();var tt=(()=>{class n{templateRef=_(mr);_contentClassNames=[`cdk-no-data-row`,`cdk-row`];_cellClassNames=[`cdk-cell`,`cdk-no-data-cell`];_cellSelector=`td, cdk-cell, [cdk-cell], .cdk-cell`;static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[`ng-template`,`cdkNoDataRow`,``]]})}return n})();var $e=[`top`,`bottom`,`left`,`right`];var he=class{_isNativeHtmlTable;_stickCellCss;_isBrowser;_needsPositionStickyOnElement;direction;_positionListener;_tableInjector;_elemSizeCache=/* @__PURE__ */ new WeakMap;_resizeObserver=globalThis?.ResizeObserver?new globalThis.ResizeObserver(o=>this._updateCachedSizes(o)):null;_updatedStickyColumnsParamsToReplay=[];_stickyColumnsReplayTimeout=null;_cachedCellWidths=[];_borderCellCss;_destroyed=!1;constructor(o,e,t=!0,r=!0,a,i,s){this._isNativeHtmlTable=o,this._stickCellCss=e,this._isBrowser=t,this._needsPositionStickyOnElement=r,this.direction=a,this._positionListener=i,this._tableInjector=s,this._borderCellCss={top:`${e}-border-elem-top`,bottom:`${e}-border-elem-bottom`,left:`${e}-border-elem-left`,right:`${e}-border-elem-right`}}clearStickyPositioning(o,e){(e.includes(`left`)||e.includes(`right`))&&this._removeFromStickyColumnReplayQueue(o);let t=[];for(let r of o)r.nodeType===r.ELEMENT_NODE&&t.push(r,...Array.from(r.children));Cv({write:()=>{for(let r of t)this._removeStickyStyle(r,e)}},{injector:this._tableInjector})}updateStickyColumns(o,e,t,r=!0,a=!0){if(!o.length||!this._isBrowser||!(e.some(b=>b)||t.some(b=>b))){this._positionListener?.stickyColumnsUpdated({sizes:[]}),this._positionListener?.stickyEndColumnsUpdated({sizes:[]});return}let i=o[0],s=i.children.length,l=this.direction===`rtl`,d=l?`right`:`left`,m=l?`left`:`right`,f=e.lastIndexOf(!0),h=t.indexOf(!0),p,Re,ke;a&&this._updateStickyColumnReplayQueue({rows:[...o],stickyStartStates:[...e],stickyEndStates:[...t]}),Cv({earlyRead:()=>{p=this._getCellWidths(i,r),Re=this._getStickyStartColumnPositions(p,e),ke=this._getStickyEndColumnPositions(p,t)},write:()=>{for(let b of o)for(let w=0;w<s;w++){let Se=b.children[w];e[w]&&this._addStickyStyle(Se,d,Re[w],w===f),t[w]&&this._addStickyStyle(Se,m,ke[w],w===h)}this._positionListener&&p.some(b=>!!b)&&(this._positionListener.stickyColumnsUpdated({sizes:f===-1?[]:p.slice(0,f+1).map((b,w)=>e[w]?b:null)}),this._positionListener.stickyEndColumnsUpdated({sizes:h===-1?[]:p.slice(h).map((b,w)=>t[w+h]?b:null).reverse()}))}},{injector:this._tableInjector})}stickRows(o,e,t){if(!this._isBrowser)return;let r=t===`bottom`?o.slice().reverse():o,a=t===`bottom`?e.slice().reverse():e,i=[],s=[],l=[];Cv({earlyRead:()=>{for(let d=0,m=0;d<r.length;d++){if(!a[d])continue;i[d]=m;let f=r[d];l[d]=this._isNativeHtmlTable?Array.from(f.children):[f];let h=this._retrieveElementSize(f).height;m+=h,s[d]=h}},write:()=>{let d=a.lastIndexOf(!0);for(let m=0;m<r.length;m++){if(!a[m])continue;let f=i[m],h=m===d;for(let p of l[m])this._addStickyStyle(p,t,f,h)}t===`top`?this._positionListener?.stickyHeaderRowsUpdated({sizes:s,offsets:i,elements:l}):this._positionListener?.stickyFooterRowsUpdated({sizes:s,offsets:i,elements:l})}},{injector:this._tableInjector})}updateStickyFooterContainer(o,e){this._isNativeHtmlTable&&Cv({write:()=>{let t=o.querySelector(`tfoot`);t&&(e.some(r=>!r)?this._removeStickyStyle(t,[`bottom`]):this._addStickyStyle(t,`bottom`,0,!1))}},{injector:this._tableInjector})}destroy(){this._stickyColumnsReplayTimeout&&clearTimeout(this._stickyColumnsReplayTimeout),this._resizeObserver?.disconnect(),this._destroyed=!0}_removeStickyStyle(o,e){if(!o.classList.contains(this._stickCellCss))return;for(let r of e)o.style[r]=``,o.classList.remove(this._borderCellCss[r]);$e.some(r=>e.indexOf(r)===-1&&o.style[r])?o.style.zIndex=this._getCalculatedZIndex(o):(o.style.zIndex=``,this._needsPositionStickyOnElement&&(o.style.position=``),o.classList.remove(this._stickCellCss))}_addStickyStyle(o,e,t,r){o.classList.add(this._stickCellCss),r&&o.classList.add(this._borderCellCss[e]),o.style[e]=`${t}px`,o.style.zIndex=this._getCalculatedZIndex(o),this._needsPositionStickyOnElement&&(o.style.cssText+=`position: -webkit-sticky; position: sticky; `)}_getCalculatedZIndex(o){let e={top:100,bottom:10,left:1,right:1},t=0;for(let r of $e)o.style[r]&&(t+=e[r]);return t?`${t}`:``}_getCellWidths(o,e=!0){if(!e&&this._cachedCellWidths.length)return this._cachedCellWidths;let t=[],r=o.children;for(let a=0;a<r.length;a++){let i=r[a];t.push(this._retrieveElementSize(i).width)}return this._cachedCellWidths=t,t}_getStickyStartColumnPositions(o,e){let t=[],r=0;for(let a=0;a<o.length;a++)e[a]&&(t[a]=r,r+=o[a]);return t}_getStickyEndColumnPositions(o,e){let t=[],r=0;for(let a=o.length;a>0;a--)e[a]&&(t[a]=r,r+=o[a]);return t}_retrieveElementSize(o){let e=this._elemSizeCache.get(o);if(e)return e;let t=o.getBoundingClientRect(),r={width:t.width,height:t.height};return this._resizeObserver&&(this._elemSizeCache.set(o,r),this._resizeObserver.observe(o,{box:`border-box`})),r}_updateStickyColumnReplayQueue(o){this._removeFromStickyColumnReplayQueue(o.rows),this._stickyColumnsReplayTimeout||this._updatedStickyColumnsParamsToReplay.push(o)}_removeFromStickyColumnReplayQueue(o){let e=new Set(o);for(let t of this._updatedStickyColumnsParamsToReplay)t.rows=t.rows.filter(r=>!e.has(r));this._updatedStickyColumnsParamsToReplay=this._updatedStickyColumnsParamsToReplay.filter(t=>!!t.rows.length)}_updateCachedSizes(o){let e=!1;for(let t of o){let r=t.borderBoxSize?.length?{width:t.borderBoxSize[0].inlineSize,height:t.borderBoxSize[0].blockSize}:{width:t.contentRect.width,height:t.contentRect.height};r.width!==this._elemSizeCache.get(t.target)?.width&&dt(t.target)&&(e=!0),this._elemSizeCache.set(t.target,r)}e&&this._updatedStickyColumnsParamsToReplay.length&&(this._stickyColumnsReplayTimeout&&clearTimeout(this._stickyColumnsReplayTimeout),this._stickyColumnsReplayTimeout=setTimeout(()=>{if(!this._destroyed){for(let t of this._updatedStickyColumnsParamsToReplay)this.updateStickyColumns(t.rows,t.stickyStartStates,t.stickyEndStates,!0,!1);this._updatedStickyColumnsParamsToReplay=[],this._stickyColumnsReplayTimeout=null}},0))}};function dt(n){return[`cdk-cell`,`cdk-header-cell`,`cdk-footer-cell`].some(o=>n.classList.contains(o))}function qe(n){return Error(`Could not find column with id "${n}".`)}var $=new S(`STICKY_POSITIONING_LISTENER`);var we=(()=>{class n{viewContainer=_(Ai);elementRef=_(Cr);constructor(){let e=_(D);e._rowOutlet=this,e._outletAssigned()}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`rowOutlet`,``]]})}return n})();var be=(()=>{class n{viewContainer=_(Ai);elementRef=_(Cr);constructor(){let e=_(D);e._headerRowOutlet=this,e._outletAssigned()}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`headerRowOutlet`,``]]})}return n})();var Ce=(()=>{class n{viewContainer=_(Ai);elementRef=_(Cr);constructor(){let e=_(D);e._footerRowOutlet=this,e._outletAssigned()}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`footerRowOutlet`,``]]})}return n})();var De=(()=>{class n{viewContainer=_(Ai);elementRef=_(Cr);constructor(){let e=_(D);e._noDataRowOutlet=this,e._outletAssigned()}static ɵfac=function(t){return new(t||n)};static ɵdir=NE({type:n,selectors:[[``,`noDataRowOutlet`,``]]})}return n})();var ve=(()=>{class n{_differs=_(Nw);_changeDetectorRef=_(g0);_elementRef=_(Cr);_dir=_(gt,{optional:!0});_platform=_(u);_viewRepeater;_viewportRuler=_(T);_injector=_(se$1);_virtualScrollViewport=_(vi,{optional:!0,host:!0});_positionListener=_($,{optional:!0})||_($,{optional:!0,skipSelf:!0});_document=_(Vo);_data;_renderedRange;_onDestroy=new J;_renderRows;_renderChangeSubscription=null;_columnDefsByName=/* @__PURE__ */ new Map;_rowDefs;_headerRowDefs;_footerRowDefs;_dataDiffer;_defaultRowDef=null;_customColumnDefs=/* @__PURE__ */ new Set;_customRowDefs=/* @__PURE__ */ new Set;_customHeaderRowDefs=/* @__PURE__ */ new Set;_customFooterRowDefs=/* @__PURE__ */ new Set;_customNoDataRow=null;_headerRowDefChanged=!0;_footerRowDefChanged=!0;_stickyColumnStylesNeedReset=!0;_forceRecalculateCellWidths=!0;_cachedRenderRowsMap=/* @__PURE__ */ new Map;_rowDefsByView=/* @__PURE__ */ new WeakMap;_isNativeHtmlTable;_stickyStyler;stickyCssClass=`cdk-table-sticky`;needsPositionStickyOnElement=!0;_isServer;_isShowingNoDataRow=!1;_hasAllOutlets=!1;_hasInitialized=!1;_headerRowStickyUpdates=new J;_footerRowStickyUpdates=new J;_disableVirtualScrolling=!1;_getCellRole(){if(this._cellRoleInternal===void 0){let e=this._elementRef.nativeElement.getAttribute(`role`);return e===`grid`||e===`treegrid`?`gridcell`:`cell`}return this._cellRoleInternal}_cellRoleInternal=void 0;get trackBy(){return this._trackByFn}set trackBy(e){this._trackByFn=e}_trackByFn;get dataSource(){return this._dataSource}set dataSource(e){this._dataSource!==e&&(this._switchDataSource(e),this._changeDetectorRef.markForCheck())}_dataSource;_dataSourceChanges=new J;_dataStream=new J;get multiTemplateDataRows(){return this._multiTemplateDataRows}set multiTemplateDataRows(e){this._multiTemplateDataRows=e,this._rowOutlet&&this._rowOutlet.viewContainer.length&&(this._forceRenderDataRows(),this.updateStickyColumnStyles())}_multiTemplateDataRows=!1;get fixedLayout(){return this._virtualScrollEnabled()?!0:this._fixedLayout}set fixedLayout(e){this._fixedLayout=e,this._forceRecalculateCellWidths=!0,this._stickyColumnStylesNeedReset=!0}_fixedLayout=!1;recycleRows=!1;contentChanged=new Fe;viewChange=new An({start:0,end:Number.MAX_VALUE});_rowOutlet;_headerRowOutlet;_footerRowOutlet;_noDataRowOutlet;_contentColumnDefs;_contentRowDefs;_contentHeaderRowDefs;_contentFooterRowDefs;_noDataRow;get renderedRows(){return this._renderRows}constructor(){_(new Fh(`role`),{optional:!0})||this._elementRef.nativeElement.setAttribute(`role`,`table`),this._isServer=!this._platform.isBrowser,this._isNativeHtmlTable=this._elementRef.nativeElement.nodeName===`TABLE`,this._dataDiffer=this._differs.find([]).create((t,r)=>this.trackBy?this.trackBy(r.dataIndex,r.data):r)}ngOnInit(){this._setupStickyStyler(),this._viewportRuler.change().pipe(jg(this._onDestroy)).subscribe(()=>{this._forceRecalculateCellWidths=!0})}ngAfterContentInit(){this._viewRepeater=this.recycleRows||this._virtualScrollEnabled()?new Zt$1:new Ye$1,this._virtualScrollEnabled()&&this._setupVirtualScrolling(this._virtualScrollViewport),this._hasInitialized=!0}ngAfterContentChecked(){this._canRender()&&this._render()}ngOnDestroy(){this._stickyStyler?.destroy(),[this._rowOutlet?.viewContainer,this._headerRowOutlet?.viewContainer,this._footerRowOutlet?.viewContainer,this._cachedRenderRowsMap,this._customColumnDefs,this._customRowDefs,this._customHeaderRowDefs,this._customFooterRowDefs,this._columnDefsByName].forEach(e=>{e?.clear()}),this._headerRowDefs=[],this._footerRowDefs=[],this._defaultRowDef=null,this._headerRowStickyUpdates.complete(),this._footerRowStickyUpdates.complete(),this._onDestroy.next(),this._onDestroy.complete(),Oe(this.dataSource)&&this.dataSource.disconnect(this)}renderRows(){this._renderRows=this._getAllRenderRows();let e=this._dataDiffer.diff(this._renderRows);if(!e){this._updateNoDataRow(),this.contentChanged.next();return}let t=this._rowOutlet.viewContainer;this._viewRepeater.applyChanges(e,t,(r,a,i)=>this._getEmbeddedViewArgs(r.item,i),r=>r.item.data,r=>{if(r.operation===W.INSERTED&&r.context){this._renderCellTemplateForItem(r.record.item.rowDef,r.context);let a=t.get(r.record.currentIndex);this._rowDefsByView.set(a,r.record.item.rowDef)}}),e.forEachIdentityChange(r=>{let a=r.currentIndex,i=t.get(a);if(this._rowDefsByView.get(i)!==r.item.rowDef){t.remove(a);let s=this._renderRow(this._rowOutlet,r.item.rowDef,a,{$implicit:r.item.data});this._rowDefsByView.set(s,r.item.rowDef)}else i.context.$implicit=r.item.data}),this._updateRowIndexContext(),this._updateNoDataRow(),this.contentChanged.next(),this.updateStickyColumnStyles()}addColumnDef(e){this._customColumnDefs.add(e)}removeColumnDef(e){this._customColumnDefs.delete(e)}addRowDef(e){this._customRowDefs.add(e)}removeRowDef(e){this._customRowDefs.delete(e)}addHeaderRowDef(e){this._customHeaderRowDefs.add(e),this._headerRowDefChanged=!0}removeHeaderRowDef(e){this._customHeaderRowDefs.delete(e),this._headerRowDefChanged=!0}addFooterRowDef(e){this._customFooterRowDefs.add(e),this._footerRowDefChanged=!0}removeFooterRowDef(e){this._customFooterRowDefs.delete(e),this._footerRowDefChanged=!0}setNoDataRow(e){this._customNoDataRow=e}updateStickyHeaderRowStyles(){let e=this._getRenderedRows(this._headerRowOutlet);if(this._isNativeHtmlTable){let r=Ke(this._headerRowOutlet,`thead`);r&&(r.style.display=e.length?``:`none`)}let t=this._headerRowDefs.map(r=>r.sticky);this._stickyStyler.clearStickyPositioning(e,[`top`]),this._stickyStyler.stickRows(e,t,`top`),this._headerRowDefs.forEach(r=>r.resetStickyChanged())}updateStickyFooterRowStyles(){let e=this._getRenderedRows(this._footerRowOutlet);if(this._isNativeHtmlTable){let r=Ke(this._footerRowOutlet,`tfoot`);r&&(r.style.display=e.length?``:`none`)}let t=this._footerRowDefs.map(r=>r.sticky);this._stickyStyler.clearStickyPositioning(e,[`bottom`]),this._stickyStyler.stickRows(e,t,`bottom`),this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement,t),this._footerRowDefs.forEach(r=>r.resetStickyChanged())}updateStickyColumnStyles(){let e=this._getRenderedRows(this._headerRowOutlet),t=this._getRenderedRows(this._rowOutlet),r=this._getRenderedRows(this._footerRowOutlet);(this._isNativeHtmlTable&&!this.fixedLayout||this._stickyColumnStylesNeedReset)&&(this._stickyStyler.clearStickyPositioning([...e,...t,...r],[`left`,`right`]),this._stickyColumnStylesNeedReset=!1),e.forEach((a,i)=>{this._addStickyColumnStyles([a],this._headerRowDefs[i])}),this._rowDefs.forEach(a=>{let i=[];for(let s=0;s<t.length;s++)this._renderRows[s].rowDef===a&&i.push(t[s]);this._addStickyColumnStyles(i,a)}),r.forEach((a,i)=>{this._addStickyColumnStyles([a],this._footerRowDefs[i])}),Array.from(this._columnDefsByName.values()).forEach(a=>a.resetStickyChanged())}stickyColumnsUpdated(e){this._positionListener?.stickyColumnsUpdated(e)}stickyEndColumnsUpdated(e){this._positionListener?.stickyEndColumnsUpdated(e)}stickyHeaderRowsUpdated(e){this._headerRowStickyUpdates.next(e),this._positionListener?.stickyHeaderRowsUpdated(e)}stickyFooterRowsUpdated(e){this._footerRowStickyUpdates.next(e),this._positionListener?.stickyFooterRowsUpdated(e)}_outletAssigned(){!this._hasAllOutlets&&this._rowOutlet&&this._headerRowOutlet&&this._footerRowOutlet&&this._noDataRowOutlet&&(this._hasAllOutlets=!0,this._canRender()&&this._render())}_canRender(){return this._hasAllOutlets&&this._hasInitialized}_render(){this._cacheRowDefs(),this._cacheColumnDefs(),!this._headerRowDefs.length&&!this._footerRowDefs.length&&this._rowDefs.length;let t=this._renderUpdatedColumns()||this._headerRowDefChanged||this._footerRowDefChanged;this._stickyColumnStylesNeedReset=this._stickyColumnStylesNeedReset||t,this._forceRecalculateCellWidths=t,this._headerRowDefChanged&&(this._forceRenderHeaderRows(),this._headerRowDefChanged=!1),this._footerRowDefChanged&&(this._forceRenderFooterRows(),this._footerRowDefChanged=!1),this.dataSource&&this._rowDefs.length>0&&!this._renderChangeSubscription?this._observeRenderChanges():this._stickyColumnStylesNeedReset&&this.updateStickyColumnStyles(),this._checkStickyStates()}_getAllRenderRows(){if(!Array.isArray(this._data)||!this._renderedRange)return[];let e=[],t=Math.min(this._data.length,this._renderedRange.end),r=this._cachedRenderRowsMap;this._cachedRenderRowsMap=/* @__PURE__ */ new Map;for(let a=this._renderedRange.start;a<t;a++){let i=this._data[a],s=this._getRenderRowsForData(i,a,r.get(i));this._cachedRenderRowsMap.has(i)||this._cachedRenderRowsMap.set(i,/* @__PURE__ */ new WeakMap);for(let l=0;l<s.length;l++){let d=s[l],m=this._cachedRenderRowsMap.get(d.data);m.has(d.rowDef)?m.get(d.rowDef).push(d):m.set(d.rowDef,[d]),e.push(d)}}return e}_getRenderRowsForData(e,t,r){return this._getRowDefs(e,t).map(i=>{let s=r&&r.has(i)?r.get(i):[];if(s.length){let l=s.shift();return l.dataIndex=t,l}else return{data:e,rowDef:i,dataIndex:t}})}_cacheColumnDefs(){this._columnDefsByName.clear(),ae(this._getOwnDefs(this._contentColumnDefs),this._customColumnDefs).forEach(t=>{this._columnDefsByName.has(t.name),this._columnDefsByName.set(t.name,t)})}_cacheRowDefs(){this._headerRowDefs=ae(this._getOwnDefs(this._contentHeaderRowDefs),this._customHeaderRowDefs),this._footerRowDefs=ae(this._getOwnDefs(this._contentFooterRowDefs),this._customFooterRowDefs),this._rowDefs=ae(this._getOwnDefs(this._contentRowDefs),this._customRowDefs);let e=this._rowDefs.filter(t=>!t.when);this._defaultRowDef=e[0]}_renderUpdatedColumns(){let e=(i,s)=>{let l=!!s.getColumnsDiff();return i||l},t=this._rowDefs.reduce(e,!1);t&&this._forceRenderDataRows();let r=this._headerRowDefs.reduce(e,!1);r&&this._forceRenderHeaderRows();let a=this._footerRowDefs.reduce(e,!1);return a&&this._forceRenderFooterRows(),t||r||a}_switchDataSource(e){this._data=[],Oe(this.dataSource)&&this.dataSource.disconnect(this),this._renderChangeSubscription&&(this._renderChangeSubscription.unsubscribe(),this._renderChangeSubscription=null),e||(this._dataDiffer&&this._dataDiffer.diff([]),this._rowOutlet&&this._rowOutlet.viewContainer.clear()),this._dataSource=e}_observeRenderChanges(){if(!this.dataSource)return;let e;Oe(this.dataSource)?e=this.dataSource.connect(this):dg(this.dataSource)?e=this.dataSource:Array.isArray(this.dataSource)&&(e=og(this.dataSource)),this._renderChangeSubscription=Eg([e,this.viewChange]).pipe(jg(this._onDestroy)).subscribe(([t,r])=>{this._data=t||[],this._renderedRange=r,this._dataStream.next(t),this.renderRows()})}_forceRenderHeaderRows(){this._headerRowOutlet.viewContainer.length>0&&this._headerRowOutlet.viewContainer.clear(),this._headerRowDefs.forEach((e,t)=>this._renderRow(this._headerRowOutlet,e,t)),this.updateStickyHeaderRowStyles()}_forceRenderFooterRows(){this._footerRowOutlet.viewContainer.length>0&&this._footerRowOutlet.viewContainer.clear(),this._footerRowDefs.forEach((e,t)=>this._renderRow(this._footerRowOutlet,e,t)),this.updateStickyFooterRowStyles()}_addStickyColumnStyles(e,t){let r=Array.from(t?.columns||[]).map(s=>{let l=this._columnDefsByName.get(s);if(!l)throw qe(s);return l}),a=r.map(s=>s.sticky),i=r.map(s=>s.stickyEnd);this._stickyStyler.updateStickyColumns(e,a,i,!this.fixedLayout||this._forceRecalculateCellWidths)}_getRenderedRows(e){let t=[];for(let r=0;r<e.viewContainer.length;r++){let a=e.viewContainer.get(r);t.push(a.rootNodes[0])}return t}_getRowDefs(e,t){if(this._rowDefs.length===1)return[this._rowDefs[0]];let r=[];if(this.multiTemplateDataRows)r=this._rowDefs.filter(a=>!a.when||a.when(t,e));else{let a=this._rowDefs.find(i=>i.when&&i.when(t,e))||this._defaultRowDef;a&&r.push(a)}return r.length,r}_getEmbeddedViewArgs(e,t){let r=e.rowDef,a={$implicit:e.data};return{templateRef:r.template,context:a,index:t}}_renderRow(e,t,r,a={}){let i=e.viewContainer.createEmbeddedView(t.template,a,r);return this._renderCellTemplateForItem(t,a),i}_renderCellTemplateForItem(e,t){for(let r of this._getCellTemplates(e))A.mostRecentCellOutlet&&A.mostRecentCellOutlet._viewContainer.createEmbeddedView(r,t);this._changeDetectorRef.markForCheck()}_updateRowIndexContext(){let e=this._rowOutlet.viewContainer;for(let t=0,r=e.length;t<r;t++){let i=e.get(t).context;i.count=r,i.first=t===0,i.last=t===r-1,i.even=t%2===0,i.odd=!i.even,this.multiTemplateDataRows?(i.dataIndex=this._renderRows[t].dataIndex,i.renderIndex=t):i.index=this._renderRows[t].dataIndex}}_getCellTemplates(e){return!e||!e.columns?[]:Array.from(e.columns,t=>{let r=this._columnDefsByName.get(t);if(!r)throw qe(t);return e.extractCellTemplate(r)})}_forceRenderDataRows(){this._dataDiffer.diff([]),this._rowOutlet.viewContainer.clear(),this.renderRows()}_checkStickyStates(){let e=(t,r)=>t||r.hasStickyChanged();this._headerRowDefs.reduce(e,!1)&&this.updateStickyHeaderRowStyles(),this._footerRowDefs.reduce(e,!1)&&this.updateStickyFooterRowStyles(),Array.from(this._columnDefsByName.values()).reduce(e,!1)&&(this._stickyColumnStylesNeedReset=!0,this.updateStickyColumnStyles())}_setupStickyStyler(){let e=this._dir?this._dir.value:`ltr`,t=this._injector;this._stickyStyler=new he(this._isNativeHtmlTable,this.stickyCssClass,this._platform.isBrowser,this.needsPositionStickyOnElement,e,this,t),(this._dir?this._dir.change:og()).pipe(jg(this._onDestroy)).subscribe(r=>{this._stickyStyler.direction=r,this.updateStickyColumnStyles()})}_setupVirtualScrolling(e){let t=typeof requestAnimationFrame<`u`?lg:cg;this.viewChange.next({start:0,end:0}),e.renderedRangeStream.pipe(Ng(0,t),jg(this._onDestroy)).subscribe(this.viewChange),e.attach({dataStream:this._dataStream,measureRangeSize:(r,a)=>this._measureRangeSize(r,a)}),Eg([e.renderedContentOffset,this._headerRowStickyUpdates]).pipe(jg(this._onDestroy)).subscribe(([r,a])=>{if(!(!a.sizes||!a.offsets||!a.elements))for(let i=0;i<a.elements.length;i++){let s=a.elements[i];if(s){let l=a.offsets[i],d=r!==0?Math.max(r-l,l):-l;for(let m of s)m.style.top=`${-d}px`}}}),Eg([e.renderedContentOffset,this._footerRowStickyUpdates]).pipe(jg(this._onDestroy)).subscribe(([r,a])=>{if(!(!a.sizes||!a.offsets||!a.elements))for(let i=0;i<a.elements.length;i++){let s=a.elements[i];if(s)for(let l of s)l.style.bottom=`${r+a.offsets[i]}px`}})}_getOwnDefs(e){return e.filter(t=>!t._table||t._table===this)}_updateNoDataRow(){let e=this._customNoDataRow||this._noDataRow;if(!e)return;let t=this._rowOutlet.viewContainer.length===0;if(t===this._isShowingNoDataRow)return;let r=this._noDataRowOutlet.viewContainer;if(t){let a=r.createEmbeddedView(e.templateRef),i=a.rootNodes[0];if(a.rootNodes.length===1&&i?.nodeType===this._document.ELEMENT_NODE){i.setAttribute(`role`,`row`),i.classList.add(...e._contentClassNames);let s=i.querySelectorAll(e._cellSelector);for(let l=0;l<s.length;l++)s[l].classList.add(...e._cellClassNames)}}else r.clear();this._isShowingNoDataRow=t,this._changeDetectorRef.markForCheck()}_measureRangeSize(e,t){if(e.start>=e.end||t!==`vertical`)return 0;let r=this.viewChange.value,a=this._rowOutlet.viewContainer;e.start<r.start||(e.end,r.end);let i=e.start-r.start,s=e.end-e.start,l,d;for(let h=0;h<s;h++){let p=a.get(h+i);if(p&&p.rootNodes.length){l=d=p.rootNodes[0];break}}for(let h=s-1;h>-1;h--){let p=a.get(h+i);if(p&&p.rootNodes.length){d=p.rootNodes[p.rootNodes.length-1];break}}let m=l?.getBoundingClientRect?.(),f=d?.getBoundingClientRect?.();return m&&f?f.bottom-m.top:0}_virtualScrollEnabled(){return!this._disableVirtualScrolling&&this._virtualScrollViewport!=null}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[[[`caption`]],[[`colgroup`],[`col`]],`*`],t=[`caption`,`colgroup, col`,`*`];function r(s,l){s&1&&yD(0,2)}function a(s,l){s&1&&(yi(0,`thead`,0),Xp(1,1),Hc(),yi(2,`tbody`,0),Xp(3,2)(4,3),Hc(),yi(5,`tfoot`,0),Xp(6,4),Hc())}function i(s,l){s&1&&Xp(0,1)(1,2)(2,3)(3,4)}return wE({type:n,selectors:[[`cdk-table`],[`table`,`cdk-table`,``]],contentQueries:function(l,d,m){if(l&1&&ih(m,tt,5)(m,X,5)(m,le,5)(m,q,5)(m,ge,5),l&2){let f;ID(f=ED())&&(d._noDataRow=f.first),ID(f=ED())&&(d._contentColumnDefs=f),ID(f=ED())&&(d._contentRowDefs=f),ID(f=ED())&&(d._contentHeaderRowDefs=f),ID(f=ED())&&(d._contentFooterRowDefs=f)}},hostAttrs:[1,`cdk-table`],hostVars:2,hostBindings:function(l,d){l&2&&hh(`cdk-table-fixed-layout`,d.fixedLayout)},inputs:{trackBy:`trackBy`,dataSource:`dataSource`,multiTemplateDataRows:[2,`multiTemplateDataRows`,`multiTemplateDataRows`,y0],fixedLayout:[2,`fixedLayout`,`fixedLayout`,y0],recycleRows:[2,`recycleRows`,`recycleRows`,y0]},outputs:{contentChanged:`contentChanged`},exportAs:[`cdkTable`],features:[rw([{provide:D,useExisting:n},{provide:$,useValue:null}])],ngContentSelectors:t,decls:5,vars:2,consts:[[`role`,`rowgroup`],[`headerRowOutlet`,``],[`rowOutlet`,``],[`noDataRowOutlet`,``],[`footerRowOutlet`,``]],template:function(l,d){l&1&&(mD(e),yD(0),yD(1,1),QE(2,r,1,0),QE(3,a,7,0)(4,i,4,0)),l&2&&(Wv(2),YE(d._isServer?2:-1),Wv(),YE(d._isNativeHtmlTable?3:4))},dependencies:[be,we,De,Ce],styles:[`.cdk-table-fixed-layout {
  table-layout: fixed;
}
`],encapsulation:2,changeDetection:1})})()}return n})();function ae(n,o){return n.concat(Array.from(o))}function Ke(n,o){let e=o.toUpperCase(),t=n.viewContainer.element.nativeElement;for(;t;){let r=t.nodeType===1?t.nodeName:null;if(r===e)return t;if(r===`TABLE`)break;t=t.parentNode}return null}var nt=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=CE({type:n});static ɵinj=Xl({imports:[Ct]})}return n})();var Wt=(()=>{class n extends ve{stickyCssClass=`mat-mdc-table-sticky`;needsPositionStickyOnElement=!1;static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵcmp=(function(){let e=[[[`caption`]],[[`colgroup`],[`col`]],`*`],t=[`caption`,`colgroup, col`,`*`];function r(s,l){s&1&&yD(0,2)}function a(s,l){s&1&&(yi(0,`thead`,0),Xp(1,1),Hc(),yi(2,`tbody`,2),Xp(3,3)(4,4),Hc(),yi(5,`tfoot`,0),Xp(6,5),Hc())}function i(s,l){s&1&&Xp(0,1)(1,3)(2,4)(3,5)}return wE({type:n,selectors:[[`mat-table`],[`table`,`mat-table`,``]],hostAttrs:[1,`mat-mdc-table`,`mdc-data-table__table`],hostVars:2,hostBindings:function(l,d){l&2&&hh(`mat-table-fixed-layout`,d.fixedLayout)},exportAs:[`matTable`],features:[rw([{provide:ve,useExisting:n},{provide:D,useExisting:n},{provide:$,useValue:null}]),Bp],ngContentSelectors:t,decls:5,vars:2,consts:[[`role`,`rowgroup`],[`headerRowOutlet`,``],[`role`,`rowgroup`,1,`mdc-data-table__content`],[`rowOutlet`,``],[`noDataRowOutlet`,``],[`footerRowOutlet`,``]],template:function(l,d){l&1&&(mD(e),yD(0),yD(1,1),QE(2,r,1,0),QE(3,a,7,0)(4,i,4,0)),l&2&&(Wv(2),YE(d._isServer?2:-1),Wv(),YE(d._isNativeHtmlTable?3:4))},dependencies:[be,we,De,Ce],styles:[`.mat-mdc-table-sticky {
  position: sticky !important;
}

mat-table {
  display: block;
}

mat-header-row {
  min-height: var(--%NS%mat-table-header-container-height, 56px);
}

mat-row {
  min-height: var(--%NS%mat-table-row-item-container-height, 52px);
}

mat-footer-row {
  min-height: var(--%NS%mat-table-footer-container-height, 52px);
}

mat-row, mat-header-row, mat-footer-row {
  display: flex;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  align-items: center;
  box-sizing: border-box;
}

mat-cell:first-of-type, mat-header-cell:first-of-type, mat-footer-cell:first-of-type {
  padding-left: 24px;
}
[dir=rtl] mat-cell:first-of-type:not(:only-of-type), [dir=rtl] mat-header-cell:first-of-type:not(:only-of-type), [dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type) {
  padding-left: 0;
  padding-right: 24px;
}
mat-cell:last-of-type, mat-header-cell:last-of-type, mat-footer-cell:last-of-type {
  padding-right: 24px;
}
[dir=rtl] mat-cell:last-of-type:not(:only-of-type), [dir=rtl] mat-header-cell:last-of-type:not(:only-of-type), [dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type) {
  padding-right: 0;
  padding-left: 24px;
}

mat-cell, mat-header-cell, mat-footer-cell {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  word-wrap: break-word;
  min-height: inherit;
}

.mat-mdc-table {
  min-width: 100%;
  border: 0;
  border-spacing: 0;
  table-layout: auto;
  white-space: normal;
  background-color: var(--%NS%mat-table-background-color, var(--%NS%mat-sys-surface));
}

.mat-table-fixed-layout {
  table-layout: fixed;
}

.mdc-data-table__cell {
  box-sizing: border-box;
  overflow: hidden;
  text-align: start;
  text-overflow: ellipsis;
}

.mdc-data-table__cell,
.mdc-data-table__header-cell {
  padding: 0 16px;
}

.mat-mdc-header-row {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  height: var(--%NS%mat-table-header-container-height, 56px);
  color: var(--%NS%mat-table-header-headline-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--%NS%mat-table-header-headline-font, var(--%NS%mat-sys-title-small-font, Roboto, sans-serif));
  line-height: var(--%NS%mat-table-header-headline-line-height, var(--%NS%mat-sys-title-small-line-height));
  font-size: var(--%NS%mat-table-header-headline-size, var(--%NS%mat-sys-title-small-size, 14px));
  font-weight: var(--%NS%mat-table-header-headline-weight, var(--%NS%mat-sys-title-small-weight, 500));
}

.mat-mdc-row {
  height: var(--%NS%mat-table-row-item-container-height, 52px);
  color: var(--%NS%mat-table-row-item-label-text-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
}

.mat-mdc-row,
.mdc-data-table__content {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-table-row-item-label-text-font, var(--%NS%mat-sys-body-medium-font, Roboto, sans-serif));
  line-height: var(--%NS%mat-table-row-item-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-table-row-item-label-text-size, var(--%NS%mat-sys-body-medium-size, 14px));
  font-weight: var(--%NS%mat-table-row-item-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}

.mat-mdc-footer-row {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  height: var(--%NS%mat-table-footer-container-height, 52px);
  color: var(--%NS%mat-table-row-item-label-text-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--%NS%mat-table-footer-supporting-text-font, var(--%NS%mat-sys-body-medium-font, Roboto, sans-serif));
  line-height: var(--%NS%mat-table-footer-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-table-footer-supporting-text-size, var(--%NS%mat-sys-body-medium-size, 14px));
  font-weight: var(--%NS%mat-table-footer-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight));
  letter-spacing: var(--%NS%mat-table-footer-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
}

.mat-mdc-header-cell {
  border-bottom-color: var(--%NS%mat-table-row-item-outline-color, var(--%NS%mat-sys-outline, rgba(0, 0, 0, 0.12)));
  border-bottom-width: var(--%NS%mat-table-row-item-outline-width, 1px);
  border-bottom-style: solid;
  letter-spacing: var(--%NS%mat-table-header-headline-tracking, var(--%NS%mat-sys-title-small-tracking));
  font-weight: inherit;
  line-height: inherit;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
  outline: none;
  text-align: start;
}
.mdc-data-table__row:last-child > .mat-mdc-header-cell {
  border-bottom: none;
}

.mat-mdc-cell {
  border-bottom-color: var(--%NS%mat-table-row-item-outline-color, var(--%NS%mat-sys-outline, rgba(0, 0, 0, 0.12)));
  border-bottom-width: var(--%NS%mat-table-row-item-outline-width, 1px);
  border-bottom-style: solid;
  letter-spacing: var(--%NS%mat-table-row-item-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  line-height: inherit;
}
.mdc-data-table__row:last-child > .mat-mdc-cell {
  border-bottom: none;
}

.mat-mdc-footer-cell {
  letter-spacing: var(--%NS%mat-table-row-item-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
}

mat-row.mat-mdc-row,
mat-header-row.mat-mdc-header-row,
mat-footer-row.mat-mdc-footer-row {
  border-bottom: none;
}

.mat-mdc-table tbody,
.mat-mdc-table tfoot,
.mat-mdc-table thead,
.mat-mdc-cell,
.mat-mdc-footer-cell,
.mat-mdc-header-row,
.mat-mdc-row,
.mat-mdc-footer-row,
.mat-mdc-table .mat-mdc-header-cell {
  background: inherit;
}

.mat-mdc-table mat-header-row.mat-mdc-header-row,
.mat-mdc-table mat-row.mat-mdc-row,
.mat-mdc-table mat-footer-row.mat-mdc-footer-cell {
  height: unset;
}

mat-header-cell.mat-mdc-header-cell,
mat-cell.mat-mdc-cell,
mat-footer-cell.mat-mdc-footer-cell {
  align-self: stretch;
}
`],encapsulation:2,changeDetection:1})})()}return n})();var Qt=(()=>{class n extends oe{static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[``,`matCellDef`,``]],features:[rw([{provide:oe,useExisting:n}]),Bp]})}return n})();var $t=(()=>{class n extends se{static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[``,`matHeaderCellDef`,``]],features:[rw([{provide:se,useExisting:n}]),Bp]})}return n})();var qt=(()=>{class n extends X{get name(){return this._name}set name(e){this._setNameInput(e)}_updateColumnCssClassName(){super._updateColumnCssClassName(),this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`)}static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[``,`matColumnDef`,``]],inputs:{name:[0,`matColumnDef`,`name`]},features:[rw([{provide:X,useExisting:n}]),Bp]})}return n})();var Kt=(()=>{class n extends Je{static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[`mat-header-cell`],[`th`,`mat-header-cell`,``]],hostAttrs:[`role`,`columnheader`,1,`mat-mdc-header-cell`,`mdc-data-table__header-cell`],features:[Bp]})}return n})();var Gt=(()=>{class n extends et{static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[`mat-cell`],[`td`,`mat-cell`,``]],hostAttrs:[1,`mat-mdc-cell`,`mdc-data-table__cell`],features:[Bp]})}return n})();var Zt=(()=>{class n extends q{static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[``,`matHeaderRowDef`,``]],inputs:{columns:[0,`matHeaderRowDef`,`columns`],sticky:[2,`matHeaderRowDefSticky`,`sticky`,y0]},features:[rw([{provide:q,useExisting:n}]),Bp]})}return n})();var Yt=(()=>{class n extends le{static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵdir=NE({type:n,selectors:[[``,`matRowDef`,``]],inputs:{columns:[0,`matRowDefColumns`,`columns`],when:[0,`matRowDefWhen`,`when`]},features:[rw([{provide:le,useExisting:n}]),Bp]})}return n})();var Jt=(()=>{class n extends ye{static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵcmp=wE({type:n,selectors:[[`mat-header-row`],[`tr`,`mat-header-row`,``]],hostAttrs:[`role`,`row`,1,`mat-mdc-header-row`,`mdc-data-table__header-row`],exportAs:[`matHeaderRow`],features:[rw([{provide:ye,useExisting:n}]),Bp],decls:1,vars:0,consts:[[`cdkCellOutlet`,``]],template:function(t,r){t&1&&Xp(0,0)},dependencies:[A],encapsulation:2,changeDetection:1})}return n})();var en=(()=>{class n extends _e{static ɵfac=(()=>{let e;return function(r){return(e||(e=cy(n)))(r||n)}})();static ɵcmp=wE({type:n,selectors:[[`mat-row`],[`tr`,`mat-row`,``]],hostAttrs:[`role`,`row`,1,`mat-mdc-row`,`mdc-data-table__row`],exportAs:[`matRow`],features:[rw([{provide:_e,useExisting:n}]),Bp],decls:1,vars:0,consts:[[`cdkCellOutlet`,``]],template:function(t,r){t&1&&Xp(0,0)},dependencies:[A],encapsulation:2,changeDetection:1})}return n})();var tn=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=CE({type:n});static ɵinj=Xl({imports:[nt,at]})}return n})();var mt=new S(`MAT_PROGRESS_BAR_DEFAULT_OPTIONS`);var un=(()=>{class n{_elementRef=_(Cr);_ngZone=_(Me);_changeDetectorRef=_(g0);_renderer=_($a);_cleanupTransitionEnd;constructor(){let e=ii(),t=_(mt,{optional:!0});this._isNoopAnimation=e===`di-disabled`,e===`reduced-motion`&&this._elementRef.nativeElement.classList.add(`mat-progress-bar-reduced-motion`),t&&(t.color&&(this.color=this._defaultColor=t.color),this.mode=t.mode||this.mode)}_isNoopAnimation;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor=`primary`;get value(){return this._value}set value(e){this._value=rt(e||0),this._changeDetectorRef.markForCheck()}_value=0;get bufferValue(){return this._bufferValue||0}set bufferValue(e){this._bufferValue=rt(e||0),this._changeDetectorRef.markForCheck()}_bufferValue=0;animationEnd=new Fe;get mode(){return this._mode}set mode(e){this._mode=e,this._changeDetectorRef.markForCheck()}_mode=`determinate`;ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._cleanupTransitionEnd=this._renderer.listen(this._elementRef.nativeElement,`transitionend`,this._transitionendHandler)})}ngOnDestroy(){this._cleanupTransitionEnd?.()}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode===`buffer`?this.bufferValue:100}%`}_isIndeterminate(){return this.mode===`indeterminate`||this.mode===`query`}_transitionendHandler=e=>{this.animationEnd.observers.length===0||!e.target||!e.target.classList.contains(`mdc-linear-progress__primary-bar`)||(this.mode===`determinate`||this.mode===`buffer`)&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))};static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){function e(t,r){t&1&&Kp(0,`div`,2)}return wE({type:n,selectors:[[`mat-progress-bar`]],hostAttrs:[`role`,`progressbar`,`aria-valuemin`,`0`,`aria-valuemax`,`100`,`tabindex`,`-1`,1,`mat-mdc-progress-bar`,`mdc-linear-progress`],hostVars:10,hostBindings:function(r,a){r&2&&(Qp(`aria-valuenow`,a._isIndeterminate()?null:a.value)(`mode`,a.mode),FD(`mat-`+a.color),hh(`_mat-animation-noopable`,a._isNoopAnimation)(`mdc-linear-progress--animation-ready`,!a._isNoopAnimation)(`mdc-linear-progress--indeterminate`,a._isIndeterminate()))},inputs:{color:`color`,value:[2,`value`,`value`,v0],bufferValue:[2,`bufferValue`,`bufferValue`,v0],mode:`mode`},outputs:{animationEnd:`animationEnd`},exportAs:[`matProgressBar`],decls:7,vars:5,consts:[[`aria-hidden`,`true`,1,`mdc-linear-progress__buffer`],[1,`mdc-linear-progress__buffer-bar`],[1,`mdc-linear-progress__buffer-dots`],[`aria-hidden`,`true`,1,`mdc-linear-progress__bar`,`mdc-linear-progress__primary-bar`],[1,`mdc-linear-progress__bar-inner`],[`aria-hidden`,`true`,1,`mdc-linear-progress__bar`,`mdc-linear-progress__secondary-bar`]],template:function(r,a){r&1&&(Bc(0,`div`,0),Kp(1,`div`,1),QE(2,e,1,0,`div`,2),$c(),Bc(3,`div`,3),Kp(4,`span`,4),$c(),Bc(5,`div`,5),Kp(6,`span`,4),$c()),r&2&&(Wv(),ph(`flex-basis`,a._getBufferBarFlexBasis()),Wv(),YE(a.mode===`buffer`?2:-1),Wv(),ph(`transform`,a._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar {
  --%NS%mat-progress-bar-animation-multiplier: 1;
  display: block;
  text-align: start;
}
.mat-mdc-progress-bar[mode=query] {
  transform: scaleX(-1);
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner {
  animation: none;
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar {
  transition: transform 1ms;
}

.mat-progress-bar-reduced-motion {
  --%NS%mat-progress-bar-animation-multiplier: 2;
}

.mdc-linear-progress {
  position: relative;
  width: 100%;
  transform: translateZ(0);
  outline: 1px solid transparent;
  overflow-x: hidden;
  transition: opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: max(var(--%NS%mat-progress-bar-track-height, 4px), var(--%NS%mat-progress-bar-active-indicator-height, 4px));
}
@media (forced-colors: active) {
  .mdc-linear-progress {
    outline-color: CanvasText;
  }
}

.mdc-linear-progress__bar {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  animation: none;
  transform-origin: top left;
  transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: var(--%NS%mat-progress-bar-active-indicator-height, 4px);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__bar {
  transition: none;
}
[dir=rtl] .mdc-linear-progress__bar {
  right: 0;
  transform-origin: center right;
}

.mdc-linear-progress__bar-inner {
  display: inline-block;
  position: absolute;
  width: 100%;
  animation: none;
  border-top-style: solid;
  border-color: var(--%NS%mat-progress-bar-active-indicator-color, var(--%NS%mat-sys-primary));
  border-top-width: var(--%NS%mat-progress-bar-active-indicator-height, 4px);
}

.mdc-linear-progress__buffer {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  overflow: hidden;
  height: var(--%NS%mat-progress-bar-track-height, 4px);
  border-radius: var(--%NS%mat-progress-bar-track-shape, var(--%NS%mat-sys-corner-none));
}

.mdc-linear-progress__buffer-dots {
  background-image: radial-gradient(circle, var(--%NS%mat-progress-bar-track-color, var(--%NS%mat-sys-surface-variant)) calc(var(--%NS%mat-progress-bar-track-height, 4px) / 2), transparent 0);
  background-repeat: repeat-x;
  background-size: calc(calc(var(--%NS%mat-progress-bar-track-height, 4px) / 2) * 5);
  background-position: left;
  flex: auto;
  transform: rotate(180deg);
  animation: mdc-linear-progress-buffering calc(250ms * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
@media (forced-colors: active) {
  .mdc-linear-progress__buffer-dots {
    background-color: ButtonBorder;
  }
}
[dir=rtl] .mdc-linear-progress__buffer-dots {
  animation: mdc-linear-progress-buffering-reverse calc(250ms * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
  transform: rotate(0);
}

.mdc-linear-progress__buffer-bar {
  flex: 0 1 100%;
  transition: flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  background-color: var(--%NS%mat-progress-bar-track-color, var(--%NS%mat-sys-surface-variant));
}

.mdc-linear-progress__primary-bar {
  transform: scaleX(0);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  left: -145.166611%;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation: mdc-linear-progress-primary-indeterminate-translate calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-primary-indeterminate-scale calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation-name: mdc-linear-progress-primary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  right: -145.166611%;
  left: auto;
}

.mdc-linear-progress__secondary-bar {
  display: none;
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  left: -54.888891%;
  display: block;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation: mdc-linear-progress-secondary-indeterminate-translate calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-secondary-indeterminate-scale calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation-name: mdc-linear-progress-secondary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  right: -54.888891%;
  left: auto;
}

@keyframes mdc-linear-progress-buffering {
  from {
    transform: rotate(180deg) translateX(calc(var(--%NS%mat-progress-bar-track-height, 4px) * -2.5));
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(83.67142%);
  }
  100% {
    transform: translateX(200.611057%);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-scale {
  0% {
    transform: scaleX(0.08);
  }
  36.65% {
    animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
    transform: scaleX(0.08);
  }
  69.15% {
    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
    transform: scaleX(0.661479);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(84.386165%);
  }
  100% {
    transform: translateX(160.277782%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-scale {
  0% {
    animation-timing-function: cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);
    transform: scaleX(0.08);
  }
  19.15% {
    animation-timing-function: cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);
    transform: scaleX(0.457104);
  }
  44.15% {
    animation-timing-function: cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);
    transform: scaleX(0.72796);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(-83.67142%);
  }
  100% {
    transform: translateX(-200.611057%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(-37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(-84.386165%);
  }
  100% {
    transform: translateX(-160.277782%);
  }
}
@keyframes mdc-linear-progress-buffering-reverse {
  from {
    transform: translateX(-10px);
  }
}
`],encapsulation:2})})()}return n})();function rt(n,o=0,e=100){return Math.max(o,Math.min(e,n))}var fn=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=CE({type:n});static ɵinj=Xl({imports:[at]})}return n})();export{Qt as a,Zt as c,qt as d,tn as f,Kt as i,en as l,Gt as n,Wt as o,un as p,Jt as r,Yt as s,$t as t,fn as u};