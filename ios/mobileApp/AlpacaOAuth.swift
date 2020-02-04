//
//  AlpacaOAuth.swift
//  mobileApp
//
//  Created by matata on 11/20/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import SafariServices

@objc(AlpacaOAuth)
class AlpacaOAuth: NSObject {
  
  private var authSession: SFAuthenticationSession?
  
  @objc func AuthStart(_ url: String,
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    let webOAuthUrl = URL(string: url)!
    
    authSession = SFAuthenticationSession(url: webOAuthUrl, callbackURLScheme: "alpacamobile://") { url, error in
      let urlStr = url?.relativeString
      if (error == nil) {
        resolve(urlStr)
      } else {
        resolve("")
      }
    }
    authSession?.start()
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
