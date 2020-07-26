/* eslint-disable */
//@see https://codepen.io/Coding_Journey/pen/YzKpLvE
import { fromEvent } from 'rxjs';
import { takeUntil, mergeMap, flatMap, map, merge, switchMap,filter } from 'rxjs/operators';

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
    var draggedElement=null;
    var document=window.document;
    var root=null;
    function getAttribute(elt,name){
        if(elt==null ||name==null)return null;
        var result=elt.getAttribute(name);
        return (result==null || result=="")?null:result;
    }
    function getDroppableParent(elt,ctx){
        var result=elt;
        try{
            while (result.className.split(" ").indexOf(ctx.droppable) == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
                result = result.parentNode;
            }
        }catch{
            result=null;
        }
        return result;
    }
    var onDragStart = function (evt, ctx) {
       // console.log("Drag Start:", evt);
        draggedElement=evt.target;
        //console.log("ParentNode",draggedElement.parentNode)
        evt.dataTransfer.setData("text/plain", evt.target.id);
    }
    var onDragEnter = function (evt, ctx) {
        //console.log("Drag Enter:", evt);
        if (!evt.target.classList.contains(ctx.dropped)) {
            evt.target.classList.add(ctx.droppablehover);
        }
    }
    var onDragOver = function (evt, ctx) {
        //console.log("Drag Over:", evt);
        if (!evt.target.classList.contains(ctx.dropped)) {
            evt.preventDefault(); // Prevent default to allow drop
        }
    }
    var onDragLeave = function (evt, ctx) {
       // console.log("Drag Leave:", evt);
        if (!evt.target.classList.contains(ctx.dropped)) {
            evt.target.classList.remove(ctx.droppablehover);
        }
    }
    var onDrop = function (evt,allowDropCb, ctx) {
        //console.log("drop:", evt);
        event.stopPropagation(); // This is in order to prevent the browser default handling of the data
        var target = evt.target,source=draggedElement.parentNode,  clonedElement = draggedElement.cloneNode(true); // On créé immédiatement le clone de cet élément
        console.log("source",source.className,"target",target);

        target=getDroppableParent(target,ctx);
        source=getDroppableParent(source,ctx);

        console.log("source",source,"target",target);
        if(source==target){
            console.log("Source==target => voir mode insertion ou invertion")
        }else{
            console.log("drop zone has allready child",target.querySelectorAll(`.${ctx.draggable}`));
            if(ctx.mode=="invert" && target.querySelectorAll(`.${ctx.draggable}`).length>0){
                console.log("inverting");
                
                target.querySelectorAll(`.${ctx.draggable}`).forEach(elt=>draggedElement.parentNode.appendChild(elt));
                
            }
        }
        target.className=`${ctx.droppable}`;
        clonedElement=target.appendChild(clonedElement);
        applyDragEvents(clonedElement,ctx);
        //console.log(draggedElement.parentNode);
        draggedElement.parentNode.removeChild(draggedElement); // Suppression de l'élément d'origine
       


    }
    var onDropped=function(){

        console.log("On Dropped",droppableElement);
    

    }

    var dropFilter = function(evt,ctx){
        //console.log("drop filter",evt.target);
        var result=false;
        var acceptSource=getAttribute(draggedElement,"data-draggable-type");
        var acceptDest=getAttribute(getDroppableParent(evt.target,ctx),"data-draggable-accept");
        //console.log(acceptSource,acceptDest);
        if( acceptSource==null&&acceptDest!=null ) return false;
        result= acceptDest==acceptSource;
        //console.log("Drop Filter result:",result);
        return result;
    }

    function applyDragEvents(element,ctx){
        element.draggable = true;
        //console.log("applyDragEvents",element);

        //console.log(elt)
        fromEvent(element,'dragstart').subscribe(evt => ctx.onDragStart(evt, ctx));
        fromEvent(element, 'dragenter').pipe(filter(evt=>ctx.dropFilter(evt,ctx))).subscribe(evt => ctx.onDragEnter(evt, ctx));
        fromEvent(element, 'dragover').pipe(filter(evt=>ctx.dropFilter(evt,ctx))).subscribe(evt => ctx.onDragOver(evt, ctx));
        fromEvent(element, 'dragleave').subscribe(evt => ctx.onDragLeave(evt, ctx));
        
    }
    var version = "1.0.0",
        options = {
            draggable: "draggable",
            droppable: "droppable",
            dragged:"dragged",
            dropped: "dropped",
            droppablehover: "droppable-hover",
            mode:"invert", // Mode: invert | insert | add
            onDragStart: onDragStart,
            onDragEnter: onDragEnter,
            onDragOver: onDragOver,
            onDragLeave: onDragLeave,
            onDrop: onDrop,
            dropFilter:dropFilter,
            onDropped:onDropped
        },
        DND = function (selector, opts) {
            //console.log("DND Constructed");
            if((typeof selector)==(typeof {})){
                opts=selector;
                selector=null;
            }
            
            if(selector==null ||selector=="undefined")
                selector=document;
            else if((typeof selector)==(typeof "")){
                //console.log(selector);
                selector=document.querySelector(selector);
                //console.log(selector);
            }
            root=selector;
            //console.log(root);
            const o = Object.assign({}, options, opts)
            const draggables = root.querySelectorAll(`.${o.draggable}`);
            const droppables = root.querySelectorAll(`.${o.droppable}`);
            draggables.forEach(d=>d.draggable=true);
            //console.log(draggables);
            const dragStart = fromEvent(draggables, 'dragstart');
            const dragEnter = fromEvent(droppables, 'dragenter').pipe(filter(evt=>o.dropFilter(evt,o)));
            const dragOver = fromEvent(droppables, 'dragover').pipe(filter(evt=>o.dropFilter(evt,o)));
            const dragLeave = fromEvent(droppables, 'dragleave');
            const drop = fromEvent(droppables, 'drop').pipe(filter(evt=>o.dropFilter(evt,o)));

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

