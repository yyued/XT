//
//  XTRComponent.h
//  XTSample
//
//  Created by 崔明辉 on 2017/8/24.
//  Copyright © 2017年 UED Center, YY Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

@protocol XTComponent <NSObject>

@property (nonatomic, copy) NSString *objectUUID;

+ (NSString *)name;

@end
