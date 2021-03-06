import { View } from './View'
import { Rect, RectZero } from '../interface/Rect';
import { Color } from '../interface/Color';

export class CanvasView extends View {

    constructor(ref?: any) {
        super(ref || _XTUICanvasView)
    }

    toObject(): any {
        return {
            ...super.toObject(), 
            class: "UI.CanvasView",
            globalAlpha: this.globalAlpha,
            fillStyle: this.fillStyle,
            strokeStyle: this.strokeStyle,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin,
            lineWidth: this.lineWidth,
            miterLimit: this.miterLimit,
        }
    }

    public get globalAlpha(): number {
        return _XTUICanvasView.xtr_globalAlpha(this.objectRef)
    }

    public set globalAlpha(value: number) {
        _XTUICanvasView.xtr_setGlobalAlpha(value, this.objectRef)
    }

    public get fillStyle(): Color {
        return _XTUICanvasView.xtr_fillStyle(this.objectRef)
    }

    public set fillStyle(value: Color) {
        _XTUICanvasView.xtr_setFillStyle(value, this.objectRef)
    }

    public get strokeStyle(): Color {
        return _XTUICanvasView.xtr_strokeStyle(this.objectRef)
    }

    public set strokeStyle(value: Color) {
        _XTUICanvasView.xtr_setStrokeStyle(value, this.objectRef)
    }

    public get lineCap(): "butt" | "round" | "square" {
        return _XTUICanvasView.xtr_lineCap(this.objectRef)
    }

    public set lineCap(value: "butt" | "round" | "square") {
        _XTUICanvasView.xtr_setLineCap(value, this.objectRef)
    }

    public get lineJoin(): "bevel" | "round" | "miter" {
        return _XTUICanvasView.xtr_lineJoin(this.objectRef)
    }

    public set lineJoin(value: "bevel" | "round" | "miter") {
        _XTUICanvasView.xtr_setLineJoin(value, this.objectRef)
    }

    public get lineWidth(): number {
        return _XTUICanvasView.xtr_lineWidth(this.objectRef)
    }

    public set lineWidth(value: number) {
        _XTUICanvasView.xtr_setLineWidth(value, this.objectRef)
    }

    public get miterLimit(): number {
        return _XTUICanvasView.xtr_miterLimit(this.objectRef)
    }

    public set miterLimit(value: number) {
        _XTUICanvasView.xtr_setMiterLimit(value, this.objectRef)
    }

    rect(x: number, y: number, width: number, height: number): void {
        _XTUICanvasView.xtr_rect({ x, y, width, height }, this.objectRef)
    }

    fillRect(x: number, y: number, width: number, height: number): void {
        _XTUICanvasView.xtr_fillRect({ x, y, width, height }, this.objectRef)
    }

    strokeRect(x: number, y: number, width: number, height: number): void {
        _XTUICanvasView.xtr_strokeRect({ x, y, width, height }, this.objectRef)
    }

    fill() {
        _XTUICanvasView.xtr_fill(this.objectRef);
    }

    stroke() {
        _XTUICanvasView.xtr_stroke(this.objectRef);
    }

    beginPath(): void {
        _XTUICanvasView.xtr_beginPath(this.objectRef);
    }

    moveTo(x: number, y: number): void {
        _XTUICanvasView.xtr_moveTo({ x, y }, this.objectRef);
    }

    closePath(): void {
        _XTUICanvasView.xtr_closePath(this.objectRef)
    }

    lineTo(x: number, y: number): void {
        _XTUICanvasView.xtr_lineTo({ x, y }, this.objectRef)
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        _XTUICanvasView.xtr_quadraticCurveTo({ x: cpx, y: cpy }, { x, y }, this.objectRef)
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        _XTUICanvasView.xtr_bezierCurveTo({ x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x, y }, this.objectRef)
    }

    arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise: boolean = false): void {
        _XTUICanvasView.xtr_arc({ x, y }, r, sAngle, eAngle, counterclockwise, this.objectRef)
    }

    postScale(x: number, y: number): void {
        _XTUICanvasView.xtr_postScale({ x, y }, this.objectRef)
    }

    postRotate(angle: number) {
        _XTUICanvasView.xtr_postRotate(angle, this.objectRef);
    }

    postTranslate(x: number, y: number): void {
        _XTUICanvasView.xtr_postTranslate({ x, y }, this.objectRef)
    }

    postTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        _XTUICanvasView.xtr_postTransform({ a, b, c, d, tx, ty }, this.objectRef)
    }

    setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        _XTUICanvasView.xtr_setCanvasTransform({ a, b, c, d, tx, ty }, this.objectRef)
    }

    save(): void {
        _XTUICanvasView.xtr_save(this.objectRef);
    }

    restore(): void {
        _XTUICanvasView.xtr_restore(this.objectRef);
    }

    isPointInPath(x: number, y: number): boolean {
        return _XTUICanvasView.xtr_isPointInPath({ x, y }, this.objectRef)
    }

    clear(): void {
        _XTUICanvasView.xtr_clear(this.objectRef);
    }

}