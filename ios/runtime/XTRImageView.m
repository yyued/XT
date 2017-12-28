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
#import "XTRContext.h"
#import <XT-Mem/XTMemoryManager.h>

@interface XTRImageView ()

@property (nonatomic, strong) XTRImage *privateImage;
@property (nonatomic, strong) UIImageView *innerView;

@end

@implementation XTRImageView

+ (NSString *)name {
    return @"XTRImageView";
}

+ (NSString *)create:(JSValue *)frame {
    XTRImageView *view = [[XTRImageView alloc] initWithFrame:[frame toRect]];
    view.innerView = [[UIImageView alloc] init];
    [view addSubview:view.innerView];
    XTManagedObject *managedObject = [[XTManagedObject alloc] initWithObject:view];
    [XTMemoryManager add:managedObject];
    view.context = [JSContext currentContext];
    view.objectUUID = managedObject.objectUUID;
    return managedObject.objectUUID;
}

+ (void)xtr_setImage:(NSString *)imageRef objectRef:(NSString *)objectRef {
    XTRImageView *view = [XTMemoryManager find:objectRef];
    if ([view isKindOfClass:[XTRImageView class]]) {
        XTRImage *img = [XTMemoryManager find:imageRef];
        if ([img isKindOfClass:[XTRImage class]]) {
            view.privateImage = img;
            view.innerView.image = img.image;
        }
        else {
            view.privateImage = nil;
            view.innerView.image = nil;
        }
    }
}

- (CGSize)intrinsicContentSize {
    return self.innerView.intrinsicContentSize;
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
