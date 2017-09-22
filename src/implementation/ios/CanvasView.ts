import { View } from './View'
import { Rect, RectZero } from '../../interface/Rect';
import { Color } from '../../interface/Color';

export class CanvasView extends View {

    nativeObject: any;

    constructor(rect?: Rect, nativeObject?: any, _isChild: boolean = false) {
        super(undefined, undefined, true);
        if (_isChild) { return; }
        if (nativeObject) {
            this.nativeObject = nativeObject;
            (window as any).XTRObjCreater.store(this);
        }
        else {
            this.nativeObject = XTRCanvasView.createScriptObject(rect || RectZero, this);
            (window as any).XTRObjCreater.store(this);
            this.init();
        }
    }

    public get globalAlpha(): number | undefined {
        return this.nativeObject.xtr_globalAlpha()
    }

    public set globalAlpha(value: number | undefined) {
        this.nativeObject.xtr_setGlobalAlpha(value)
    }

    public get fillStyle(): Color | undefined {
        return this.nativeObject.xtr_fillStyle()
    }

    public set fillStyle(value: Color | undefined) {
        this.nativeObject.xtr_setFillStyle(value)
    }

    public get strokeStyle(): Color | undefined {
        return this.nativeObject.xtr_strokeStyle()
    }

    public set strokeStyle(value: Color | undefined) {
        this.nativeObject.xtr_setStrokeStyle(value)
    }

    public get lineCap(): string | undefined {
        return this.nativeObject.xtr_lineCap()
    }

    public set lineCap(value: string | undefined) {
        this.nativeObject.xtr_setLineCap(value)
    }

    public get lineJoin(): string | undefined {
        return this.nativeObject.xtr_lineJoin()
    }

    public set lineJoin(value: string | undefined) {
        this.nativeObject.xtr_setLineJoin(value)
    }

    public get lineWidth(): number | undefined {
        return this.nativeObject.xtr_lineWidth()
    }

    public set lineWidth(value: number | undefined) {
        this.nativeObject.xtr_setLineWidth(value)
    }

    public get miterLimit(): number | undefined {
        return this.nativeObject.xtr_miterLimit()
    }

    public set miterLimit(value: number | undefined) {
        this.nativeObject.xtr_setMiterLimit(value)
    }

    rect(x: number, y: number, width: number, height: number): void {
        this.nativeObject.xtr_rect({ x, y, width, height })
    }

    fillRect(x: number, y: number, width: number, height: number): void {
        this.nativeObject.xtr_fillRect({ x, y, width, height })
    }

    strokeRect(x: number, y: number, width: number, height: number): void {
        this.nativeObject.xtr_strokeRect({ x, y, width, height })
    }

    clearRect(x: number, y: number, width: number, height: number): void {
        this.nativeObject.xtr_clearRect({ x, y, width, height })
    }

    fill() {
        this.nativeObject.xtr_fill();
    }

    stroke() {
        this.nativeObject.xtr_stroke();
    }

    beginPath(): void {
        this.nativeObject.xtr_beginPath();
    }

    moveTo(x: number, y: number): void {
        this.nativeObject.xtr_moveTo({ x, y });
    }

    closePath(): void {
        this.nativeObject.xtr_closePath()
    }

    lineTo(x: number, y: number): void {
        this.nativeObject.xtr_lineTo({ x, y })
    }

    clip(): void {
        this.nativeObject.xtr_clip();
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.nativeObject.xtr_quadraticCurveToXyPoint({ x: cpx, y: cpy }, { x, y })
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this.nativeObject.xtr_bezierCurveToCp2PointXyPoint({ x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x, y })
    }

    arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise: boolean = false): void {
        this.nativeObject.xtr_arcRSAngleEAngleCounterclockwise({ x, y }, r, sAngle, eAngle, counterclockwise)
    }

    preScale(x: number, y: number): void {
        this.nativeObject.xtr_preScale({ x, y })
    }

    preRotate(angle: number) {
        this.nativeObject.xtr_preRotate(angle);
    }

    preTranslate(x: number, y: number): void {
        this.nativeObject.xtr_preTranslate({ x, y })
    }

    preTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        this.nativeObject.xtr_preTransform({ a, b, c, d, tx, ty })
    }

    setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        this.nativeObject.xtr_setCanvasTransform({ a, b, c, d, tx, ty })
    }

    save(): void {
        this.nativeObject.xtr_save();
    }
    
    restore(): void {
        this.nativeObject.xtr_restore();
    }

    isPointInPath(x: number, y: number): void {
        return this.nativeObject.xtr_isPointInPath({ x, y })
    }

    setNeedsDisplay(): void {
        this.nativeObject.xtr_setNeedsDisplay();
    }

    onDraw(): void { }

}

if ((window as any).XTRObjClasses === undefined) {
    (window as any).XTRObjClasses = [];
}
(window as any).XTRObjClasses.push((view: any) => {
    if (view.constructor.toString() === "[object XTRCanvasViewConstructor]") {
        return new CanvasView(undefined, view);
    }
    return undefined;
})