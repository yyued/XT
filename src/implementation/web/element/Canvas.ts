import { ViewElement } from "./View";
import { Rect } from "../../../interface/Rect";
import { Color } from "../../../interface/Color";

export class CanvasElement extends ViewElement {

    private foreignObject: SVGForeignObjectElement
    private canvasObject: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private actions: (() => void)[] = []

    loadContent() {
        super.loadContent();
        this.foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        this.canvasObject = document.createElement("canvas");
        this.ctx = this.canvasObject.getContext('2d') as CanvasRenderingContext2D
        this.ctx.save();
        this.foreignObject.appendChild(this.canvasObject);
        this.contentObject = this.foreignObject;
    }

    public xtr_setFrame(value: Rect) {
        super.xtr_setFrame(value);
        this.foreignObject.setAttribute("width", value.width.toString())
        this.foreignObject.setAttribute("height", value.height.toString())
        this.canvasObject.setAttribute("width", value.width.toString())
        this.canvasObject.setAttribute("height", value.height.toString())
        this.actions && this.actions.forEach(action => action())
    }

    public xtr_globalAlpha(): number | undefined {
        return this.ctx.globalAlpha
    }

    public xtr_setGlobalAlpha(value: number | undefined) {
        this.doAction(() => {
            this.ctx.globalAlpha = value || 1.0
        })
    }

    private fillStyle: Color | undefined;

    public xtr_fillStyle(): Color | undefined {
        return this.fillStyle
    }

    public xtr_setFillStyle(value: Color | undefined) {
        this.fillStyle = value
        this.doAction(() => {
            if (value) {
                this.ctx.fillStyle = 'rgba(' + (value.r * 255).toFixed(0) + ', ' + (value.g * 255).toFixed(0) + ', ' + (value.b * 255).toFixed(0) + ', ' + value.a.toString() + ')'
            }
            else {
                this.ctx.fillStyle = "transparent"
            }
        })
    }

    private strokeStyle: Color | undefined;

    public xtr_strokeStyle(): Color | undefined {
        return this.strokeStyle
    }

    public xtr_setStrokeStyle(value: Color | undefined) {
        this.strokeStyle = value;
        this.doAction(() => {
            if (value) {
                this.ctx.strokeStyle = 'rgba(' + (value.r * 255).toFixed(0) + ', ' + (value.g * 255).toFixed(0) + ', ' + (value.b * 255).toFixed(0) + ', ' + value.a.toString() + ')'
            }
            else {
                this.ctx.strokeStyle = "transparent"
            }
        })
    }

    public xtr_lineCap(): string | undefined {
        return this.ctx.lineCap
    }

    public xtr_setLineCap(value: string | undefined) {
        this.doAction(() => {
            this.ctx.lineCap = value || "butt"
        })
    }

    public xtr_lineJoin(): string | undefined {
        return this.ctx.lineJoin
    }

    public xtr_setLineJoin(value: string | undefined) {
        this.doAction(() => {
            this.ctx.lineJoin = value || "miter"
        })
    }

    public xtr_lineWidth(): number | undefined {
        return this.ctx.lineWidth
    }

    public xtr_setLineWidth(value: number | undefined) {
        this.doAction(() => {
            this.ctx.lineWidth = value || 1
        })
    }

    public xtr_miterLimit(): number | undefined {
        return this.ctx.miterLimit
    }

    public xtr_setMiterLimit(value: number | undefined) {
        this.doAction(() => {
            this.ctx.miterLimit = value || 10
        })
    }

    public xtr_rect(rect: { x: number, y: number, width: number, height: number }): void {
        this.doAction(() => {
            this.ctx.beginPath();
            this.ctx.rect(rect.x, rect.y, rect.width, rect.height)
        })
    }

    public xtr_fillRect(rect: { x: number, y: number, width: number, height: number }): void {
        this.xtr_rect(rect)
        this.xtr_fill()
    }

    public xtr_strokeRect(rect: { x: number, y: number, width: number, height: number }): void {
        this.xtr_rect(rect)
        this.xtr_stroke()
    }

    public xtr_fill() {
        this.doAction(() => {
            this.ctx.fill();
        })
    }

    public xtr_stroke() {
        this.doAction(() => {
            this.ctx.stroke();
        })
    }

    public xtr_beginPath(): void {
        this.doAction(() => {
            this.ctx.beginPath()
        })
    }

    public xtr_moveTo(point: { x: number, y: number }): void {
        this.doAction(() => {
            this.ctx.moveTo(point.x, point.y);
        })
    }

    public xtr_closePath(): void {
        this.doAction(() => {
            this.ctx.closePath()
        })
    }

    public xtr_lineTo(point: { x: number, y: number }): void {
        this.doAction(() => {
            this.ctx.lineTo(point.x, point.y)
        })
    }

    public xtr_quadraticCurveTo(cpPoint: { x: number, y: number }, point: { x: number, y: number }): void {
        this.doAction(() => {
            this.ctx.quadraticCurveTo(cpPoint.x, cpPoint.y, point.x, point.y)
        })
    }

    public xtr_bezierCurveTo(cp1Point: { x: number, y: number }, cp2Point: {x: number, y: number}, point: {x: number, y: number}): void {
        this.doAction(() => {
            this.ctx.bezierCurveTo(cp1Point.x, cp1Point.y, cp2Point.x, cp2Point.y, point.x, point.y)
        })
    }

    public xtr_arc(point: {x: number, y: number}, r: number, sAngle: number, eAngle: number, counterclockwise: boolean = false): void {
        this.doAction(() => {
            this.ctx.arc(point.x, point.y, r, sAngle, eAngle, counterclockwise)
        })
    }

    public xtr_postScale(point: {x: number, y: number}): void {
        this.doAction(() => {
            this.ctx.scale(point.x, point.y)
        })
    }

    public xtr_postRotate(angle: number) {
        this.doAction(() => {
            this.ctx.rotate(angle)
        })
    }

    public xtr_postTranslate(point: {x: number, y: number}): void {
        this.doAction(() => {
            this.ctx.translate(point.x, point.y)
        })
    }

    public xtr_postTransform(t: {a: number, b: number, c: number, d: number, tx: number, ty: number}): void {
        this.doAction(() => {
            this.ctx.transform(t.a, t.b, t.c, t.d, t.tx, t.ty)
        })
    }

    public xtr_setCanvasTransform(t: {a: number, b: number, c: number, d: number, tx: number, ty: number}): void {
        this.doAction(() => {
            this.ctx.setTransform(t.a, t.b, t.c, t.d, t.tx, t.ty)
        })
    }

    public xtr_save(): void {
        this.doAction(() => {
            this.ctx.save()
        })
    }

    public xtr_restore(): void {
        this.doAction(() => {
            this.ctx.restore()
        })
    }

    public xtr_isPointInPath(point: {x: number, y: number}): boolean {
        return this.ctx.isPointInPath(point.x, point.y)
    }

    public xtr_clear(): void {
        this.ctx.restore()
        this.ctx.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
        this.actions = [];
        this.ctx.clearRect(0, 0, this.xtr_frame().width, this.xtr_frame().height)
        this.ctx.save();
    }

    private doAction(action: () => void) {
        this.actions.push(action);
        action();
    }

}