//
//  XTUIHRView.h
//  XTSample
//
//  Created by 崔明辉 on 2018/1/4.
//  Copyright © 2018年 UED Center, YY Inc. All rights reserved.
//

#import "XTUIView.h"
#import "XTComponent.h"

@protocol XTUIHRViewExport <XTUIViewExport, JSExport>

+ (NSInteger)xtr_position:(NSString *)objectRef;
+ (void)xtr_setPosition:(NSInteger)value objectRef:(NSString *)objectRef;
+ (NSDictionary *)xtr_color:(NSString *)objectRef;
+ (void)xtr_setColor:(JSValue *)color objectRef:(NSString *)objectRef;

@end

@interface XTUIHRView : XTUIView<XTComponent, XTUIHRViewExport>

@end
