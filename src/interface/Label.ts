import { View } from "./View";
import { Color } from "./Color";
import { Font } from "./Font";

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

    text?: string;
    font?: Font;
    textColor: Color = new Color(0, 0, 0);
    textAlignment: TextAlignment = TextAlignment.Left;
    numberOfLines: number = 1;
    lineBreakMode: LineBreakMode = LineBreakMode.WordWrapping;

}