/**
 * Copyright (c) 2016 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');

channel.createSticky('onCordovaInfoReady');
// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

/**
 * This class provides methods for getting EMM application configuration and 
 * registering change listener.
 * @constructor
 */
function EmmAppConfig()
{
  this._appConfig = null;
  this._hasListener = false;

  var self = this;

  channel.onCordovaReady.subscribe(
    function()
    {
      var successCallback = function(info) {
        self._appConfig = info;
        channel.onCordovaInfoReady.fire();
      };
      var errorCallback = function(e) {
        console.log('[ERROR] Error from EmmAppConfig.getConfigInfo: ' + e);
      };

      exec(successCallback, errorCallback, 'EmmAppConfig', 'getConfigInfo', []);
    }
  );
}

/**
 * Get value from the application configuration.
 * 
 * @param {string|null} configKey - key of the value to get, or null to get all
 *   the values as an object.
 * @return {Any} the value of the keyed entry specified by "configKey", or 
 *   an object that contains all the values.
 */
EmmAppConfig.prototype.getValue = function(configKey)
{
  if (this._appConfig)
  {
    if (configKey)
    {
      return this._appConfig[configKey];
    }
    else
    {
      return this._appConfig;
    }
  }
  
  return null;
};

/**
 * Register a listener that will be invoked when the application configuration
 * is changed.  Multiple listeners can be registered.
 *
 * @param {function} listener - the function that will be invoked when the
 *   application configuration is changed.  Information about what has changed
 *   is not available.  The listener should call getValue to get the new values
 *   and decide how it handles any change.
 */
EmmAppConfig.prototype.registerChangedListener = function(listener)
{
  if (listener && typeof listener == 'function')
  {
    // Add an event listener at the Javascript layer
    document.addEventListener('emmappconfigchanged', listener);

    // We only need to add our own listener at the native layer once
    if (!this._hasListener)
    {
      this._hasListener = true;

      var self = this;

      var successCallback = function(info) {
        self._appConfig = info;
        var event = new Event('emmappconfigchanged');
        document.dispatchEvent(event);
      };
      var errorCallback = function(e) {
        console.log('[ERROR] Error from EmmAppConfig.registerChangedListener: ' + e);
      };

      exec(successCallback, errorCallback, 'EmmAppConfig', 'registerChangedListener', []);
    }
  }
};

module.exports = new EmmAppConfig();
