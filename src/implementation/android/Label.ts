/// <reference path="xtr.d.ts" />

import { View } from "./View";
import { Color } from "../../interface/Color";
import { Rect, RectZero } from "../../interface/Rect";
import { Font } from "../../interface/Font";

export enum TextAlignment {
    Left,
    Center,
    Right,
}

export enum TextVerticalAlignment {
    Top,
    Center,
    Bottom,
}

export enum LineBreakMode {
    WordWrapping = 0,
    TruncatingTail = 4,
}

export class Label extends View {

    nativeObject: any;

    constructor() {
        super(XTRLabel)
    }

    public get text(): string {
        return this.nativeObject.xtr_text();
    }

    public set text(value: string) {
        this.nativeObject.xtr_setText(value);
    }

	public get font(): Font | undefined {
		return this.nativeObject.xtr_font();
	}

	public set font(value: Font | undefined) {
		this.nativeObject.xtr_setFont(value);
	}

    public get textColor(): Color {
        return this.nativeObject.xtr_textColor();
    }

    public set textColor(value: Color) {
        this.nativeObject.xtr_setTextColor(value);
    }

    public get textAlignment(): TextAlignment {
        return this.nativeObject.xtr_textAlignment();
    }

    public set textAlignment(value: TextAlignment) {
        this.nativeObject.xtr_setTextAlignment(value);
    }

    public get numberOfLines(): number {
        return this.nativeObject.xtr_numberOfLines();
    }

    public set numberOfLines(value: number) {
        this.nativeObject.xtr_setNumberOfLines(value);
    }

    public get lineBreakMode(): LineBreakMode {
        return this.nativeObject.xtr_lineBreakMode();
    }

    public set lineBreakMode(value: LineBreakMode) {
        this.nativeObject.xtr_setLineBreakMode(value);
    }

    public get lineSpace(): number {
        return this.nativeObject.xtr_lineSpace();
    }

    public set lineSpace(value: number) {
        this.nativeObject.xtr_setLineSpace(value);
    }

    textRectForBounds(bounds: Rect): Rect {
        return this.nativeObject.xtr_textRectForBounds(bounds);
    }

}