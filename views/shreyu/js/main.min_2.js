/*!
FullCalendar List View Plugin v4.4.2
Docs & License: https://fullcalendar.io/
(c) 2019 Adam Shaw
*/
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("@fullcalendar/core")):"function"==typeof define&&define.amd?define(["exports","@fullcalendar/core"],t):t((e=e||self).FullCalendarList={},e.FullCalendar)}(this,(function(e,t){"use strict";var n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)};function r(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var s=function(e){function n(t){var n=e.call(this)||this;return n.listView=t,n}return r(n,e),n.prototype.attachSegs=function(e){e.length?this.listView.renderSegList(e):this.listView.renderEmptyMessage()},n.prototype.detachSegs=function(){},n.prototype.renderSegHtml=function(e){var n,r=this.context,s=r.theme,o=r.options,i=e.eventRange,a=i.def,l=i.instance,d=i.ui,c=a.url,p=["fc-list-item"].concat(d.classNames),h=d.backgroundColor;return n=a.allDay?t.getAllDayHtml(o):t.isMultiDayRange(i.range)?e.isStart?t.htmlEscape(this._getTimeText(l.range.start,e.end,!1)):e.isEnd?t.htmlEscape(this._getTimeText(e.start,l.range.end,!1)):t.getAllDayHtml(o):t.htmlEscape(this.getTimeText(i)),c&&p.push("fc-has-url"),'<tr class="'+p.join(" ")+'">'+(this.displayEventTime?'<td class="fc-list-item-time '+s.getClass("widgetContent")+'">'+(n||"")+"</td>":"")+'<td class="fc-list-item-marker '+s.getClass("widgetContent")+'"><span class="fc-event-dot"'+(h?' style="background-color:'+h+'"':"")+'></span></td><td class="fc-list-item-title '+s.getClass("widgetContent")+'"><a'+(c?' href="'+t.htmlEscape(c)+'"':"")+">"+t.htmlEscape(a.title||"")+"</a></td></tr>"},n.prototype.computeEventTimeFormat=function(){return{hour:"numeric",minute:"2-digit",meridiem:"short"}},n}(t.FgEventRenderer),o=function(e){function n(n,r){var o=e.call(this,n,r)||this;o.computeDateVars=t.memoize(i),o.eventStoreToSegs=t.memoize(o._eventStoreToSegs),o.renderSkeleton=t.memoizeRendering(o._renderSkeleton,o._unrenderSkeleton);var a=o.eventRenderer=new s(o);return o.renderContent=t.memoizeRendering(a.renderSegs.bind(a),a.unrender.bind(a),[o.renderSkeleton]),o}return r(n,e),n.prototype.firstContext=function(e){e.calendar.registerInteractiveComponent(this,{el:this.el})},n.prototype.render=function(t,n){e.prototype.render.call(this,t,n);var r=this.computeDateVars(t.dateProfile),s=r.dayDates,o=r.dayRanges;this.dayDates=s,this.renderSkeleton(n),this.renderContent(n,this.eventStoreToSegs(t.eventStore,t.eventUiBases,o))},n.prototype.destroy=function(){e.prototype.destroy.call(this),this.renderSkeleton.unrender(),this.renderContent.unrender(),this.context.calendar.unregisterInteractiveComponent(this)},n.prototype._renderSkeleton=function(e){var n=e.theme;this.el.classList.add("fc-list-view");for(var r=0,s=(n.getClass("listView")||"").split(" ");r<s.length;r++){var o=s[r];o&&this.el.classList.add(o)}this.scroller=new t.ScrollComponent("hidden","auto"),this.el.appendChild(this.scroller.el),this.contentEl=this.scroller.el},n.prototype._unrenderSkeleton=function(){this.scroller.destroy()},n.prototype.updateSize=function(t,n,r){e.prototype.updateSize.call(this,t,n,r),this.eventRenderer.computeSizes(t),this.eventRenderer.assignSizes(t),this.scroller.clear(),r||this.scroller.setHeight(this.computeScrollerHeight(n))},n.prototype.computeScrollerHeight=function(e){return e-t.subtractInnerElHeight(this.el,this.scroller.el)},n.prototype._eventStoreToSegs=function(e,n,r){return this.eventRangesToSegs(t.sliceEventStore(e,n,this.props.dateProfile.activeRange,this.context.nextDayThreshold).fg,r)},n.prototype.eventRangesToSegs=function(e,t){for(var n=[],r=0,s=e;r<s.length;r++){var o=s[r];n.push.apply(n,this.eventRangeToSegs(o,t))}return n},n.prototype.eventRangeToSegs=function(e,n){var r,s,o,i=this.context,a=i.dateEnv,l=i.nextDayThreshold,d=e.range,c=e.def.allDay,p=[];for(r=0;r<n.length;r++)if((s=t.intersectRanges(d,n[r]))&&(o={component:this,eventRange:e,start:s.start,end:s.end,isStart:e.isStart&&s.start.valueOf()===d.start.valueOf(),isEnd:e.isEnd&&s.end.valueOf()===d.end.valueOf(),dayIndex:r},p.push(o),!o.isEnd&&!c&&r+1<n.length&&d.end<a.add(n[r+1].start,l))){o.end=d.end,o.isEnd=!0;break}return p},n.prototype.renderEmptyMessage=function(){this.contentEl.innerHTML='<div class="fc-list-empty-wrap2"><div class="fc-list-empty-wrap1"><div class="fc-list-empty">'+t.htmlEscape(this.context.options.noEventsMessage)+"</div></div></div>"},n.prototype.renderSegList=function(e){var n,r,s,o=this.context.theme,i=this.groupSegsByDay(e),a=t.htmlToElement('<table class="fc-list-table '+o.getClass("tableList")+'"><tbody></tbody></table>'),l=a.querySelector("tbody");for(n=0;n<i.length;n++)if(r=i[n])for(l.appendChild(this.buildDayHeaderRow(this.dayDates[n])),r=this.eventRenderer.sortEventSegs(r),s=0;s<r.length;s++)l.appendChild(r[s].el);this.contentEl.innerHTML="",this.contentEl.appendChild(a)},n.prototype.groupSegsByDay=function(e){var t,n,r=[];for(t=0;t<e.length;t++)(r[(n=e[t]).dayIndex]||(r[n.dayIndex]=[])).push(n);return r},n.prototype.buildDayHeaderRow=function(e){var n=this.context,r=n.theme,s=n.dateEnv,o=n.options,i=t.createFormatter(o.listDayFormat),a=t.createFormatter(o.listDayAltFormat);return t.createElement("tr",{className:"fc-list-heading","data-date":s.formatIso(e,{omitTime:!0})},'<td class="'+(r.getClass("tableListHeading")||r.getClass("widgetHeader"))+'" colspan="3">'+(i?t.buildGotoAnchorHtml(o,s,e,{class:"fc-list-heading-main"},t.htmlEscape(s.format(e,i))):"")+(a?t.buildGotoAnchorHtml(o,s,e,{class:"fc-list-heading-alt"},t.htmlEscape(s.format(e,a))):"")+"</td>")},n}(t.View);function i(e){for(var n=t.startOfDay(e.renderRange.start),r=e.renderRange.end,s=[],o=[];n<r;)s.push(n),o.push({start:n,end:t.addDays(n,1)}),n=t.addDays(n,1);return{dayDates:s,dayRanges:o}}o.prototype.fgSegSelector=".fc-list-item";var a=t.createPlugin({views:{list:{class:o,buttonTextKey:"list",listDayFormat:{month:"long",day:"numeric",year:"numeric"}},listDay:{type:"list",duration:{days:1},listDayFormat:{weekday:"long"}},listWeek:{type:"list",duration:{weeks:1},listDayFormat:{weekday:"long"},listDayAltFormat:{month:"long",day:"numeric",year:"numeric"}},listMonth:{type:"list",duration:{month:1},listDayAltFormat:{weekday:"long"}},listYear:{type:"list",duration:{year:1},listDayAltFormat:{weekday:"long"}}}});e.ListView=o,e.default=a,Object.defineProperty(e,"__esModule",{value:!0})}));