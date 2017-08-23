import { ScrollView } from "./ScrollView";
import { View } from "./View";
import { ListItem, Rect } from "../../interface/Abstract";

export class ListCell extends View {

    reuseIdentifier: string = ""
    _displayItem: any = undefined
    _isBusy = false

}

export class ListView extends ScrollView {

    constructor(rect?: Rect) {
        super(rect)
        this.alwaysBounceVertical = true;
    }

    private reuseMapping: { [key: string]: typeof ListCell } = {};

    public renderItem?: (cell: ListCell, item: ListItem) => void

    public register(clazz: typeof ListCell, reuseIdentifier: string) {
        this.reuseMapping[reuseIdentifier] = clazz;
    }

    private _items: ListItem[] = [];

    public get items() {
        return this._items.slice();
    }

    public set items(value: ListItem[]) {
        this._items = value.slice();
        this.reloadData();
    }

    private _cacheRows: {
        minY: number;
        maxY: number;
        item: ListItem;
    }[] = [];

    private _reusingCells: ListCell[] = []

    public reloadData() {
        let currentY = 0;
        this._cacheRows = this.items.map((item) => {
            let minY = currentY;
            let maxY = minY + item.rowHeight(this.bounds.width);
            currentY = maxY;
            return { minY, maxY, item }
        });
        this.contentSize = { width: 0, height: currentY }
        this._nextSetted = false;
        this._nextReloadMinY = undefined;
        this._nextReloadMaxY = undefined;
        this.reloadVisibleRows();
    }

    protected handleScroll(x: number, y: number) {
        super.handleScroll(x, y);
        if (this._reusingCells !== undefined) {
            this.reloadVisibleRows();
        }
    }

    private _nextSetted = false;
    private _nextReloadMinY?: number = undefined;
    private _nextReloadMaxY?: number = undefined;

    private reloadVisibleRows() {
        if (this._nextSetted === true && this.contentOffset.y > (this._nextReloadMinY || -Infinity) && this.contentOffset.y < (this._nextReloadMaxY || Infinity)) {
            return;
        }
        this.markInvisibleCellNoBusy();
        this._nextSetted = true;
        this._nextReloadMinY = undefined;
        this._nextReloadMaxY = undefined;
        const visibleRows: {
            minY: number;
            maxY: number;
            item: ListItem;
        }[] = this._cacheRows.filter(item => {
            if (item.maxY <= this.contentOffset.y) {
                this._nextReloadMinY = item.maxY;
            }
            if (this._nextReloadMaxY === undefined && item.minY >= this.contentOffset.y + this.bounds.height) {
                this._nextReloadMaxY = item.minY - this.bounds.height;
            }
            return item.maxY > this.contentOffset.y && item.minY < this.contentOffset.y + this.bounds.height
        });
        const visibleCells: ListCell[] = visibleRows.filter(row => this._reusingCells.filter(cell => cell._displayItem === row.item).length == 0).map(row => {
            const cell = this._reusingCells.filter(cell => {
                return !cell._isBusy && cell.reuseIdentifier === row.item.reuseIdentifier
            })[0] ||
                (this.reuseMapping[row.item.reuseIdentifier] !== undefined ? new this.reuseMapping[row.item.reuseIdentifier]() : undefined) ||
                new ListCell()
            cell.reuseIdentifier = row.item.reuseIdentifier
            cell.frame = { x: 0, y: row.minY, width: this.bounds.width, height: row.maxY - row.minY }
            cell._isBusy = true;
            cell._displayItem = row.item;
            this.renderItem && this.renderItem(cell, row.item);
            if (this._reusingCells.indexOf(cell) < 0) {
                this._reusingCells.push(cell);
            }
            return cell;
        })
        visibleCells.forEach(cell => {
            if (cell.superview === undefined) {
                this.addSubview(cell);
            }
        });
        console.log(this._reusingCells.length);
    }

    private markInvisibleCellNoBusy() {
        this._reusingCells.filter(cell => {
            return cell._isBusy && (cell.frame.y + cell.frame.height < this.contentOffset.y || cell.frame.y > this.contentOffset.y + this.bounds.height)
        }).forEach(cell => {
            cell._isBusy = false;
        });
    }

}