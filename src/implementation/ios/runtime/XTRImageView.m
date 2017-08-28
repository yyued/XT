//
//  XTRImageView.m
//  XTSample
//
//  Created by 崔明辉 on 2017/8/28.
//  Copyright © 2017年 UED Center, YY Inc. All rights reserved.
//

#import "XTRImageView.h"
#import "XTRUtils.h"
#import "XTRImage.h"

@interface XTRImageView ()

@property (nonatomic, strong) UIImageView *innerView;
@property (nonatomic, strong) JSContext *context;
@property (nonatomic, strong) JSManagedValue *scriptObject;

@end

@implementation XTRImageView

+ (NSString *)name {
    return @"XTRImageView";
}

+ (XTRImageView *)create:(JSValue *)frame scriptObject:(JSValue *)scriptObject {
    XTRImageView *view = [[XTRImageView alloc] initWithFrame:[frame toRect]];
    view.innerView = [[UIImageView alloc] init];
    [view addSubview:view.innerView];
    view.objectUUID = [[NSUUID UUID] UUIDString];
    view.context = scriptObject.context;
    view.scriptObject = [JSManagedValue managedValueWithValue:scriptObject andOwner:view];
    return view;
}

- (void)xtr_setImage:(JSValue *)image {
    XTRImage *nativeObject = [image toImage];
    if (nativeObject) {
        self.innerView.image = nativeObject.nativeImage;
    }
    else {
        self.innerView.image = nil;
    }
}

- (void)setContentMode:(UIViewContentMode)contentMode {
    [super setContentMode:contentMode];
    self.innerView.contentMode = contentMode;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.innerView.frame = self.bounds;
}

@end
