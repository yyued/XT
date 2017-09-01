import { Rect, RectMake, Point, PointMake, Size, RectZero } from '../../interface/Rect'
import { Color } from '../../interface/Color'
import { Window } from './Window'
import { TransformMatrix } from '../../interface/TransformMatrix'
import { LayoutConstraint } from "../../interface/LayoutConstraint";

export enum InteractionState {
    Began,
    Changed,
    Ended,
    Cancelled,
}

export enum SwipeDirection {
    ToLeft,
    ToRight,
    ToTop,
    ToBottom,
}

export class View {

    nativeObject: any;

    constructor(rect?: Rect, nativeObject?: any, _isChild: boolean = false) {
        if (_isChild) { return; }
        if (nativeObject) {
            this.nativeObject = nativeObject;
        }
        else {
            this.nativeObject = XTRView.createScriptObject(rect || RectZero, this);
            (window as any).XTRObjCreater.store(this);
            this.init();
        }
    }

    init() { }

    // Mark: View Geometry

    public get frame(): Rect {
        return this.nativeObject.xtr_frame();
    }

    public set frame(value: Rect) {
        this.nativeObject.xtr_setFrame(value);
    }

    public get bounds(): Rect {
        return { ...this.nativeObject.xtr_frame(), x: 0, y: 0 }
    }

    public set bounds(value: Rect) {
        return;
    }

    public get center() {
        return { x: this.frame.x + this.frame.width / 2.0, y: this.frame.y + this.frame.height / 2.0 }
    }

    public set center(value: Point) {
        const newFrame = { ...this.frame };
        newFrame.x = value.x - newFrame.width / 2.0;
        newFrame.y = value.y - newFrame.height / 2.0;
        this.frame = newFrame;
    }

    transform?: TransformMatrix; // todo

    // Mark: View Rendering

    public get clipsToBounds(): boolean {
        return this.nativeObject.clipChildren;
    }

    public set clipsToBounds(value: boolean) {
        this.nativeObject.setClipChildren(value);
    }

    public get backgroundColor(): Color {
        return this.nativeObject.xtr_backgroundColor();
    }

    public set backgroundColor(value: Color) {
        this.nativeObject.xtr_setBackgroundColor(value);
    }

    public get alpha(): number {
        return this.nativeObject.alpha;
    }

    public set alpha(value: number) {
        this.nativeObject.alpha = value;
    }


    public get opaque(): boolean {
        return this.nativeObject.xtr_opaque();
    }

    public set opaque(value: boolean) {
        this.nativeObject.xtr_setOpaque(value);
    }

    public get hidden(): boolean {
        return this.nativeObject.xtr_hidden();
    }

    public set hidden(value: boolean) {
        this.nativeObject.xtr_setHidden(value);
    }

    contentMode?: any; // todo
    maskView?: View // todo
    tintColor: Color // todo
    tintColorDidChange() { } // todo

    // Mark: View Layer-Back Rendering

    public get cornerRadius(): number {
        return this.nativeObject.cornerRadius;
    }

    public set cornerRadius(value: number) {
        this.nativeObject.cornerRadius = value;
    }

    borderWidth: number; // todo
    borderColor?: Color; // todo
    shadowColor?: Color; // todo
    shadowOpacity: number; // todo
    shadowOffset?: Size; // todo
    shadowRadius: number; // todo

    // Mark: View Hierarchy

    public get tag(): number {
        return this.nativeObject.xtr_tag;
    }

    public set tag(value: number) {
        this.nativeObject.xtr_tag = value;
    }

    public get superview(): View | undefined {
        return this.nativeObject.xtr_superview()
    }

    public get subviews(): View[] {
        return this.nativeObject.xtr_subviews()
    }

    public get window(): Window | undefined {
        return this.nativeObject.xtr_window()
    }

    removeFromSuperview() {
        this.nativeObject.xtr_removeFromSuperview();
    }

    insertSubviewAtIndex(subview: View, atIndex: number) {
        this.nativeObject.xtr_insertSubviewAtIndex(subview, atIndex)
    }

    exchangeSubviewAtIndex(index1: number, index2: number) {
        this.nativeObject.exchangeSubviewAtIndex(index1, index2)
    }

    addSubview(subview: View) {
        this.nativeObject.xtr_addSubview(subview)
    }

    insertSubviewBelow(subview: View, siblingSubview: View) {
        this.nativeObject.xtr_insertSubviewBelow(subview, siblingSubview);
    }

    insertSubviewAbove(subview: View, siblingSubview: View) {
        this.nativeObject.xtr_insertSubviewAbove(subview, siblingSubview);
    }

    bringSubviewToFront(subview: View) {
        this.nativeObject.xtr_bringSubviewToFront(subview)
    }

    sendSubviewToBack(subview: View) {
        this.nativeObject.xtr_sendSubviewToBack(subview)
    }

    didAddSubview(subview: View) { }
    willRemoveSubview(subview: View) { }
    willMoveToSuperview(newSuperview?: View) { }
    didMoveToSuperview() { }
    willMoveToWindow(newWindow?: Window) { }
    didMoveToWindow() { }

    isDescendantOfView(view: View) { return this.nativeObject.xtr_isDescendantOfView(view) }
    viewWithTag(tag: number): View | undefined { return this.nativeObject.xtr_viewWithTag(tag) }

    setNeedsLayout() { this.nativeObject.xtr_setNeedsLayout() }
    layoutIfNeeded() { this.nativeObject.xtr_layoutIfNeeded() }
    layoutSubviews() { }

    // Mark: View LayoutConstraint

    constraints: LayoutConstraint[]
    addConstraint(constraint: LayoutConstraint) { }
    addConstraints(constraints: LayoutConstraint[]) { }
    removeConstraint(constraint: LayoutConstraint) { }
    removeAllConstraints() { }

    // Mark: View Interactive
    static InteractionState = InteractionState
    static SwipeDirection = SwipeDirection
    userInteractionEnabled: boolean;
    longPressDuration: number;
    onTap?: () => void
    onDoubleTap?: () => void
    onLongPress?: (state: InteractionState, viewLocation?: Point, absLocation?: Point) => void
    onPan?: (state: InteractionState, viewLocation?: Point, absLocation?: Point) => void

    // Mark: View Animation
    static animationWithDuration(duration: number, animations: () => void, completion?: () => void) { }
    static animationWithBouncinessAndSpeed(damping: number, velocity: number, animations: () => void, completion?: () => void) { } // iOS NOT Support
    static animationWithDurationDampingVelocity(duration: number, damping: number, velocity: number, animations: () => void, completion?: () => void) { } // iOS Only

}

if ((window as any).XTRObjClasses === undefined) {
    (window as any).XTRObjClasses = [];
}
(window as any).XTRObjClasses.push((view: any) => {
    if (view.toString().indexOf("com.opensource.xtruntime.XTRView$InnerObject") === 0) {
        return new View(undefined, view);
    }
    return undefined;
})