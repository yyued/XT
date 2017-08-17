import * as I from '../../interface/Abstract'
import { Window } from './Window'
import { View } from './View'
const PIXI = (window as any).PIXI
let sharedApplication: Application | undefined = undefined;
let requestAnimationFrame = (window as any).requestAnimationFrame || (window as any).mozRequestAnimationFrame || (window as any).webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame;
if (requestAnimationFrame === undefined) {
    requestAnimationFrame = (trigger: () => void) => {
        setTimeout(trigger, 16);
    }
}

let displayStartTime: number = 0;

export class Application extends I.Application {

    nativeObject: any;
    keyWindow?: Window = undefined;

    constructor(canvas: HTMLCanvasElement, delegate: I.ApplicationDelegate) {
        super()
        if (sharedApplication === undefined) {
            sharedApplication = this;
            const scale = Math.ceil(window.devicePixelRatio);
            I.Screen.mainScreen = () => {
                return new I.Screen(canvas.offsetWidth, canvas.offsetHeight, scale);
            }
        }
        Application.resetCanvas(canvas, () => {
            this.nativeObject = new PIXI.Application({ width: I.Screen.withScale(canvas.offsetWidth), height: I.Screen.withScale(canvas.offsetHeight), view: canvas, antialias: true, transparent: false });
            this.nativeObject.stop();
            if ((window as any).DEBUG === true) {
                (window as any).nativeObject = this.nativeObject;
                let renderStartTime: number = 0;
                this.nativeObject.renderer.on("prerender", () => {
                    renderStartTime = performance.now();
                });
                this.nativeObject.renderer.on("postrender", () => {
                    console.log("[PIXI]: Render Time > " + (performance.now() - renderStartTime))
                    console.log("[PIXI]: Display Time > " + (performance.now() - displayStartTime))
                });
            }
            this.delegate = delegate;
            if (this.delegate as I.ApplicationDelegate) {
                this.delegate.applicationDidFinishLaunchingWithOptions(this, {});
            }
        })
    }

    static resetCanvas(canvas: HTMLCanvasElement, callback: () => void) {
        canvas.style.width = "375";
        canvas.style.height = document.body.offsetHeight.toString();
        setTimeout(callback);
    }

    static sharedApplication(): Application | undefined {
        return sharedApplication;
    }

    private isDirty = false
    private dirtyTargets: View[] = [];

    public remarkRenderable() {
        if (this.keyWindow !== undefined) {
            const allViews = this.combineViews(this.keyWindow, { x: 0, y: 0 });
            const opaqueRects: I.Rect[] = [];
            for (let index = allViews.length - 1; index >= 0; index--) {
                const view = allViews[index];
                if ((view as any)._childRenderable === true) {
                    view.nativeObject.renderable = true;
                    continue;
                }
                if (view.transform !== undefined) {
                    view.nativeObject.renderable = true;
                }
                else if (opaqueRects.filter(item => I.RectInside(item, (view as any)._absRect)).length == 0) {
                    if (view.opaque === true) {
                        opaqueRects.push((view as any)._absRect);
                    }
                    view.nativeObject.renderable = true;
                }
                else {
                    view.nativeObject.renderable = false;
                }
                if (view.nativeObject.renderable === true) {
                    let current: any = view.superview;
                    while (current !== undefined) {
                        current._childRenderable = true;
                        current = current.superview;
                    }
                }
            }
        }
    }

    private combineViews(view: View, absPoint: { x: number, y: number }): View[] {
        const views = view.subviews;
        view.subviews.forEach(subview => {
            (subview as any)._absRect = { x: absPoint.x + subview.frame.x, y: absPoint.y + subview.frame.y, width: absPoint.x + subview.frame.width, height: absPoint.y + subview.frame.height };
            (view as any)._childRenderable = false;
            (view as any)._frameChanged = false;
        })
        view.subviews.forEach(subview => {
            const subviewss = this.combineViews(subview, { x: absPoint.x + subview.frame.x, y: absPoint.y + subview.frame.y });
            subviewss.forEach(subview => {
                views.push(subview);
            });
        })
        return views;
    }

    public setNeedsDisplay(target: View) {
        if (this.dirtyTargets.indexOf(target) < 0) {
            this.dirtyTargets.push(target);
        }
        if (this.isDirty === true) {
            return;
        }
        this.isDirty = true;
        requestAnimationFrame(() => {
            if ((window as any).DEBUG) {
                displayStartTime = performance.now();
            }
            if (this.dirtyTargets.filter(item => { return item._frameChanged || item.nativeObject.renderable; }).length == 0) {
                this.dirtyTargets.forEach(item => { item._frameChanged = false });
                this.dirtyTargets = [];
                this.isDirty = false;
                return;
            }
            this.remarkRenderable();
            let stillDirty = false;
            for (let index = 0; index < this.dirtyTargets.length; index++) {
                let element = this.dirtyTargets[index];
                if (element.nativeObject.renderable === true) {
                    stillDirty = true;
                    break;
                }
            }
            if (stillDirty) {
                this.nativeObject.render();
            }
            this.dirtyTargets = [];
            this.isDirty = false;
        });
    }

    public displayNow() {
        if ((window as any).DEBUG) {
            displayStartTime = performance.now();
        }
        this.remarkRenderable();
        this.nativeObject.render();
        this.dirtyTargets = [];
    }

}

let displayPaused = false;

export function setNeedsDisplay(target: View) {
    if (sharedApplication !== undefined && displayPaused === false) {
        sharedApplication.setNeedsDisplay(target);
    }
}

export function displayPause() {
    displayPaused = true;
}

export function displayNow() {
    displayPaused = false;
    if (sharedApplication !== undefined) {
        sharedApplication.displayNow();
    }
}