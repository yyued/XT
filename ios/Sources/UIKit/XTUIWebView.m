//
//  XTUIWebView.m
//  XTSample
//
//  Created by 崔明辉 on 2018/1/22.
//  Copyright © 2018年 UED Center, YY Inc. All rights reserved.
//

#import "XTUIWebView.h"
#import "XTContext.h"
#import "XTMemoryManager.h"
#import <WebKit/WebKit.h>

@interface XTUIWebView()<WKNavigationDelegate>

@property (nonatomic, strong) WKWebView *innerView;

@end

@implementation XTUIWebView

+ (NSString *)name {
    return @"_XTUIWebView";
}

+ (void)xtr_loadWithURLString:(NSString *)URLString objectRef:(NSString *)objectRef {
    XTUIWebView *view = [XTMemoryManager find:objectRef];
    if ([view isKindOfClass:[XTUIWebView class]]) {
        [view.innerView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:URLString]]];
    }
}

- (void)dealloc {
    self.innerView.navigationDelegate = nil;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        _innerView = [[WKWebView alloc] init];
        _innerView.navigationDelegate = self;
        [self addSubview:_innerView];
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.innerView.frame = self.bounds;
}

#pragma mark - WKNavigationDelegate

- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation {
    if (self.scriptObject) {
        [self.scriptObject invokeMethod:@"handleStart" withArguments:nil];
    }
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    if (self.scriptObject) {
        [self.scriptObject invokeMethod:@"handleFinish" withArguments:nil];
    }
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(null_unspecified WKNavigation *)navigation withError:(nonnull NSError *)error {
    if (self.scriptObject) {
        [self.scriptObject invokeMethod:@"handleFail" withArguments:@[error.localizedDescription ?: @""]];
    }
}

@end
