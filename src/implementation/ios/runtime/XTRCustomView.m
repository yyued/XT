//
//  XTRCustomView.m
//  XTSample
//
//  Created by 崔明辉 on 2017/9/26.
//  Copyright © 2017年 UED Center, YY Inc. All rights reserved.
//

#import "XTRCustomView.h"
#import "XTRUtils.h"

@interface XTRCustomView ()

@property (nonatomic, strong) UIView *innerView;
@property (nonatomic, strong) JSContext *context;
@property (nonatomic, strong) JSManagedValue *scriptObject;

@end

@implementation XTRCustomView

static NSDictionary<NSString *, NSString *> *classMapping;

+ (NSString *)name {
    return @"XTRCustomView";
}

+ (void)registerClass:(Class)viewClass className:(NSString *)className {
    if (viewClass != NULL && NSStringFromClass(viewClass) != nil && className != nil) {
        NSMutableDictionary *mutableClassMapping = [(classMapping ?: @{}) mutableCopy];
        [mutableClassMapping setObject:NSStringFromClass(viewClass) forKey:className];
        classMapping = [mutableClassMapping copy];
    }
}

+ (XTRCustomView *)create:(JSValue *)className frame:(JSValue *)frame scriptObject:(JSValue *)scriptObject {
    XTRCustomView *view = [[XTRCustomView alloc] initWithFrame:[frame toRect]];
    if ([className toString] != nil && classMapping[className.toString] != nil) {
        Class viewClass = NSClassFromString(classMapping[className.toString]);
        id viewInstane = [viewClass new];
        if ([viewInstane isKindOfClass:[UIView class]]) {
            view.innerView = viewInstane;
            [view addSubview:view.innerView];
        }
    }
    view.objectUUID = [[NSUUID UUID] UUIDString];
    view.context = scriptObject.context;
    view.scriptObject = [JSManagedValue managedValueWithValue:scriptObject andOwner:view];
    return view;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.innerView.frame = self.bounds;
}

- (void)handleMessage:(JSValue *)value {
    if ([self.innerView respondsToSelector:@selector(onMessage:customView:)]) {
        [(id<XTRCustomViewProtocol>)self.innerView onMessage:value customView:self];
    }
} 

- (void)emitMessage:(id)value {
    JSValue *inValue = self.scriptObject.value;
    if (inValue != nil) {
        [inValue invokeMethod:@"handleMessage"
                withArguments:@[[JSValue fromObject:value context:self.context] ?: [JSValue valueWithUndefinedInContext:self.context]]];
    }
}

@end
