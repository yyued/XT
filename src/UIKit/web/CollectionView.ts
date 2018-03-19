import { ScrollView } from "./ScrollView";
import { Size, SizeMake, Insets, InsetsMake, Rect, RectMake, RectEqual, Point } from "../interface/Rect";
import { View, InteractionState } from "./View";
import { CollectionItem } from "../interface/CollectionView";
import { LongPressGestureRecognizer } from "../libraries/touch/LongPressGestureRecognizer";

export class CollectionCell extends View {

    reuseIdentifier: string
    currentItem?: CollectionItem
    selectionView: View = new View();
    contentView: View = new View();
    context?: any
    didHighlighted(highlighted: boolean) { }
    didSelected() { }
    didRender() { }

    constructor(ref: any = undefined) {
        super(ref)
        this.selectionView.alpha = 0.0;
        this.addSubview(this.selectionView);
        this.addSubview(this.contentView);
        this.userInteractionEnabled = true
        this.longPressDuration = 0.05
        this.onTap = () => {
            this.highligted = true
            this.selectionView.hidden = false
            this.didSelected();
            setTimeout(() => {
                View.animationWithDuration(0.15, () => {
                    this.highligted = false
                }, () => { this.selectionView.hidden = true })
            }, 250)
        }
        this.onLongPress = (state: InteractionState) => {
            if (state == InteractionState.Began) {
                this.highligted = true
                this.selectionView.hidden = false
            }
            else if (state == InteractionState.Ended) {
                this.didSelected();
                View.animationWithDuration(0.15, () => {
                    this.highligted = false
                }, () => { this.selectionView.hidden = true })
            }
            else if (state == InteractionState.Cancelled) {
                this.highligted = false
                this.selectionView.hidden = true
            }
        }
        this.gestureRecongnizers.forEach(t => {
            if (t instanceof LongPressGestureRecognizer) {
                t.cancellable = true
            }
        })
    }

    layoutSubviews() {
        super.layoutSubviews()
        this.selectionView.frame = this.bounds
        this.contentView.frame = this.bounds
    }

    // Private

    _isBusy = false

    public set highligted(value: boolean) {
        this.didHighlighted(value)
        this.selectionView.alpha = value ? 1.0 : 0.0;
    }

}

export enum CollectionViewScrollDirection {
    Vertical,
    Horizontal,
}

class CollectionViewFlowLayout {

    public itemFrames: Rect[] = []
    public contentSize: { width: number, height: number } = { width: 0, height: 0 }

    constructor(readonly collectionView: CollectionView) {

    }

    reload() {
        this.contentSize.width = 0
        this.contentSize.height = 0
        if (this.collectionView.scrollDirection === CollectionViewScrollDirection.Vertical) {
            const wrapWidth = this.collectionView.bounds.width - this.collectionView.edgeInsets.left - this.collectionView.edgeInsets.right
            const itemSizes = this.collectionView.items.map(item => {
                return item.itemSize(this.collectionView.bounds.width, this.collectionView.bounds.height)
            })
            const sizeEqually = itemSizes.length > 0 && itemSizes.every(v => {
                return v.width == itemSizes[0].width && v.height == itemSizes[0].height
            })
            let firstItem = false
            let currentX = 0
            let currentY = 0
            let lineHeight = 0;
            let lineContentWidth = 0;
            let lastItemGap = 0;
            let lineStartIndex = 0;
            let lineEndIndex = -1;
            this.itemFrames = itemSizes.map((item, idx) => {
                if (idx > lineEndIndex) {
                    firstItem = true
                    currentX = 0
                    if (lineEndIndex > -1) {
                        currentY += lineHeight + this.collectionView.lineSpacing
                    }
                }
                if (firstItem) {
                    lastItemGap = (wrapWidth - lineContentWidth) / (lineEndIndex - lineStartIndex)
                    lineContentWidth = 0;
                    lineHeight = 0;
                    lineStartIndex = idx;
                    lineEndIndex = idx;
                    let left = 0;
                    for (let index = idx; index < itemSizes.length; index++) {
                        const elementSize = itemSizes[index]
                        lineHeight = Math.max(lineHeight, elementSize.height)
                        lineContentWidth += elementSize.width
                        left += this.collectionView.itemSpacing + elementSize.width
                        if (left > wrapWidth) {
                            lineEndIndex = index;
                            break;
                        }
                        else if (index + 1 < itemSizes.length &&
                            left + itemSizes[index + 1].width > wrapWidth) {
                            lineEndIndex = index;
                            break;
                        }
                        else {
                            lineEndIndex = Infinity;
                        }
                    }
                    firstItem = false
                }
                const frame = RectMake(this.collectionView.edgeInsets.left + currentX, this.collectionView.edgeInsets.top + currentY + (lineHeight - item.height) / 2.0, item.width, item.height)
                this.contentSize.width = Math.max(this.contentSize.width, frame.x + frame.width + this.collectionView.edgeInsets.right)
                this.contentSize.height = Math.max(this.contentSize.height, frame.y + frame.height + this.collectionView.edgeInsets.bottom)
                if (lineEndIndex === Infinity) {
                    if (sizeEqually) {
                        currentX += frame.width + lastItemGap
                    }
                    else {
                        currentX += frame.width + this.collectionView.itemSpacing
                    }
                }
                else if (lineEndIndex - lineStartIndex > 0) {
                    currentX += frame.width + (wrapWidth - lineContentWidth) / (lineEndIndex - lineStartIndex)
                }
                return frame
            })
        }
        else if (this.collectionView.scrollDirection === CollectionViewScrollDirection.Horizontal) {
            const wrapHeight = this.collectionView.bounds.height - this.collectionView.edgeInsets.top - this.collectionView.edgeInsets.bottom
            const itemSizes = this.collectionView.items.map(item => {
                return item.itemSize(this.collectionView.bounds.width, this.collectionView.bounds.height)
            })
            const sizeEqually = itemSizes.length > 0 && itemSizes.every(v => {
                return v.width == itemSizes[0].width && v.height == itemSizes[0].height
            })
            let firstItem = false
            let currentX = 0
            let currentY = 0
            let lineWidth = 0;
            let lineContentHeight = 0;
            let lastItemGap = 0;
            let lineStartIndex = 0;
            let lineEndIndex = -1;
            this.itemFrames = itemSizes.map((item, idx) => {
                if (idx > lineEndIndex) {
                    firstItem = true
                    currentY = 0
                    if (lineEndIndex > -1) {
                        currentX += lineWidth + this.collectionView.lineSpacing
                    }
                }
                if (firstItem) {
                    lastItemGap = (wrapHeight - lineContentHeight) / (lineEndIndex - lineStartIndex)
                    lineContentHeight = 0;
                    lineWidth = 0;
                    lineStartIndex = idx;
                    lineEndIndex = idx;
                    let top = 0;
                    for (let index = idx; index < itemSizes.length; index++) {
                        const elementSize = itemSizes[index]
                        lineWidth = Math.max(lineWidth, elementSize.width)
                        lineContentHeight += elementSize.height
                        top += this.collectionView.itemSpacing + elementSize.height
                        if (top > wrapHeight) {
                            lineEndIndex = index;
                            break;
                        }
                        else if (index + 1 < itemSizes.length &&
                            top + itemSizes[index + 1].height > wrapHeight) {
                            lineEndIndex = index;
                            break;
                        }
                        else {
                            lineEndIndex = Infinity;
                        }
                    }
                    firstItem = false
                }
                const frame = RectMake(this.collectionView.edgeInsets.left + currentX + (lineWidth - item.width) / 2.0, this.collectionView.edgeInsets.top + currentY, item.width, item.height)
                this.contentSize.width = Math.max(this.contentSize.width, frame.x + frame.width + this.collectionView.edgeInsets.right)
                this.contentSize.height = Math.max(this.contentSize.height, frame.y + frame.height + this.collectionView.edgeInsets.bottom)
                if (lineEndIndex === Infinity) {
                    if (sizeEqually) {
                        currentY += frame.height + lastItemGap
                    }
                    else {
                        currentY += frame.height + this.collectionView.itemSpacing
                    }
                }
                else if (lineEndIndex - lineStartIndex > 0) {
                    currentY += frame.height + (wrapHeight - lineContentHeight) / (lineEndIndex - lineStartIndex)
                }
                return frame
            })
        }
    }

}

export class CollectionView extends ScrollView {

    private layout = new CollectionViewFlowLayout(this)

    constructor() {
        super()
        this.alwaysBounceVertical = true;
    }

    private _previousBounds = this.bounds

    layoutSubviews() {
        super.layoutSubviews()
        if (!RectEqual(this._previousBounds, this.bounds)) {
            this._previousBounds = this.bounds
            this.reloadData()
        }
    }

    toObject(): any {
        return {
            ...super.toObject(),
            class: "UI.CollectionView",
            items: this.items,
            subviews: undefined,
        }
    }

    private _scrollDirection: CollectionViewScrollDirection = CollectionViewScrollDirection.Vertical

	public get scrollDirection(): CollectionViewScrollDirection  {
		return this._scrollDirection;
	}

	public set scrollDirection(value: CollectionViewScrollDirection ) {
        this._scrollDirection = value;
        this.showsVerticalScrollIndicator = value === CollectionViewScrollDirection.Vertical
        this.showsHorizontalScrollIndicator = value === CollectionViewScrollDirection.Horizontal
	}

    items: CollectionItem[]

    private reuseMapping: { [key: string]: typeof CollectionCell } = {};
    private reuseContexts: { [key: string]: any } = {};

    register(clazz: typeof CollectionCell, reuseIdentifier: string, context: any = undefined) {
        this.reuseMapping[reuseIdentifier] = clazz;
        this.reuseContexts[reuseIdentifier] = context;
    }

    edgeInsets: Insets = InsetsMake(0, 0, 0, 0)
    lineSpacing: number = 0
    itemSpacing: number = 0

    reloadData() {
        this.layout.reload()
        this.contentSize = SizeMake(this.layout.contentSize.width, this.layout.contentSize.height)
        this.reloadVisibleItems()
    }

    scrollerDidScroll() {
        super.scrollerDidScroll()
        if (this._reusingCells !== undefined) {
            this.reloadVisibleItems()
        }
    }

    private _reusingCells: CollectionCell[] = []

    reloadVisibleItems() {
        let contentOffset = { ...this.contentOffset };
        let contentSize = this.contentSize;
        let bounds = this.bounds;
        contentOffset.y = Math.max(0.0, Math.min(contentSize.height - bounds.height, contentOffset.y))
        this.markInvisibleCellNoBusy(contentOffset, bounds);
        let visibleIndexes: number[] = []
        const visibleRect = RectMake(contentOffset.x, contentOffset.y, bounds.width, bounds.height)
        this.layout.itemFrames.forEach((itemFrame, idx) => {
            if (itemFrame.x + itemFrame.width >= visibleRect.x &&
                itemFrame.x <= visibleRect.x + visibleRect.width &&
                itemFrame.y + itemFrame.height >= visibleRect.y &&
                itemFrame.y <= visibleRect.y + visibleRect.height) {
                visibleIndexes.push(idx)
            }
        })
        const renderingIndexes = visibleIndexes.filter(index => {
            return this._reusingCells.filter(cell => cell._isBusy && cell.currentItem === this.items[index]).length == 0
        })
        const visibleCells: CollectionCell[] = renderingIndexes.map(index => {
            const dataItem = this.items[index]
            const cell = this._reusingCells.filter(cell => { return !cell._isBusy && cell.reuseIdentifier === dataItem.reuseIdentifier })[0]
                || (this.reuseMapping[dataItem.reuseIdentifier] !== undefined ? new this.reuseMapping[dataItem.reuseIdentifier]() : undefined)
                || new CollectionCell();
            cell.reuseIdentifier = dataItem.reuseIdentifier
            cell.context = this.reuseContexts[dataItem.reuseIdentifier]
            cell.frame = this.layout.itemFrames[index]
            cell._isBusy = true
            cell.currentItem = dataItem
            cell.didRender()
            if (this._reusingCells.indexOf(cell) < 0) {
                this._reusingCells.push(cell)
            }
            return cell
        })
        visibleCells.forEach(cell => {
            if (cell.superview == undefined) {
                this.addSubview(cell)
            }
        })
    }

    private markInvisibleCellNoBusy(contentOffset: Point, bounds: Rect) {
        let contentSize = this.contentSize;
        if (this.scrollDirection == CollectionViewScrollDirection.Horizontal) {
            if (contentOffset.x < 0.0) {
                return;
            }
            if (contentOffset.x > contentSize.width - bounds.width) {
                return;
            }
            this._reusingCells.filter(cell => {
                if (cell._isBusy) {
                    const cellFrame = cell.frame;
                    return cellFrame.x + cellFrame.width < contentOffset.x
                        || cellFrame.x > contentOffset.x + bounds.width
                }
                return false
            }).forEach(cell => {
                cell._isBusy = false;
            });
        }
        else if (this.scrollDirection == CollectionViewScrollDirection.Vertical) {
            if (contentOffset.y < 0.0) {
                return;
            }
            if (contentOffset.y > contentSize.height - bounds.height) {
                return;
            }
            this._reusingCells.filter(cell => {
                if (cell._isBusy) {
                    const cellFrame = cell.frame;
                    return cellFrame.y + cellFrame.height < contentOffset.y
                        || cellFrame.y > contentOffset.y + bounds.height
                }
                return false
            }).forEach(cell => {
                cell._isBusy = false;
            });
        }
    }

}