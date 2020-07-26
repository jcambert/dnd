import { fromEvent } from 'rxjs';

function defaultPosition(evt){
    return `<p>ScreenX:${evt.screenX}</p><p>ScreenY:${evt.screenY}</p><p>&nbsp;</p><p>ClientX:${evt.clientX}</p><p>ClientY:${evt.clientY}</p><p>&nbsp;</p>`
}
export default function (element,target,cb) {
    element=element==null || element =="undefined"?document:element;
    const mousemove$ = fromEvent(document, 'mousemove');
    cb=cb==null?defaultPosition:cb;
    mousemove$.subscribe(evt=>{
        target.innerHTML=cb(evt);
    })
}