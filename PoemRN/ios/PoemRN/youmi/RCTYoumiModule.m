//
//  RCTMainModule.m
//  SbbTest1
//
//  Created by bb s on 2018/10/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RCTYoumiModule.h"
#import "AppDelegate.h"
#import "VideoAdViewController.h"
#import "VideoAdViewController.h"

@implementation RCTYoumiModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openNativeVC) {
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *delegate = (AppDelegate *)([UIApplication sharedApplication].delegate);
    UIViewController *rootVC = delegate.window.rootViewController;
    VideoAdViewController *nativeVC = [[VideoAdViewController alloc] init];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:nativeVC];
    [rootVC presentViewController:nav animated:YES completion:nil];
  });
}

@end
