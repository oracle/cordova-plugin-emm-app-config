/**
 * Copyright (c) 2016 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

#import <UIKit/UIKit.h>
#import <Cordova/CDVPlugin.h>

@interface JETEmmAppConfig : CDVPlugin
{
  id _changeObserver;
}

-(void)dealloc;
@end
