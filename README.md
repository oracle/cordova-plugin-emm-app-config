# cordova-plugin-emm-app-config 1.0.0

This plugin defines a global `cordova.plugins.EmmAppConfig` object, which provides information on EMM application configuration (or managed app configuration).
Although the object is in the global scope, it is not available until after the `deviceready` event.

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(cordova.plugins.EmmAppConfig.getValue("serverURL"));
    }


## Installation

    cordova plugin add cordova-plugin-emm-app-config

## Methods

- getValue
- registerChangedListener

### getValue

Get value from the application configuration.

Note that even though some EMM vendors may allow date and/or binary data to be specified in
application configuration, date and binary data types are not supported by this plugin due to
limitation on passing these types of data to Javascript.  To work around this limitation,
date and binary data can be encoded and specified as strings in the application configuration.
The application can then decode them accordingly.

__Parameter__:

- __configKey__: Key of the value to get, or null to get all the values as an object.

### registerChangedListener

Register a listener that will be invoked when the application configuration is changed.

Information about what has changed is not available.  The listener should call getValue to
get the current values and decide how to handle any change.  It is also possible that
the same change will invoke the listener more than once.

On Android, application configuration is stored as restrictions.  On iOS, application 
configuration is stored in standardUserDefaults.  Any change to those storage areas will 
invoke the listener, even if the change is not within application configuration.

__Parameter__:

- __listener__: The function that will be invoked when the application configuration is changed.

## Supported Platforms

- Android
- iOS

## More Info

For information on how each OS supports managed app configuration:

[Android Developer Guide on Managed Configurations](https://developer.android.com/work/managed-configurations.html)

[iOS Developer Guide on Managed App Configuration](https://developer.apple.com/library/content/samplecode/sc2279/Introduction/Intro.html)

For information on implementing various EMM features, including managed app configuration:

[AppConfig Community](http://appconfig.org/)

## [Contributing](CONTRIBUTING.md)
This is an open source project maintained by Oracle Corp. Pull Requests are currently not being accepted. See 
[CONTRIBUTING](CONTRIBUTING.md)
for details.

## [License](LICENSE.md)
Copyright (c) 2017 Oracle and/or its affiliates
The Universal Permissive License (UPL), Version 1.0
