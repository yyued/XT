/// <reference path="xtr.d.ts" />
import { ScrollView } from "./ScrollView";
import { View } from "./View";
import { Rect, RectZero, Insets, InsetsMake } from "../interface/Rect";
import { ListItem } from "../interface/ListView";
import { HRView } from "./HRView";
import { Color } from "../interface/Color";
import { RefreshControl } from "./RefreshControl";
import { LoadMoreControl } from "./LoadMoreControl";

export enum ListSelectionStyle {
    None,
    Gray,
}

export class ListCell extends View {

    reuseIdentifier: string
    currentItem?: ListItem
    onSelected?: () => void
    onRender?: () => void
    selectionStyle: ListSelectionStyle = ListSelectionStyle.Gray;
    selectionView: View = new View();
    contentView: View = new View();
    bottomLine: HRView = new HRView();
    context?: any

    constructor(ref: any) {
        super(ref || _XTUIListCell)
        this.selectionView.backgroundColor = new Color(0xd0 / 0xff, 0xd0 / 0xff, 0xd0 / 0xff);
        this.selectionView.alpha = 0.0;
        this.addSubview(this.selectionView);
        this.addSubview(this.contentView);
        this.bottomLine.color = new Color(0xda / 0xff, 0xda / 0xff, 0xda / 0xff)
        this.addSubview(this.bottomLine)
    }

    toObject(): any {
        return {
            ...super.toObject(),
            class: "UI.ListCell",
            reuseIdentifier: this.reuseIdentifier,
            currentItem: this.currentItem,
            contentView: this.contentView,
            selectionStyle: this.selectionStyle,
        }
    }

    handleSelected() {
        this.didSelected();
    }

    didHighlighted(highlighted: boolean) {
        this.highligted = highlighted
    }

    didSelected() {
        this.highligted = true
        setTimeout(() => {
            View.animationWithDuration(0.15, () => {
                this.highligted = false
            })
        }, 250)
    }

    didRender() { }

    layoutSubviews() {
        super.layoutSubviews();
        this.selectionView.frame = this.bounds;
        this.contentView.frame = this.bounds;
        this.resetBottomLine()
    }

    public set highligted(value: boolean) {
        if (this.selectionStyle == ListSelectionStyle.None) { return }
        this.selectionView.alpha = value ? 1.0 : 0.0;
    }

    // MARK: BottomLine

    private _bottomVisible: boolean = true

    public get bottomVisible(): boolean {
        return this._bottomVisible;
    }

    public set bottomVisible(value: boolean) {
        this._bottomVisible = value;
        this.resetBottomLine()
    }

    private _isLastCell: boolean = false

    public get isLastCell(): boolean {
        return this._isLastCell;
    }

    public set isLastCell(value: boolean) {
        if (this._isLastCell === value) { return }
        this._isLastCell = value;
        this.resetBottomLine()
    }

    private _bottomLineInsets: Insets = InsetsMake(0, 0, 0, 0)

    public get bottomLineInsets(): Insets {
        return this._bottomLineInsets;
    }

    public set bottomLineInsets(value: Insets) {
        this._bottomLineInsets = value;
        this.resetBottomLine()
    }

    private resetBottomLine() {
        this.bottomLine.hidden = !this.bottomVisible || this.isLastCell
        this.bottomLine.frame = UI.RectMake(this.bottomLineInsets.left, this.bounds.height - 1, this.bounds.width - this.bottomLineInsets.left - this.bottomLineInsets.right, 1)
    }

}

export class ListSection {

    private __isSection = true
    public headerView?: View
    public footerView?: View
    public items: ListItem[] = [];

}

export class ListView extends ScrollView {

    protected registedClasses: { [key: string]: typeof ListCell } = {}
    protected registedContexts: { [key: string]: any } = {}

    constructor(ref: any) {
        super(ref || _XTUIListView)
    }

    toObject(): any {
        return {
            ...super.toObject(),
            class: "UI.ListView",
            items: this.items,
            subviews: undefined,
        }
    }

    public items: (ListItem | ListSection)[] = [];

    private _sectionsItems: ListSection[]

    register(clazz: typeof ListCell, reuseIdentifier: string, context: any = undefined) {
        this.registedClasses[reuseIdentifier] = clazz;
        this.registedContexts[reuseIdentifier] = context;
    }

    private _listHeaderView: View | undefined = undefined

    public get listHeaderView(): View | undefined {
        return this._listHeaderView;
    }

    public set listHeaderView(value: View | undefined) {
        this._listHeaderView = value
        _XTUIListView.xtr_setHeaderViewObjectRef(value ? value.objectRef : undefined, this.objectRef)
    }

    private _listFooterView: View | undefined = undefined

    public get listFooterView(): View | undefined {
        return this._listFooterView;
    }

    public set listFooterView(value: View | undefined) {
        this._listFooterView = value
        _XTUIListView.xtr_setFooterViewObjectRef(value ? value.objectRef : undefined, this.objectRef)
    }

    reloadData() {
        this._sectionsItems = []
        let defaultSection = new ListSection()
        this.items.forEach(item => {
            if (item instanceof ListSection) {
                defaultSection = new ListSection()
                if (item.headerView) {
                    (item as any).__headerViewObjectRef = item.headerView.objectRef
                }
                if (item.footerView) {
                    (item as any).__footerViewObjectRef = item.footerView.objectRef
                }
                this._sectionsItems.push(item)
            }
            else {
                if (this._sectionsItems.indexOf(defaultSection) < 0) {
                    this._sectionsItems.push(defaultSection)
                }
                defaultSection.items.push(item)
            }
        })
        _XTUIListView.xtr_setItemsObjectRef(this._sectionsItems, this.objectRef);
        _XTUIListView.xtr_reloadData(this.objectRef);
    }

    requestRowHeight(width: number, rowIndex: number, sectionIndex: number): number {
        if (this._sectionsItems[sectionIndex] && this._sectionsItems[sectionIndex].items[rowIndex] && typeof this._sectionsItems[sectionIndex].items[rowIndex].rowHeight === "function") {
            return Math.max(0.0, this._sectionsItems[sectionIndex].items[rowIndex].rowHeight(width));
        }
        return 0.0
    }

    requestRowCell(rowIndex: number, sectionIndex: number): string {
        if (this._sectionsItems[sectionIndex] && this._sectionsItems[sectionIndex].items[rowIndex]) {
            if (this.registedClasses[this._sectionsItems[sectionIndex].items[rowIndex].reuseIdentifier] !== undefined) {
                const clazz: typeof ListCell = this.registedClasses[this._sectionsItems[sectionIndex].items[rowIndex].reuseIdentifier];
                const cell = new clazz(undefined);
                cell.reuseIdentifier = this._sectionsItems[sectionIndex].items[rowIndex].reuseIdentifier || "Cell";
                cell.context = this.registedContexts[this._sectionsItems[sectionIndex].items[rowIndex].reuseIdentifier];
                return cell.objectRef;
            }
        }
        return new ListCell(undefined).objectRef;
    }

    handleRenderItem(rowIndex: number, sectionIndex: number, cellRef: string): void {
        if (typeof cellRef !== "string") { return }
        if (this._sectionsItems[sectionIndex] && this._sectionsItems[sectionIndex].items[rowIndex]) {
            const cell = ListCell.findByRef<ListCell>(cellRef)
            cell.currentItem = this._sectionsItems[sectionIndex].items[rowIndex];
            cell.isLastCell = rowIndex >= this._sectionsItems[sectionIndex].items.length - 1
            cell.didRender();
        }
    }

    public get refreshControl(): RefreshControl | undefined {
        const ref = _XTUIListView.xtr_refreshControl(this.objectRef)
        if (typeof ref !== "string") { return undefined }
        return RefreshControl.findByRef(ref)
    }

    public set refreshControl(value: RefreshControl | undefined) {
        _XTUIListView.xtr_setRefreshControlObjectRef(value ? value.objectRef : "", this.objectRef);
    }

    public get loadMoreControl(): LoadMoreControl | undefined {
        const ref = _XTUIListView.xtr_loadMoreControl(this.objectRef)
        if (typeof ref !== "string") { return undefined }
        return LoadMoreControl.findByRef<LoadMoreControl>(ref)
    }

    public set loadMoreControl(value: LoadMoreControl | undefined) {
        _XTUIListView.xtr_setLoadMoreControlObjectRef(value ? value.objectRef : "", this.objectRef);
    }

}