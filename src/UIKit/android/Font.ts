/// <reference path="xtr.d.ts" />

export class Font extends XT.BaseObject {

    constructor(pointSize: number | string, fontWeight: string = '400', fontStyle: string = 'normal', familyName?: string) {
        super(undefined, false)
        if (typeof pointSize === "string") {
            if (objectRefs[pointSize]) { return objectRefs[pointSize] }
            this.objectRef = pointSize;
        }
        else {
            this.objectRef = _XTUIFont.create(pointSize || 14, fontWeight || "400", fontStyle || "normal", familyName || "");
        }
        objectRefs[this.objectRef] = this;
    }

    static systemFontOfSize(pointSize: number, weight: string = '400'): Font {
        return new Font(pointSize, weight);
    }

    static boldSystemFontOfSize(pointSize: number): Font {
        return new Font(pointSize, '700')
    }

    static italicSystemFontOfSize(pointSize: number): Font {
        return new Font(pointSize, '400', 'italic')
    }

    toObject(): any {
        return {
            class: "UI.Font",
            familyName: this.familyName,
            pointSize: this.pointSize,
            fontWeight: this.fontWeight,
            fontStyle: this.fontStyle,
        }
    }

    public get familyName(): string | undefined {
        return _XTUIFont.xtr_familyName(this.objectRef)
    }

    public get pointSize(): number {
        return _XTUIFont.xtr_pointSize(this.objectRef)
    }

    public get fontWeight(): string {
        return _XTUIFont.xtr_fontWeight(this.objectRef);
    }

    public get fontStyle(): string {
        return _XTUIFont.xtr_fontStyle(this.objectRef);
    }

}