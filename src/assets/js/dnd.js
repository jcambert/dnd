/* eslint-disable */
//@see https://codepen.io/Coding_Journey/pen/YzKpLvE
import { fromEvent } from 'rxjs';
import { takeUntil, mergeMap, flatMap, map, merge, switchMap } from 'rxjs/operators';

(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {

        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get DND.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var DND = require("dnd")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("DND requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    "use strict";
    var self=this;
    var document=window.document;
    var onDragStart = function (evt, ctx) {
        console.log("Drag Start:", evt);
        self.draggedElement=evt.target;
        evt.dataTransfer.setData("text/plain", evt.target.id);
    }
    var onDragEnter = function (evt, ctx) {
        console.log("Drag Enter:", evt);
        if (!evt.target.classList.contains(ctx.dropped)) {
            evt.target.classList.add(ctx.droppablehover);
        }
    }
    var onDragOver = function (evt, ctx) {
        console.log("Drag Over:", evt);
        if (!evt.target.classList.contains(ctx.dropped)) {
            evt.preventDefault(); // Prevent default to allow drop
        }
    }
    var onDragLeave = function (evt, ctx) {
        console.log("Drag Leave:", evt);
        if (!evt.target.classList.contains(ctx.dropped)) {
            evt.target.classList.remove(ctx.droppablehover);
        }
    }
    var onDrop = function (evt,allowDropCb, ctx) {
        console.log("drop:", evt);
        event.preventDefault(); // This is in order to prevent the browser default handling of the data
        event.target.classList.remove(ctx.droppablehover);
        const draggableElementData = event.dataTransfer.getData("text"); // Get the dragged data. This method will return any data that was set to the same type in the setData() method
        const droppableElementData = event.target.getAttribute("data-draggable-id");
        if(allowDropCb(draggableElementData,droppableElementData))
            ctx.onDropped(evt,ctx,draggableElementData,droppableElementData)

    }
    var onDropped=function(evt,ctx,from,to){
        console.log(from,to);
        const draggableElement = document.getElementById(from);
        const droppableElement = document.getElementById(to);
        evt.target.classList.add(ctx.dropped);
        evt.target.style.backgroundColor = window.getComputedStyle(draggableElement).color;
        draggableElement.classList.add(ctx.dragged);
        draggableElement.setAttribute("draggable", "false");
        evt.target.insertAdjacentHTML("afterbegin", `<i class="fas fa-${from}"></i>`);

        droppableElement.setAttribute("draggable", "true");
        console.log("On Dropped",droppableElement);
    

    }
    var version = "1.0.0",
        options = {
            draggable: ".draggable",
            droppable: ".droppable",
            dragged:"dragged",
            dropped: "dropped",
            droppablehover: "droppable-hover",
            onDragStart: onDragStart,
            onDragEnter: onDragEnter,
            onDragOver: onDragOver,
            onDragLeave: onDragLeave,
            onDrop: onDrop,
            onDropped:onDropped
        },
        DND = function (selector, opts) {
            //console.log("DND Constructed");
            if(selector==null ||selector=="undefined")
                selector=document;
            const o = Object.assign({}, options, opts)
            const draggables = selector.querySelectorAll(o.draggable);
            const droppables = selector.querySelectorAll(o.droppable);
            draggables.forEach(d=>d.draggable=true);
            //console.log(draggables);
            const dragStart = fromEvent(draggables, 'dragstart');
            const dragEnter = fromEvent(droppables, 'dragenter');
            const dragOver = fromEvent(droppables, 'dragover');
            const dragLeave = fromEvent(droppables, 'dragleave');
            const drop = fromEvent(droppables, 'drop');

            dragStart.subscribe(evt => o.onDragStart(evt, o));
            dragEnter.subscribe(evt => o.onDragEnter(evt, o));
            dragOver.subscribe(evt => o.onDragOver(evt, o));
            dragLeave.subscribe(evt => o.onDragLeave(evt,o));
            drop.subscribe(evt => o.onDrop(evt,(from,to)=>from==to, o));
        };
    DND.fn = DND.prototype = {
        version: version,
        constructor: DND
    }

    if (typeof noGlobal === "undefined") {
        window.DND = DND;
    }
    return DND;
});

