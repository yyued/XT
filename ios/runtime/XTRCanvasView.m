//
//  XTRCanvasView.m
//  XTSample
//
//  Created by 崔明辉 on 2017/9/21.
//  Copyright © 2017年 UED Center, YY Inc. All rights reserved.
//

#import "XTRCanvasView.h"
#import "XTRUtils.h"
#import "XTRContext.h"

@interface XTRCanvasState: NSObject<NSCopying>

@property (nonatomic, assign) CGFloat globalAlpha;
@property (nonatomic, strong) UIColor *fillStyle;
@property (nonatomic, strong) UIColor *strokeStyle;
@property (nonatomic, strong) NSString *lineCap;
@property (nonatomic, strong) NSString *lineJoin;
@property (nonatomic, assign) CGFloat lineWidth;
@property (nonatomic, assign) CGFloat miterLimit;
@property (nonatomic, assign) CGAffineTransform currentTransform;

@end

@implementation XTRCanvasState

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.globalAlpha = 1.0;
        self.lineWidth = 1.0;
        self.currentTransform = CGAffineTransformIdentity;
    }
    return self;
}

- (nonnull id)copyWithZone:(nullable NSZone *)zone {
    XTRCanvasState *newState = [XTRCanvasState allocWithZone:zone];
    newState.globalAlpha = self.globalAlpha;
    newState.fillStyle = self.fillStyle;
    newState.strokeStyle = self.strokeStyle;
    newState.lineCap = self.lineCap;
    newState.lineJoin = self.lineJoin;
    newState.lineWidth = self.lineWidth;
    newState.miterLimit = self.miterLimit;
    newState.currentTransform = self.currentTransform;
    return newState;
}

@end

@interface XTRCanvasView()

@property (nonatomic, strong) JSContext *context;
@property (nonatomic, strong) JSManagedValue *scriptObject;
@property (nonatomic, strong) XTRCanvasState *currentState;
@property (nonatomic, copy) NSArray *stateStack;
@property (nonatomic, strong) UIBezierPath *currentPath;

@end

@implementation XTRCanvasView

+ (NSString *)name {
    return @"XTRCanvasView";
}

+ (NSString *)create:(JSValue *)frame scriptObject:(JSValue *)scriptObject {
    XTRCanvasView *view = [[XTRCanvasView alloc] initWithFrame:[frame toRect]];
    view.currentState = [XTRCanvasState new];
    view.backgroundColor = [UIColor clearColor];
    view.objectUUID = [[NSUUID UUID] UUIDString];
    view.context = (id)scriptObject.context;
    [((XTRContext *)[JSContext currentContext]).objectRefs store:view];
    [[NSOperationQueue mainQueue] addOperationWithBlock:^{ [view description]; }];
    return view.objectUUID;
}

- (CGFloat)xtr_globalAlpha {
    return self.currentState.globalAlpha;
}

- (void)xtr_setGlobalAlpha:(CGFloat)globalAlpha {
    self.currentState.globalAlpha = globalAlpha;
}

- (NSDictionary *)xtr_fillStyle {
    return [JSValue fromColor:self.currentState.fillStyle];
}

- (void)xtr_setFillStyle:(JSValue *)fillStyle {
    self.currentState.fillStyle = [fillStyle toColor];
}

- (NSDictionary *)xtr_strokeStyle {
    return [JSValue fromColor:self.currentState.strokeStyle];
}

- (void)xtr_setStrokeStyle:(JSValue *)strokeStyle {
    self.currentState.strokeStyle = [strokeStyle toColor];
}

- (NSString *)xtr_lineCap {
    return self.currentState.lineCap;
}

- (void)xtr_setLineCap:(NSString *)lineCap {
    self.currentState.lineCap = lineCap;
}

- (NSString *)xtr_lineJoin {
    return self.currentState.lineJoin;
}

- (void)xtr_setLineJoin:(NSString *)lineJoin {
    self.currentState.lineJoin = lineJoin;
}

- (CGFloat)xtr_lineWidth {
    return self.currentState.lineWidth;
}

- (void)xtr_setLineWidth:(CGFloat)lineWidth {
    self.currentState.lineWidth = lineWidth;
}

- (CGFloat)xtr_miterLimit {
    return self.currentState.miterLimit;
}

- (void)xtr_setMiterLimit:(CGFloat)miterLimit {
    self.currentState.miterLimit = miterLimit;
}

- (void)xtr_rect:(JSValue *)rect {
    self.currentPath = [UIBezierPath bezierPathWithRect:[rect toRect]];
}

- (void)xtr_fillRect:(JSValue *)rect {
    [self xtr_rect:rect];
    [self xtr_fill];
}

- (void)xtr_strokeRect:(JSValue *)rect {
    [self xtr_rect:rect];
    [self xtr_stroke];
}

- (void)xtr_fill {
    if (self.currentPath != nil) {
        CAShapeLayer *layer = [CAShapeLayer layer];
        layer.transform = CATransform3DMakeAffineTransform(self.currentState.currentTransform);
        [layer setPath:[self.currentPath CGPath]];
        [layer setFillColor:[(self.currentState.fillStyle ?: [UIColor blackColor]) CGColor]];
        [layer setOpacity:self.currentState.globalAlpha];
        [layer setStrokeColor:[UIColor clearColor].CGColor];
        [self.layer addSublayer:layer];
    }
}

- (void)xtr_stroke {
    if (self.currentPath != nil) {
        CAShapeLayer *layer = [CAShapeLayer layer];
        layer.transform = CATransform3DMakeAffineTransform(self.currentState.currentTransform);
        [layer setPath:[self.currentPath CGPath]];
        [layer setStrokeColor:[(self.currentState.strokeStyle ?: [UIColor blackColor]) CGColor]];
        [layer setOpacity:self.currentState.globalAlpha];
        if ([self.currentState.lineCap isEqualToString:@"butt"]) {
            layer.lineCap = @"butt";
        }
        else if ([self.currentState.lineCap isEqualToString:@"round"]) {
            layer.lineCap = @"round";
        }
        else if ([self.currentState.lineCap isEqualToString:@"square"]) {
            layer.lineCap = @"suqare";
        }
        if ([self.currentState.lineJoin isEqualToString:@"bevel"]) {
            layer.lineJoin = @"bevel";
        }
        else if ([self.currentState.lineJoin isEqualToString:@"miter"]) {
            layer.lineJoin = @"miter";
        }
        else if ([self.currentState.lineJoin isEqualToString:@"round"]) {
            layer.lineJoin = @"round";
        }
        layer.lineWidth = self.currentState.lineWidth;
        layer.miterLimit = self.currentState.miterLimit;
        [layer setFillColor:[UIColor clearColor].CGColor];
        [self.layer addSublayer:layer];
    }
}

- (void)xtr_beginPath {
    self.currentPath = [[UIBezierPath alloc] init];
}
- (void)xtr_moveTo:(JSValue *)point {
    [self.currentPath moveToPoint:[point toPoint]];
}
- (void)xtr_closePath {
    [self.currentPath closePath];
}

- (void)xtr_lineTo:(JSValue *)point {
    [self.currentPath addLineToPoint:[point toPoint]];
}

- (void)xtr_quadraticCurveTo:(JSValue *)cpPoint xyPoint:(JSValue *)xyPoint {
    [self.currentPath addQuadCurveToPoint:[xyPoint toPoint] controlPoint:[cpPoint toPoint]];
}

- (void)xtr_bezierCurveTo:(JSValue *)cp1Point cp2Point:(JSValue *)cp2Point xyPoint:(JSValue *)xyPoint {
    [self.currentPath addCurveToPoint:[xyPoint toPoint]
                        controlPoint1:[cp1Point toPoint]
                        controlPoint2:[cp2Point toPoint]];
}

- (void)xtr_arc:(JSValue *)point r:(JSValue *)r sAngle:(JSValue *)sAngle eAngle:(JSValue *)eAngle counterclockwise:(JSValue *)counterclockwise {
    [self.currentPath addArcWithCenter:[point toPoint]
                                radius:r.toDouble
                            startAngle:sAngle.toDouble
                              endAngle:eAngle.toDouble
                             clockwise:!counterclockwise.toBool];
}

- (BOOL)xtr_isPointInPath:(JSValue *)point {
    UIBezierPath *currentPath = self.currentPath;
    if (!CGAffineTransformIsIdentity(self.currentState.currentTransform)) {
        currentPath = [UIBezierPath bezierPath];
        [currentPath appendPath:self.currentPath];
        [currentPath applyTransform:self.currentState.currentTransform];
    }
    return [currentPath containsPoint:[point toPoint]];
}

- (void)xtr_postScale:(JSValue *)point {
    self.currentState.currentTransform = CGAffineTransformScale(self.currentState.currentTransform, [point toPoint].x, [point toPoint].y);
}

- (void)xtr_postRotate:(JSValue *)angle {
    self.currentState.currentTransform = CGAffineTransformRotate(self.currentState.currentTransform, angle.toDouble);
}

- (void)xtr_postTranslate:(JSValue *)point {
    self.currentState.currentTransform = CGAffineTransformTranslate(self.currentState.currentTransform, [point toPoint].x, [point toPoint].y);
}

- (void)xtr_postTransform:(JSValue *)transform {
    self.currentState.currentTransform = CGAffineTransformConcat(self.currentState.currentTransform, [transform toTransform]);
}

- (void)xtr_setCanvasTransform:(JSValue *)transform {
    self.currentState.currentTransform = [transform toTransform];
}

- (void)xtr_save {
    NSMutableArray *stateStack = [(self.stateStack ?: @[]) mutableCopy];
    [stateStack addObject:self.currentState];
    self.stateStack = stateStack;
    self.currentState = [self.currentState copy];
}

- (void)xtr_restore {
    if ([self.stateStack count] > 0) {
        self.currentState = [self.stateStack lastObject];
        NSMutableArray *stateStack = [(self.stateStack ?: @[]) mutableCopy];
        [stateStack removeLastObject];
        self.stateStack = stateStack;
    }
}

- (void)xtr_clear {
    [self.layer.sublayers makeObjectsPerformSelector:@selector(removeFromSuperlayer)];
    self.stateStack = @[];
    self.currentState = [XTRCanvasState new];
    self.currentPath = nil;
}

@end
