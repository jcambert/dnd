/* eslint-disable */
import { fromEvent, VirtualTimeScheduler, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, mergeMap, flatMap, map, merge, switchMap, filter, selectMany, of, distinctUntilChanged } from 'rxjs/operators';


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
        this.options = Object.assign({}, options);
        //console.log("Resizer option", this.options);
        this.handle = document.createElement("div");
        this.handle.setAttribute('class', 'drag-resize-handlers');
        this.handle.setAttribute('data-direction', this.options.direction);
        this.wrapper.appendChild(this.handle);



        this.wrapper.style.top = this.element.style.top;
        this.wrapper.style.left = this.element.style.left;
        this.wrapper.style.width = this.element.style.width;
        this.wrapper.style.height = this.element.style.height;

        this._activate = new Subject();


        this.element.style.position = 'relative';
        this.dimensions = this.element.getBoundingClientRect();
        //console.log("ORIGINE:", this.dimensions)


        const mouseDown = fromEvent(this.handle, 'mousedown');
        const mouseUp = fromEvent(document, 'mouseup');
        const mouseMove = fromEvent(document, 'mousemove');
        const mouseOver = fromEvent(this.handle, 'mouseover');
        //console.log(mouseDown);

        mouseUp.subscribe(mu => {
            this._activate.next(false);
            this.dimensions = this.element.getBoundingClientRect();
        });

        const left = md => mouseMove.pipe(map((mm) => {
            mm.preventDefault();
            
            const w = this.dimensions.width;
            const offsetx = md.clientX - mm.clientX;
            return {
                left: mm.clientX,
                width: w + offsetx,
                offset: Math.abs(offsetx)
            };
        }),
            takeUntil(mouseUp)
        );

        const right = md => mouseMove.pipe(map((mm) => {
            mm.preventDefault();
            const w = this.dimensions.width;
            const offsetx = md.clientX - mm.clientX;
            return {
                width: w - offsetx,
                offset: Math.abs(offsetx)
            };
        }),
            takeUntil(mouseUp)

        );

        const top = md => mouseMove.pipe(
            map(mm => {
                mm.preventDefault();
                const h = this.dimensions.height;
                const offsety = md.clientY - mm.clientY;
                return {
                    top: mm.clientY,
                    height: h + offsety,
                    offset: Math.abs(offsety)
                }
            })
            ,
            takeUntil(mouseUp)
        );

        const bottom = md => mouseMove.pipe(map((mm) => {
            mm.preventDefault();
            const offsety = md.clientY - mm.clientY;
            const h = this.dimensions.height;
            return {
                height: h - offsety,// mm.clientY - this.dimensions.y
                offset: Math.abs(offsety)
            };
        }),
            takeUntil(mouseUp)
        );


        const mouseDrag = mouseDown.pipe(map(md =>{ 
            this._activate.next(true);
            return md;
        }));
        mouseDrag
            .pipe(filter(x => this.options.direction.includes("right")))
            .pipe(flatMap(md => right(md)))
            .pipe(filter(pos => (pos.offset % this.options.stepX) == 0))
            .subscribe(pos => { this.parent.setWidth(pos.width); });

        mouseDrag
            .pipe(filter(x => this.options.direction.includes("bottom")))
            .pipe(flatMap(md => bottom(md)))
            .pipe(filter(pos => (pos.offset % this.options.stepY) == 0))
            .subscribe(pos => { this.parent.setHeight(pos.height); });

        mouseDrag
            .pipe(filter(x => this.options.direction.includes("left")))
            .pipe(flatMap(md => left(md)))
            .pipe(filter(pos => this.options.minWidth < pos.width))
            .pipe(filter(pos => (pos.offset % this.options.stepX) == 0))
            .subscribe(pos => {
                this.parent.setLeft(pos.left);
                this.parent.setWidth(pos.width);
            });

        mouseDrag
            .pipe(filter(x => this.options.direction.includes("top")))

            .pipe(flatMap(md => top(md)))
            .pipe(filter(pos => this.options.minHeight < pos.height))
            .pipe(filter(pos => (pos.offset % this.options.stepY) == 0))
            .subscribe(pos => {
                this.parent.setTop(pos.top);
                this.parent.setHeight(pos.height)
            });

      

        this._activate/*.pipe(distinctUntilChanged())*/.subscribe(value => {
            console.log("Acgtivate:", value);
            if (value)
                this.handle.classList.add("is-active");
            else
                this.handle.classList.remove("is-active");
        })
    }


}

class Resizable {
    constructor(element, options) {
        this.element = element;
        //console.log("Element client bouding rects", this.element.getBoundingClientRect());
        this.options = Object.assign({}, { stepX: 1, stepY: 1, minWidth: 10, minHeight: 10, directions: Directions, debug: false }, options);
        //console.log(this.options.directions);
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
        if (width < this.options.minWidth) return;
        //console.log("Set width to", width);
        this.element.style.width = `${width }px`;
        this.wrapper.style.width = `${width + this.offsets.width}px`;
    }

    setHeight(height) {
        if (height < this.options.minHeight) return;
        //console.log("Set Height to", height);
        this.element.style.height = `${height }px`;
        this.wrapper.style.height = `${height + this.offsets.height}px`;
    }

    setLeft(left) {
        //console.log("Set Left to", left);
        this.wrapper.style.left = `${left}px`;

        //this.setWidth(width);
        //this.element.style.width = `${width- this.offsets.width}px`;
        //this.wrapper.style.width = `${width + this.offsets.width}px`;
    }

    setTop(top) {

        //console.log("Set Top to", top);
        this.wrapper.style.top = `${top}px`;

        //this.element.style.height = `${height - this.offsets.height}px`;
        //this.wrapper.style.height = `${height + this.offsets.height}px`;
    }
}
export default function (element, options) {
    return new Resizable(element, options);
}
export { Directions }