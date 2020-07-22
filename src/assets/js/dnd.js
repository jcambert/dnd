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
    var onDragStart = function (evt, ctx) {
        console.log("Drag Start:", evt);
        evt.dataTransfer.setData("text", evt.target.id);
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
    var onDrop = function (evt, ctx) {
        console.log("drop:", evt);
    }
    var version = "1.0.0",
        options = {
            draggable: ".draggable",
            droppable: ".droppable",
            dropped: "dropped",
            droppablehover: "droppable-hover",
            onDragStart: onDragStart,
            onDragEnter: onDragEnter,
            onDragOver: onDragOver,
            onDragLeave: onDragLeave,
            onDrop: onDrop
        },
        DND = function (selector, opts) {
            //console.log("DND Constructed");
            const o = Object.assign({}, options, opts)
            const draggables = window.document.querySelectorAll(o.draggable);
            const droppables = window.document.querySelectorAll(o.droppable);
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
            drop.subscribe(evt => o.onDrop(evt, o));
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

