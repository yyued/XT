//
//  XTUITableView.m
//  XTSample
//
//  Created by 崔明辉 on 2017/8/30.
//  Copyright © 2017年 UED Center, YY Inc. All rights reserved.
//

#import "XTUIListView.h"
#import "XTUIUtils.h"
#import "XTUILayoutConstraint.h"
#import "XTContext.h"
#import "XTUIListCell.h"
#import "XTContext.h"
#import "XTUIWindow.h"
#import "XTUIRefreshControl.h"
#import "XTUILoadMoreControl.h"
#import "XTMemoryManager.h"

@interface XTUIListView ()<UIScrollViewDelegate, UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, readwrite) UITableView *innerView;
@property (nonatomic, strong) XTUIRefreshControl *myRefreshControl;
@property (nonatomic, strong) XTUILoadMoreControl *loadMoreControl;
@property (nonatomic, copy) NSArray<NSDictionary *> *items;
@property (nonatomic, strong) NSMutableSet *retainViews;

@end

@implementation XTUIListView

+ (NSString *)name {
    return @"_XTUIListView";
}

+ (NSString *)xtr_refreshControl:(NSString *)objectRef {
    XTUIListView *listView = [XTMemoryManager find:objectRef];
    if ([listView isKindOfClass:[XTUIListView class]]) {
        if ([listView.myRefreshControl isKindOfClass:[XTUIRefreshControl class]]) {
            return [(XTUIRefreshControl *)(listView.myRefreshControl) objectUUID];
        }
    }
    return nil;
}

+ (void)xtr_setRefreshControl:(NSString *)rcRef objectRef:(NSString *)objectRef {
    XTUIListView *listView = [XTMemoryManager find:objectRef];
    if ([listView isKindOfClass:[XTUIListView class]]) {
        XTUIRefreshControl *refreshControl = [XTMemoryManager find:rcRef];
        if ([refreshControl isKindOfClass:[XTUIRefreshControl class]]) {
            listView.myRefreshControl = refreshControl;
        }
        else {
            listView.myRefreshControl = nil;
        }
    }
}

+ (NSString *)xtr_loadMoreControl:(NSString *)objectRef {
    XTUIListView *listView = [XTMemoryManager find:objectRef];
    if ([listView isKindOfClass:[XTUIListView class]]) {
        if ([listView.loadMoreControl isKindOfClass:[XTUILoadMoreControl class]]) {
            return [(XTUILoadMoreControl *)(listView.loadMoreControl) objectUUID];
        }
    }
    return nil;
}

+ (void)xtr_setLoadMoreControl:(NSString *)rcRef objectRef:(NSString *)objectRef {
    XTUIListView *listView = [XTMemoryManager find:objectRef];
    if ([listView isKindOfClass:[XTUIListView class]]) {
        XTUILoadMoreControl *loadMoreControl = [XTMemoryManager find:rcRef];
        if ([loadMoreControl isKindOfClass:[XTUILoadMoreControl class]]) {
            listView.loadMoreControl = loadMoreControl;
        }
        else {
            listView.loadMoreControl = nil;
        }
    }
}

+ (void)xtr_setItems:(JSValue *)items objectRef:(NSString *)objectRef {
    XTUIListView *view = [XTMemoryManager find:objectRef];
    if ([view isKindOfClass:[XTUIListView class]]) {
        view.items = [items toArray];
    }
}

+ (void)xtr_setHeaderView:(NSString *)viewRef objectRef:(NSString *)objectRef {
    UIView *view = [XTMemoryManager find:viewRef];
    XTUIListView *listView = [XTMemoryManager find:objectRef];
    if ([listView isKindOfClass:[XTUIListView class]]) {
        ((UITableView *)listView.innerView).tableHeaderView = [view isKindOfClass:[UIView class]] ? view : nil;
    }
}

+ (void)xtr_setFooterView:(NSString *)viewRef objectRef:(NSString *)objectRef {
    UIView *view = [XTMemoryManager find:viewRef];
    XTUIListView *listView = [XTMemoryManager find:objectRef];
    if ([listView isKindOfClass:[XTUIListView class]]) {
        ((UITableView *)listView.innerView).tableFooterView = [view isKindOfClass:[UIView class]] ? view : nil;
    }
}

+ (void)xtr_reloadData:(NSString *)objectRef {
    XTUIListView *view = [XTMemoryManager find:objectRef];
    if ([view isKindOfClass:[XTUIListView class]]) {
        [((UITableView *)view.innerView) reloadData];
    }
}

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.innerView = [[UITableView alloc] initWithFrame:frame style:UITableViewStyleGrouped];
        self.innerView.keyboardDismissMode = UIScrollViewKeyboardDismissModeOnDrag;
        [self.innerView setBackgroundColor:[UIColor clearColor]];
        self.innerView.delegate = self;
        [(UITableView *)self.innerView setDataSource:self];
        ((UITableView *)self.innerView).separatorStyle = UITableViewCellSeparatorStyleNone;
        UIView *headerView = [UIView new];
        headerView.frame = CGRectMake(0, 0, 0, 0.01);
        ((UITableView *)self.innerView).tableHeaderView = headerView;
        UIView *footerView = [UIView new];
        footerView.frame = CGRectMake(0, 0, 0, 0.01);
        ((UITableView *)self.innerView).tableFooterView = footerView;
        self.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
        if (@available(iOS 11.0, *)) {
            self.innerView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
        self.retainViews = [NSMutableSet set];
        [self addSubview:self.innerView];
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.innerView.frame = self.bounds;
}

- (UIEdgeInsets)contentInset {
    UIEdgeInsets insets = [self.innerView contentInset];
    return UIEdgeInsetsMake(insets.top, insets.left, insets.bottom, insets.right);
}

- (void)setContentInset:(UIEdgeInsets)contentInset {
    [self.innerView setContentInset:UIEdgeInsetsMake(contentInset.top, contentInset.left, contentInset.bottom, contentInset.right)];
}

- (void)dealloc {
    ((UITableView *)self.innerView).delegate = nil;
    ((UITableView *)self.innerView).dataSource = nil;
#ifdef LOGDEALLOC
    NSLog(@"XTUIListView dealloc.");
#endif
}

- (void)setItems:(NSArray<NSDictionary *> *)items {
    _items = items;
    [_items enumerateObjectsUsingBlock:^(NSDictionary * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        {
            NSString *objectRef = obj[@"__headerViewObjectRef"];
            if ([objectRef isKindOfClass:[NSString class]]) {
                UIView *view = [XTMemoryManager find:objectRef];
                if ([view isKindOfClass:[UIView class]]) {
                    [self.retainViews addObject:view];
                }
            }
        }
        {
            NSString *objectRef = obj[@"__footerViewObjectRef"];
            if ([objectRef isKindOfClass:[NSString class]]) {
                UIView *view = [XTMemoryManager find:objectRef];
                if ([view isKindOfClass:[UIView class]]) {
                    [self.retainViews addObject:view];
                }
            }
        }
    }];
}

- (void)setMyRefreshControl:(XTUIRefreshControl *)myRefreshControl {
    if (@available(iOS 10.0, *)) {
        [self.innerView setRefreshControl:myRefreshControl];
    }
    else {
        if (_myRefreshControl != nil) {
            [_myRefreshControl removeFromSuperview];
        }
        [self.innerView addSubview:myRefreshControl];
    }
    _myRefreshControl = myRefreshControl;
}

#pragma mark - UITableViewDelegate & UITableViewDatasource

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    JSValue *value = self.scriptObject;
    if (value != nil) {
        [value invokeMethod:@"handleScroll" withArguments:@[]];
    }
    if (scrollView.contentOffset.y + scrollView.bounds.size.height > scrollView.contentSize.height - 200.0) {
        [self tableViewWillTriggerLoadMoreControl];
    }
}

- (void)tableViewWillTriggerLoadMoreControl {
    if (self.loadMoreControl != nil) {
        self.loadMoreControl.listView = self;
        if (self.loadMoreControl.enabled && !self.loadMoreControl.isLoading) {
            [self.loadMoreControl startLoading];
        }
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section {
    if (section < self.items.count) {
        NSString *objectRef = self.items[section][@"__headerViewObjectRef"];
        if ([objectRef isKindOfClass:[NSString class]]) {
            UIView *view = [XTMemoryManager find:objectRef];
            if ([view isKindOfClass:[UIView class]]) {
                return view.frame.size.height;
            }
        }
    }
    return CGFLOAT_MIN;
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section {
    if (section < self.items.count) {
        NSString *objectRef = self.items[section][@"__headerViewObjectRef"];
        if ([objectRef isKindOfClass:[NSString class]]) {
            UIView *view = [XTMemoryManager find:objectRef];
            if ([view isKindOfClass:[UIView class]]) {
                return view;
            }
        }
    }
    return nil;
}


- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section {
    if (section < self.items.count) {
        NSString *objectRef = self.items[section][@"__footerViewObjectRef"];
        if ([objectRef isKindOfClass:[NSString class]]) {
            UIView *view = [XTMemoryManager find:objectRef];
            if ([view isKindOfClass:[UIView class]]) {
                return view.frame.size.height;
            }
        }
    }
    return CGFLOAT_MIN;
}

- (UIView *)tableView:(UITableView *)tableView viewForFooterInSection:(NSInteger)section {
    if (section < self.items.count) {
        NSString *objectRef = self.items[section][@"__footerViewObjectRef"];
        if ([objectRef isKindOfClass:[NSString class]]) {
            UIView *view = [XTMemoryManager find:objectRef];
            if ([view isKindOfClass:[UIView class]]) {
                return view;
            }
        }
    }
    return nil;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return [self.items count];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    if (section < self.items.count) {
        NSArray *items = self.items[section][@"items"];
        if ([items isKindOfClass:[NSArray class]]) {
            return items.count;
        }
    }
    return 0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSString *reuseIdentifier = @"Cell";
    if (indexPath.section < self.items.count) {
        NSArray *items = self.items[indexPath.section][@"items"];
        if ([items isKindOfClass:[NSArray class]]) {
            if (indexPath.row < items.count) {
                reuseIdentifier = items[indexPath.row][@"reuseIdentifier"];
                if (![reuseIdentifier isKindOfClass:[NSString class]]) {
                    reuseIdentifier = @"Cell";
                }
            }
        }
    }
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:reuseIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:reuseIdentifier];
        cell.backgroundColor = [UIColor clearColor];
    }
    if ([[cell contentView] viewWithTag:1000] == nil) {
        if (self.scriptObject != nil) {
            NSString *innerViewRef = [self.scriptObject invokeMethod:@"requestRowCell" withArguments:@[@(indexPath.row), @(indexPath.section)]].toString;
            UIView *innerView = [XTMemoryManager find:innerViewRef];
            if ([innerView isKindOfClass:[UIView class]]) {
                innerView.tag = 1000;
                innerView.frame = cell.contentView.bounds;
                innerView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
                [[cell contentView] addSubview:innerView];
            }
        }
    }
    if ([[[cell contentView] viewWithTag:1000] isKindOfClass:[XTUIListCell class]]) {
        XTUIListCell *fakeCell = [[cell contentView] viewWithTag:1000];
        [fakeCell setRealCell:cell];
        if (self.scriptObject != nil) {
            [self.scriptObject invokeMethod:@"handleRenderItem"
                                        withArguments:@[
                                                        @(indexPath.row),
                                                        @(indexPath.section),
                                                        (fakeCell.objectUUID ?: [NSNull null]),
                                                        ]];
        }
    }
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    if (self.scriptObject != nil) {
        CGFloat rowHeight = [[self.scriptObject invokeMethod:@"requestRowHeight"
                                               withArguments:@[@(tableView.bounds.size.width), @(indexPath.row), @(indexPath.section)]] toDouble];
        return MAX(0.0, rowHeight);
    }
    return 88.0;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    if (cell != nil) {
        if ([[[cell contentView] viewWithTag:1000] isKindOfClass:[XTUIListCell class]]) {
            XTUIListCell *fakeCell = [[cell contentView] viewWithTag:1000];
            if (fakeCell.scriptObject != nil) {
                [fakeCell.scriptObject invokeMethod:@"handleSelected" withArguments:@[]];
            }
        }
    }
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
}

- (void)tableView:(UITableView *)tableView didHighlightRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    if (cell != nil) {
        if ([[[cell contentView] viewWithTag:1000] isKindOfClass:[XTUIListCell class]]) {
            XTUIListCell *fakeCell = [[cell contentView] viewWithTag:1000];
            if (fakeCell.scriptObject != nil) {
                [fakeCell.scriptObject invokeMethod:@"didHighlighted" withArguments:@[@(YES)]];
            }
        }
    }
}

- (void)tableView:(UITableView *)tableView didUnhighlightRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    if (cell != nil) {
        if ([[[cell contentView] viewWithTag:1000] isKindOfClass:[XTUIListCell class]]) {
            XTUIListCell *fakeCell = [[cell contentView] viewWithTag:1000];
            if (fakeCell.scriptObject != nil) {
                [fakeCell.scriptObject invokeMethod:@"didHighlighted" withArguments:@[@(NO)]];
            }
        }
    }
}

@end
