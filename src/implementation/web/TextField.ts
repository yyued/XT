/// <reference path="xtr.d.ts" />
import { View } from './View'
import { Rect, RectZero, RectMake } from '../../interface/Rect';
import { Font } from '../../interface/Font';
import { Color } from '../../interface/Color';
import { TextAlignment } from '../../interface/Label';
import { TextFieldViewMode, KeyboardType, ReturnKeyType } from '../../interface/TextField';
import { Button } from './Button';
import { Image } from './ImageView';
import { TextFieldElement } from './element/TextField';
import { Touchable, Touch, Event } from '../libraries/touch/TouchManager';
import { WindowElement } from './element/Window';

export class TextField extends View {

    nativeObject: any;

    constructor(rect?: Rect, _isChild: boolean = false) {
        super(undefined, true)
        if (_isChild) { return; }
        this.nativeObject = new TextFieldElement(rect || RectZero, this);
        this.userInteractionEnabled = true;
        this.clipsToBounds = true;
        this.onTap = () => {
            this.focus();
        }
        setImmediate(() => { this.init(); });
    }

    touchesBegan(touches: Touch[], event: Event): void {
        super.touchesBegan(touches, event);
        WindowElement._allowDefault = true;
    }

    touchesMoved(touches: Touch[], event: Event): void {
        super.touchesMoved(touches, event);
        WindowElement._allowDefault = true;
    }

    touchesEnded(touches: Touch[], event: Event): void {
        super.touchesEnded(touches, event);
        WindowElement._allowDefault = true;
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

    public get placeholder(): string {
        return this.nativeObject.xtr_placeholder();
    }

    public set placeholder(value: string) {
        this.nativeObject.xtr_setPlaceholder(value);
    }

    public get placeholderColor(): Color {
        return this.nativeObject.xtr_placeholderColor();
    }

    public set placeholderColor(value: Color) {
        this.nativeObject.xtr_setPlaceholderColor(value);
    }

    public get clearsOnBeginEditing(): Boolean {
        return this.nativeObject.xtr_clearsOnBeginEditing();
    }

    public set clearsOnBeginEditing(value: Boolean) {
        this.nativeObject.xtr_setClearsOnBeginEditing(value);
    }

    public get editing(): Boolean {
        return this.nativeObject.xtr_editing();
    }

    requestClearView(): View {
        const view = new Button(RectMake(0, 0, 36, 0))
        Image.fromBase64('iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABjUExURUdwTKqqqo+OlZGRto+OlZOTmY+OlY+OlJCQlpCQlZGOlpGRnZCQmY+OlJCOlJCOlI+OlI+OlJCOlI+OlJCOlI+OlI+PlI+OlI+OlI+OlI+PlI+OlP///4+OlI+PlY+PlI+OlI/lPb8AAAAgdFJOUwAG4AfzLcP7VS5mFR7Zob+l/Y/eiPd89vXum/AB+HuJvx1C8wAAASxJREFUOMuVlUeigzAMRAWYXkMnEKL7n/LzaRaOKZoVwm+hMpYBjrLHLI2FiNNstOFCdl4gUZGf0VHyQkWvJNKARvlBjarSUMnQwRM54ZH0TTyV6R9IgRcShA1NvJS552A4eCNnq+2LtyrXflb3aLX0N5F/mp6ed638TuZpyhm9rSFwt8ANwHrLuf3PON/D1ppCb2VdbwqsZj/Mp1A6pJvzWdiZhEEmVEzdJ8kFO7uQEJBDH2oSrYDn7h/ksIYMNayGxAxS1LAaElOI8YRVSIxB9dTGqiQKDspIgFEWo1mPRzA+H6xN7dL/2AU6ahdiwubXhO3BhAdrA7X2oFqbXpi2ozX3jXJhIPo8voaMy81ZGYxFxFlvnKXJWcWcBc95NliP0VJfvT1xtVIN/AEiR40jdo0zSQAAAABJRU5ErkJggg==', 3.0, (it) => {
            view.image = it
        })
        view.onTap = () => {
            this.nativeObject.xtr_onClearButtonTap()
        }
        return view
    }

    public get clearButtonMode(): TextFieldViewMode {
        return this.nativeObject.xtr_clearButtonMode();
    }

    public set clearButtonMode(value: TextFieldViewMode) {
        this.nativeObject.xtr_setClearButtonMode(value);
    }

    public get leftView(): View {
        return this.nativeObject.xtr_leftView();
    }

    public set leftView(view: View) {
        this.nativeObject.xtr_setLeftView(view);
    }

    public get leftViewMode(): TextFieldViewMode {
        return this.nativeObject.xtr_leftViewMode();
    }

    public set leftViewMode(value: TextFieldViewMode) {
        this.nativeObject.xtr_setLeftViewMode(value);
    }

    public get rightView(): View {
        return this.nativeObject.xtr_rightView();
    }

    public set rightView(view: View) {
        this.nativeObject.xtr_setRightView(view);
    }

    public get rightViewMode(): TextFieldViewMode {
        return this.nativeObject.xtr_rightViewMode();
    }

    public set rightViewMode(value: TextFieldViewMode) {
        this.nativeObject.xtr_setRightViewMode(value);
    }

    public get allowAutocapitalization(): Boolean {
        return this.nativeObject.xtr_allowAutocapitalization();
    }

    public set allowAutocapitalization(value: Boolean) {
        this.nativeObject.xtr_setAllowAutocapitalization(value);
    }

    public get allowAutocorrection(): Boolean {
        return this.nativeObject.xtr_allowAutocorrection();
    }

    public set allowAutocorrection(value: Boolean) {
        this.nativeObject.xtr_setAllowAutocorrection(value);
    }

    public get allowSpellChecking(): Boolean {
        return this.nativeObject.xtr_allowSpellChecking();
    }

    public set allowSpellChecking(value: Boolean) {
        this.nativeObject.xtr_setAllowSpellChecking(value);
    }

    public get keyboardType(): KeyboardType {
        return this.nativeObject.xtr_keyboardType();
    }

    public set keyboardType(value: KeyboardType) {
        this.nativeObject.xtr_setKeyboardType(value);
    }

    public get returnKeyType(): ReturnKeyType {
        return this.nativeObject.xtr_returnKeyType();
    }

    public set returnKeyType(value: ReturnKeyType) {
        this.nativeObject.xtr_setReturnKeyType(value);
    }

    public get enablesReturnKeyAutomatically(): Boolean {
        return false
    }

    public set enablesReturnKeyAutomatically(value: Boolean) { }

    public get secureTextEntry(): Boolean {
        return this.nativeObject.xtr_secureTextEntry;
    }

    public set secureTextEntry(value: Boolean) {
        if (value) {
            this.allowAutocapitalization = false
            this.allowAutocorrection = false
            this.allowSpellChecking = false
        }
        this.nativeObject.xtr_setSecureTextEntry(value);
    }

    shouldBeginEditing?: () => Boolean = undefined
    didBeginEditing?: () => void = undefined
    shouldEndEditing?: () => Boolean = undefined
    didEndEditing?: () => void = undefined
    shouldChange?: (inRange: { location: number, length: number }, replacementString: string) => Boolean = undefined
    shouldClear?: () => Boolean = undefined
    shouldReturn?: () => Boolean = undefined

    handleShouldBeginEditing(): Boolean {
        if (this.shouldBeginEditing) {
            return this.shouldBeginEditing()
        }
        return true
    }

    handleDidBeginEditing() {
        this.didBeginEditing && this.didBeginEditing()
    }

    handleShouldEndEditing(): Boolean {
        if (this.shouldEndEditing) {
            return this.shouldEndEditing()
        }
        return true
    }

    handleDidEndEditing() {
        this.didEndEditing && this.didEndEditing()
    }

    handleShouldChange(inRange: { location: number, length: number }, replacementString: string): Boolean {
        if (this.shouldChange) {
            return this.shouldChange(inRange, replacementString)
        }
        return true
    }

    handleShouldClear(): Boolean {
        if (this.shouldClear) {
            return this.shouldClear()
        }
        return true
    }

    handleShouldReturn(): Boolean {
        if (this.shouldReturn) {
            return this.shouldReturn()
        }
        return true
    }

    focus(): void {
        this.nativeObject.xtr_focus();
    }

    blur(): void {
        this.nativeObject.xtr_blur();
    }

}