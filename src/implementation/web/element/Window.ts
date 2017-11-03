import { ViewElement } from "./View";
import { Rect } from "../../../interface/Rect";

export class WindowElement extends ViewElement {

    constructor(frame: Rect, scriptObject: any) {
        super(frame, scriptObject)
        this.setupTouches();
    }

    setupTouches() {
        document.addEventListener("touchstart", (e) => {
            this.scriptObject.handlePointerDown(e.which.toString(), e.timeStamp, {x: e.touches[e.which].clientX, y: e.touches[e.which].clientY})
            e.preventDefault()
        })
        document.addEventListener("touchmove", (e) => {
            this.scriptObject.handlePointersMove(e.which.toString(), e.timeStamp, {x: e.changedTouches[e.which].clientX, y: e.changedTouches[e.which].clientY})
            e.preventDefault()
        })
        document.addEventListener("touchend", (e) => {
            this.scriptObject.handlePointerUp(e.which.toString(), e.timeStamp, {x: e.changedTouches[e.which].clientX, y: e.changedTouches[e.which].clientY})
            e.preventDefault()
        })
    }

}