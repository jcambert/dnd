
import { fromEvent,  Subject } from 'rxjs';
import { takeUntil,  flatMap, map,  filter } from 'rxjs/operators';
import debug from './debug'
const d = debug({ logInitMessage:"*** Resizable Start ***" ,enable:false});
//d.setEnable(false);

const Directions = ["top", "topleft", "topright", "bottom", "bottomleft", "bottomright", "right", "left"];

class Resizer {

    constructor(parent, wrapper, element, options) {
        this.parent = parent;
        this.wrapper = wrapper;
        this.element = element;
        
        //console.log("Element client bouding rects 2", this.element.getBoundingClientRect());
        this.options = Object.assign({ enable: true }, options);
        //console.log("Resizer option", this.options);
        this.handle = document.createElement("div");
        this.handle.setAttribute('class', 'drag-resize-handlers');
        this.handle.setAttribute('data-direction', this.options.direction);
        this.wrapper.appendChild(this.handle);

        this.setEnable(this.options.enable);

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
        //const mouseOver = fromEvent(this.handle, 'mouseover');
        //console.log(mouseDown);
        mouseUp.subscribe(() => {
            this._activate.next(false);
            this.updateDimensions();
        });

        const left = md => mouseMove.pipe(map((mm) => {
            mm.preventDefault();

            const w = md.dimension.width;
            const offsetx = md.e.clientX - mm.clientX;
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
            //console.log(md);
            const w = md.dimension.width;
            const offsetx = md.e.clientX - mm.clientX;
            var res= {
                width: w - offsetx,
                offset: Math.abs(offsetx)
            };
            d.log(res);
            return res;
        }),
            takeUntil(mouseUp)

        );

        const top = md => mouseMove.pipe(
            map(mm => {
                mm.preventDefault();
                const h = md.dimension.height;
                const offsety = md.e.clientY - mm.clientY;
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
            const h = md.dimension.height;
            const offsety = md.e.clientY - mm.clientY;
            return {
                height: h - offsety,// mm.clientY - this.dimensions.y
                offset: Math.abs(offsety)
            };
        }),
            takeUntil(mouseUp)
        );


        const mouseDrag = mouseDown.pipe(map(md => {
            this._activate.next(true);
            d.log(md);
            return {e:md,dimension:this.element.getBoundingClientRect()};
        }));
        mouseDrag
            .pipe(filter(() => this._enable))
            .pipe(filter(() => this.canStretchRight()))
            .pipe(flatMap(md => right(md)))
            .pipe(filter(pos => (pos.offset % this.options.stepX) == 0))
            .subscribe(pos => { d.log(pos); this.parent.setWidth(pos.width); });

        mouseDrag
            .pipe(filter(() => this._enable))
            .pipe(filter(() => this.canStretchBottom()))
            .pipe(flatMap(md => bottom(md)))
            .pipe(filter(pos => (pos.offset % this.options.stepY) == 0))
            .subscribe(pos => { this.parent.setHeight(pos.height); });

        mouseDrag
            .pipe(filter(() => this._enable))
            .pipe(filter(() => this.canStretchLeft()))
            .pipe(flatMap(md => left(md)))
            .pipe(filter(pos => this.options.minWidth < pos.width))
            .pipe(filter(pos => (pos.offset % this.options.stepX) == 0))
            .subscribe(pos => {
                this.parent.setLeft(pos.left);
                this.parent.setWidth(pos.width);
            });

        mouseDrag
            .pipe(filter(() => this._enable))
            .pipe(filter(() => this.canStretchTop()))
            .pipe(flatMap(md => top(md)))
            .pipe(filter(pos => this.options.minHeight < pos.height))
            .pipe(filter(pos => (pos.offset % this.options.stepY) == 0))
            .subscribe(pos => {
                this.parent.setTop(pos.top);
                this.parent.setHeight(pos.height)
            });



        this._activate/*.pipe(distinctUntilChanged())*/.subscribe(value => {
            d.log("Activate:", value);
            if (value)
                this.handle.classList.add("is-active");
            else
                this.handle.classList.remove("is-active");
        })
    }
    updateDimensions(){
        this.dimensions = this.element.getBoundingClientRect();
    }
    setEnable(value) {
        d.log("set handler value", this.options.direction, " ", value);
        this._enable = value;
        if (value)
            this.handle.classList.remove("disable");
        else
            this.handle.classList.add("disable");
    }
    canStretchRight() {
        return this.options.direction.includes("right");
    }
    canStretchLeft() {
        return this.options.direction.includes("left");
    }
    canStretchTop() {
        return this.options.direction.includes("top");
    }
    canStretchBottom() {
        return this.options.direction.includes("bottom");
    }
}

class Resizable {
    constructor(element, options) {
        this.element = element;
        //console.log("Element client bouding rects", this.element.getBoundingClientRect());
        this.options = Object.assign({}, { stepX: 1, stepY: 1, minWidth: 10, maxWidth: null, minHeight: 10, maxHeight: null, directions: Directions, debug: false }, options);
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
        this._onResizedEvt = new Subject();
        this._onResizedEvt.subscribe(opt => {
            if (this._onResized != null)
                this._onResized(opt);

        });
        this._currentBoundingRect = this.element.getBoundingClientRect();
    }

    _throwResizedEvent() {
        const ww = this.element.getBoundingClientRect();
        if (this._currentBoundingRect.x != ww.x || this._currentBoundingRect.y != ww.y || this._currentBoundingRect.width != ww.width || this._currentBoundingRect.height != ww.height)
            this._onResizedEvt.next({ old: this._currentBoundingRect, new: ww });
        this._currentBoundingRect = this.element.getBoundingClientRect();
        //this.resizers.forEach(r=>r.updateDimensions());
    }

    setWidth(width) {
        if (width < this.options.minWidth) {
            d.log("reach min width");
            return;
        }
        if (this.options.maxWidth!=null && width>this.options.maxWidth){
            d.log("reach max width");
            return;
        }

        d.log("Set width to", width);

        this.element.style.width = `${width}px`;
        this.wrapper.style.width = `${width + this.offsets.width}px`;

        this._throwResizedEvent();
    }

    setHeight(height) {
        if (height < this.options.minHeight) {
            d.log("reach min heigth");
            return;
        }
        if (this.options.maxHeight!=null && height>this.options.maxHeight){
            d.log("reach max height");
            return;
        }
        d.log("Set Height to", height);
        this.element.style.height = `${height}px`;
        this.wrapper.style.height = `${height + this.offsets.height}px`;
        this._throwResizedEvent();
    }

    setLeft(left) {
        d.log("Set Left to", left);
        this.wrapper.style.left = `${left}px`;
        this._throwResizedEvent();
        //this.setWidth(width);
        //this.element.style.width = `${width- this.offsets.width}px`;
        //this.wrapper.style.width = `${width + this.offsets.width}px`;
    }

    setTop(top) {

        d.log("Set Top to", top);
        this.wrapper.style.top = `${top}px`;
        this._throwResizedEvent();
        //this.element.style.height = `${height - this.offsets.height}px`;
        //this.wrapper.style.height = `${height + this.offsets.height}px`;
    }

    onResized(cb) {
        if (!(cb instanceof Function))
            throw new Error("OnResize Callback must be a function");
        this._onResized = cb;
    }
    canStretchRight(value) {
        this.resizers.filter(x => x.canStretchRight()).map(x => x.setEnable(value));
    }
    canStretchLeft(value) { this.resizers.filter(x => x.canStretchLeft()).map(x => x.setEnable(value)); }
    canStretchTop(value) { this.resizers.filter(x => x.canStretchTop()).map(x => x.setEnable(value)); }
    canStretchBottom(value) { this.resizers.filter(x => x.canStretchBottom()).map(x => x.setEnable(value)); }
}
export default function (element, options) {
    return new Resizable(element, options);
}
export { Directions }