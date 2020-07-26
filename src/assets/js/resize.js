/* eslint-disable */
import { fromEvent, VirtualTimeScheduler } from 'rxjs';
import { takeUntil, mergeMap, flatMap, map, merge, switchMap, filter, selectMany } from 'rxjs/operators';

function makeEnum(arr) {
    let obj = {};
    for (let val of arr) {
        obj[val] = Symbol(val);
    }
    return Object.freeze(obj);
}
const Directions = ["top", "topleft", "topright", "bottom", "bottomleft", "bottomright", "right", "left"];

class Resizer {

    constructor(parent, wrapper, element, options) {
        this.parent = parent;
        this.wrapper = wrapper;
        this.element = element;
        //console.log("Element client bouding rects 2", this.element.getBoundingClientRect());
        this.options = Object.assign({}, { direction: "right" }, options);
      //  console.log("Resizer option", this.options);
        this.handle = document.createElement("div");
        this.handle.setAttribute('class', 'drag-resize-handlers');
        this.handle.setAttribute('data-direction', this.options.direction);
        this.wrapper.appendChild(this.handle);

        /*if (this.options.debug) {
            console.log("debug");
            this.tooltip = document.createElement("div");
            this.tooltip.setAttribute('class', 'drag-resize-handlers-tooltip');
            this.handle.appendChild(this.tooltip);
        }*/

        this.wrapper.style.top = this.element.style.top;
        this.wrapper.style.left = this.element.style.left;
        this.wrapper.style.width = this.element.style.width;
        this.wrapper.style.height = this.element.style.height;


        this.element.style.position = 'relative';
        this.dimensions = this.element.getBoundingClientRect();

        fromEvent(this.element,"onresize").subscribe(evt=>{
            this.dimensions = this.element.getBoundingClientRect();
            console.log("ON RESIZE");
        });
        const mouseDown = fromEvent(this.handle, 'mousedown');
        const mouseUp = fromEvent(document, 'mouseup');
        const mouseMove = fromEvent(document, 'mousemove');
        const mouseOver = fromEvent(this.handle, 'mouseover');
        //console.log(mouseDown);


        const right = mouseMove.pipe(map((mm) => {
            //mm.preventDefault();
            //console.log("MouseMove", mm);
            return {
                width: mm.clientX - this.dimensions.x
            };
        }),
            takeUntil(mouseUp)

        );
        const bottom = mouseMove.pipe(map((mm) => {
            mm.preventDefault();
            return {
                height: mm.clientY - this.dimensions.y
            };
        }),
            takeUntil(mouseUp)
        );
        const left = mouseMove.pipe(map((mm) => {
            mm.preventDefault();
            return {
                left: mm.clientX,
                width: this.dimensions.x - mm.clientX + this.dimensions.width
            };
        }),
            takeUntil(mouseUp)
        );

        const mouseDrag = mouseDown.pipe(
            flatMap(md => { return left })
        );

        mouseDrag
            .pipe(filter(x => this.options.direction.includes("right")))
            .subscribe(pos => { this.parent.setWidth(pos.width); });

        mouseDrag
            .pipe(filter(x => this.options.direction.includes("bottom")))
            .subscribe(pos => { this.parent.setHeight(pos.height); });

        mouseDrag
            .pipe(filter(x => this.options.direction.includes("left")))
            .subscribe(pos => { this.parent.setLeft(pos.left, pos.width); });

        mouseDrag
            .pipe(filter(x => this.options.direction.includes("top")))
            .subscribe(pos => { this.parent.setTop(pos.top); });

        mouseOver.subscribe(evt => {
            console.log(this.handle.getBoundingClientRect());
        });
    }


}

class Resizable {
    constructor(element, options) {
        this.element = element;
        //console.log("Element client bouding rects", this.element.getBoundingClientRect());
        this.options = Object.assign({}, { minWidth: 10, minHeigth: 10, directions: Directions, debug: false }, options);
        //console.log("Client:",element.getBoundingClientRect());
        this.wrapper = document.createElement("div");
        this.wrapper.setAttribute('class', 'drag-resize');
        if (element.parentNode) {
            element.parentNode.insertBefore(this.wrapper, element);
        }
        this.wrapper.appendChild(element);
        this.resizers = [];
        if (Array.isArray(this.options.directions)) {
            this.options.directions.forEach(d => {
                this.resizers.push(new Resizer(this, this.wrapper, element, Object.assign({ direction: d }, this.options)));
            });
        } else {
            this.resizers.push(new Resizer(this, this.wrapper, element, { direction: this.options.directions }));
        }
        this.dimensions = this.element.getBoundingClientRect();
        let offWrapper = this.wrapper.getBoundingClientRect();

        this.offsets = {
            x: this.dimensions.x - offWrapper.x,
            y: this.dimensions.y - offWrapper.y,
            width: offWrapper.width - this.dimensions.width,
            height: offWrapper.height - this.dimensions.height
        };
        this.offsets.width = this.offsets.width - this.offsets.x;
        this.offsets.height = this.offsets.height - this.offsets.y;
        //console.log(this.dimensions, offWrapper);
        //console.log("offsets", this.offsets);
    }

    setWidth(width) {
        this.element.style.width = `${width - this.offsets.width}px`;
        this.wrapper.style.width = `${width + this.offsets.width}px`;
    }

    setHeight(height) {
        this.element.style.height = `${height - this.offsets.height}px`;
        this.wrapper.style.height = `${height + this.offsets.height}px`;
    }

    setLeft(left, width) {
        if (width < this.options.minWidth) return;
        console.log("Set Left to", left, "with width", width);
        /*this.element.style.left =*/this.wrapper.style.left = `${left}px`;
        this.element.style.width = `${width}px`;
        // this.wrapper.style.width = `${width + this.offsets.width}px`;
    }

    setTop(y) {

    }
}
export default function (element, options) {
    return new Resizable(element, options);
}
export { Directions }