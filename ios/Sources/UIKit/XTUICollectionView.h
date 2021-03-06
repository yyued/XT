//
//  XTUICollectionView.h
//  XTSample
//
//  Created by 崔明辉 on 2018/3/15.
//  Copyright © 2018年 UED Center, YY Inc. All rights reserved.
//

#import "XTUIScrollView.h"

@class XTUICollectionView;

@protocol XTUICollectionViewExport <XTUIViewExport, JSExport>

+ (NSString *)xtr_refreshControl:(NSString *)objectRef;
+ (void)xtr_setRefreshControl:(NSString *)rcRef objectRef:(NSString *)objectRef;
+ (NSString *)xtr_loadMoreControl:(NSString *)objectRef;
+ (void)xtr_setLoadMoreControl:(NSString *)rcRef objectRef:(NSString *)objectRef;
+ (void)xtr_registerCell:(NSString *)reuseIdentifier objectRef:(NSString *)objectRef;
+ (void)xtr_setItems:(JSValue *)items objectRef:(NSString *)objectRef;
+ (void)xtr_reloadData:(NSString *)objectRef;
+ (void)xtr_setScrollDirection:(NSInteger)value objectRef:(NSString *)objectRef;

@end

@interface XTUICollectionView : XTUIView<XTUICollectionViewExport, XTUIScrollable>

@property (nonatomic, readonly) UICollectionView *innerView;

@end
