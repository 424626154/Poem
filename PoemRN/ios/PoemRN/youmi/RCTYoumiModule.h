//
//  RCTMainModule.h
//  SbbTest1
//
//  Created by bb s on 2018/10/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#elif __has_include("React/RCTBridgeModule.h")
#import "React/RCTBridgeModule.h"
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RCTYoumiModule : NSObject<RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
