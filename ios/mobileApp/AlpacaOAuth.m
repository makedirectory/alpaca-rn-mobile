//
//  AlpacaOAuth.m
//  mobileApp
//
//  Created by matata on 11/20/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AlpacaOAuth, NSObject)

RCT_EXTERN_METHOD(AuthStart:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
