import { View } from './View'
import { Color } from '../interface/Color';
import { Rect, RectZero } from '../interface/Rect';
import { CanvasElement } from './element/Canvas';

export class CanvasView extends View {

    nativeObject: any;

    constructor() {
        super(CanvasElement)
        this.userInteractionEnabled = false
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
        return this.nativeObject.xtr_globalAlpha()
    }

    public set globalAlpha(value: number) {
        this.nativeObject.xtr_setGlobalAlpha(value)
    }

    public get fillStyle(): Color {
        return this.nativeObject.xtr_fillStyle()
    }

    public set fillStyle(value: Color) {
        this.nativeObject.xtr_setFillStyle(value)
    }

    public get strokeStyle(): Color {
        return this.nativeObject.xtr_strokeStyle()
    }

    public set strokeStyle(value: Color) {
        this.nativeObject.xtr_setStrokeStyle(value)
    }

    public get lineCap(): "butt" | "round" | "square" {
        return this.nativeObject.xtr_lineCap()
    }

    public set lineCap(value: "butt" | "round" | "square") {
        this.nativeObject.xtr_setLineCap(value)
    }

    public get lineJoin(): "bevel" | "round" | "miter" {
        return this.nativeObject.xtr_lineJoin()
    }

    public set lineJoin(value: "bevel" | "round" | "miter") {
        this.nativeObject.xtr_setLineJoin(value)
    }

    public get lineWidth(): number {
        return this.nativeObject.xtr_lineWidth()
    }

    public set lineWidth(value: number) {
        this.nativeObject.xtr_setLineWidth(value)
    }

    public get miterLimit(): number {
        return this.nativeObject.xtr_miterLimit()
    }

    public set miterLimit(value: number) {
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

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.nativeObject.xtr_quadraticCurveTo({ x: cpx, y: cpy }, { x, y })
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this.nativeObject.xtr_bezierCurveTo({ x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x, y })
    }

    arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise: boolean = false): void {
        this.nativeObject.xtr_arc({ x, y }, r, sAngle, eAngle, counterclockwise)
    }

    postScale(x: number, y: number): void {
        this.nativeObject.xtr_postScale({ x, y })
    }

    postRotate(angle: number) {
        this.nativeObject.xtr_postRotate(angle);
    }

    postTranslate(x: number, y: number): void {
        this.nativeObject.xtr_postTranslate({ x, y })
    }

    postTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        this.nativeObject.xtr_postTransform({ a, b, c, d, tx, ty })
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

    isPointInPath(x: number, y: number): boolean {
        return this.nativeObject.xtr_isPointInPath({ x, y })
    }

    clear(): void {
        this.nativeObject.xtr_clear();
    }

}