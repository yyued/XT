//
//  ModulizeStartViewController.m
//  XTSample
//
//  Created by 崔明辉 on 2017/11/15.
//  Copyright © 2017年 UED Center, YY Inc. All rights reserved.
//

#import "ModulizeStartViewController.h"
#import "XTUIContext.h"
#import "XTFoundationContext.h"
#import "XTDebug.h"
#import <MBProgressHUD/MBProgressHUD.h>

@interface ModulizeStartViewController ()

@property (nonatomic, strong) XTUIContext *context;

@end

@implementation ModulizeStartViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"XT Sample";
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    self.context = nil;
}

- (IBAction)onStart:(id)sender {
    NSURL *sampleURL = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"app.min" ofType:@"js"]
                                  isDirectory:NO];
//    NSURL *sampleURL = [NSURL URLWithString:@"http://xt-playground.oss-cn-shenzhen.aliyuncs.com/tmp_94423207.10000005_0.17082901325064914.min.js"];
    NSInteger startMode = 1;
    self.context = [[XTUIContext alloc] initWithSourceURL:sampleURL
                                                  options:@{@"foo": @"value"}
                                          completionBlock:^(UIViewController * _Nullable rootViewController) {
                                              if (startMode == 0) {
                                                  [self.navigationController pushViewController:rootViewController
                                                                                       animated:YES];
                                             	 }
                                              else if (startMode == 1) {
                                                  [self presentViewController:rootViewController animated:YES completion:nil];
                                              }
                                              else if (startMode == 2) {
                                                  [self addChildViewController:rootViewController];
                                                  [self.view addSubview:rootViewController.view];
                                                  rootViewController.view.frame = CGRectMake(0,
                                                                                             self.view.bounds.size.height - 180,
                                                                                             self.view.bounds.size.width,
                                                                                             180);
                                              }
                                          } failureBlock:nil];
}

- (IBAction)onDebug:(id)sender {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Enter IP & Port"
                                                                             message:nil
                                                                      preferredStyle:UIAlertControllerStyleAlert];
    [alertController addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.text = [[NSUserDefaults standardUserDefaults] valueForKey:@"XTDebugIP"] ?: @"127.0.0.1";
        textField.placeholder = @"IP Address";
    }];
    [alertController addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.text = [[NSUserDefaults standardUserDefaults] valueForKey:@"XTDebugPort"] ?: @"8081";
        textField.placeholder = @"Port";
    }];
    [alertController addAction:[UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        
    }]];
    [alertController addAction:[UIAlertAction actionWithTitle:@"Go" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [[NSUserDefaults standardUserDefaults] setValue:alertController.textFields[0].text ?: @"" forKey:@"XTDebugIP"];
        [[NSUserDefaults standardUserDefaults] setValue:alertController.textFields[1].text ?: @"" forKey:@"XTDebugPort"];
        [XTUIContext debugWithIP:alertController.textFields[0].text
                            port:alertController.textFields[1].text.integerValue
            navigationController:self.navigationController];
    }]];
    [self presentViewController:alertController animated:YES completion:nil];
}

@end
