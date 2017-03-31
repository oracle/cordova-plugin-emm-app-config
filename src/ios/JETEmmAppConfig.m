/**
 * Copyright (c) 2016 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

#include <sys/types.h>
#include <sys/sysctl.h>

#import <Cordova/CDV.h>
#import "JETEmmAppConfig.h"

@implementation JETEmmAppConfig

// The Managed app configuration dictionary pushed down from an MDM server are stored in this key.
static NSString * const kConfigurationKey = @"com.apple.configuration.managed";


// Initial get of app config
- (void)getConfigInfo:(CDVInvokedUrlCommand*)command
{
  [self syncAppConfig:command.callbackId keepCallback:NO];
}


// Sync app config to Javascript
- (void)syncAppConfig:(NSString*)callbackId keepCallback:(BOOL)keepCallback
{
  NSDictionary *appConfig = [[NSUserDefaults standardUserDefaults] dictionaryForKey:kConfigurationKey];

  if (appConfig == nil)
  {
    appConfig = @{};
  }

  CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:appConfig];

  [pluginResult setKeepCallbackAsBool:keepCallback];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
}


// Register app config change listener
- (void)registerChangedListener:(CDVInvokedUrlCommand*)command
{
  JETEmmAppConfig * __weak weakSelf = self; 
  
  // Add Notification Center observer to be alerted of any change to NSUserDefaults.
  // Managed app configuration changes pushed down from an MDM server appear in NSUSerDefaults.
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  
  // Only one observer is needed, so remove any previously added observer
  if (_changeObserver != nil)
  {
    [center removeObserver:_changeObserver];  
  }
  
  _changeObserver = [center addObserverForName:NSUserDefaultsDidChangeNotification
                            object:nil
                            queue:[NSOperationQueue mainQueue]
                            usingBlock:^(NSNotification *note) {
                              if (command.callbackId != nil)
                              {
                                [weakSelf syncAppConfig:command.callbackId keepCallback:YES];
                              }
                            }];
}


- (void)dealloc
{
  if (_changeObserver != nil)
  {
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center removeObserver:_changeObserver];
    _changeObserver = nil;
  }
}

@end
