/**
 * Copyright (c) 2016 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

package oracle.jet.emm;

import java.util.Set;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.RestrictionsManager;
import android.os.Bundle;

public class EmmAppConfig extends CordovaPlugin {
  public static final String TAG = "EmmAppConfig";
  
  private CallbackContext _listenerCallbackContext;
  private BroadcastReceiver _changeReceiver;

  /**
   * Constructor.
   */
  public EmmAppConfig() {
  }

  /**
   * Sets the context of the Command. This can then be used to do things like
   * get file paths associated with the Activity.
   *
   * @param cordova The context of the main Activity.
   * @param webView The CordovaWebView Cordova is running in.
   */
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
      super.initialize(cordova, webView);

      _listenerCallbackContext = null;
      _changeReceiver = null;
  }

  /**
   * Executes the request and returns PluginResult.
   *
   * @param action            The action to execute.
   * @param args              JSONArry of arguments for the plugin.
   * @param callbackContext   The callback id used when calling back into JavaScript.
   * @return                  True if the action was valid, false if not.
   */
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException
  {
    if ("getConfigInfo".equals(action))
    {
      _getConfigInfo(callbackContext);
    }
    else if ("registerChangedListener".equals(action))
    {
      _registerChangedListener(callbackContext);
    }
    else
    {
      return false;
    }

    return true;
  }

  //--------------------------------------------------------------------------
  // LOCAL METHODS
  //--------------------------------------------------------------------------

  // Initial get of app config
  private void _getConfigInfo(CallbackContext callbackContext)
  {
    _syncAppConfig(callbackContext, false);
  }

  // Convert a Bundle into JSONObject
  private JSONObject _convertBundleToJSON(Bundle bundle) throws JSONException
  {
    JSONObject json = new JSONObject();

    if (bundle != null)
    {      
      Set<String> keys = bundle.keySet();
      if (keys != null)
      {
        for (String key : keys)
        {
          json.put(key, JSONObject.wrap(bundle.get(key)));
        }
      }
    }

    return json;
  }
  
  // Sync app config to Javascript
  private void _syncAppConfig(CallbackContext callbackContext, boolean keepCallback)
  {
    PluginResult result;

    try
    {
      Context context = cordova.getActivity().getApplicationContext();
      RestrictionsManager resManager = (RestrictionsManager)context.getSystemService(Context.RESTRICTIONS_SERVICE);
      Bundle restrictions = resManager.getApplicationRestrictions();
      
      JSONObject appConfig = _convertBundleToJSON(restrictions);

      result = new PluginResult(PluginResult.Status.OK, appConfig);
    }
    catch (JSONException e)
    {
      result = new PluginResult(PluginResult.Status.JSON_EXCEPTION, e.getMessage());
    }

    result.setKeepCallback(keepCallback);
    callbackContext.sendPluginResult(result);
  }
  
  // Register app config change listener
  private void _registerChangedListener(CallbackContext callbackContext)
  {
    Context appContext = cordova.getActivity().getApplicationContext();

    _listenerCallbackContext = callbackContext;
    
    // Only one receiver is needed, so unregister any previously registered receiver.
    if (_changeReceiver != null)
    {
      appContext.unregisterReceiver(_changeReceiver);
    }

    // We need to listen to app_restrictions change events to update emmappconfig
    IntentFilter intentFilter = new IntentFilter();
    intentFilter.addAction(Intent.ACTION_APPLICATION_RESTRICTIONS_CHANGED);
    
    _changeReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent)
      {
        if (_listenerCallbackContext != null)
        {
          _syncAppConfig(_listenerCallbackContext, true);
        }
      }
    };

    appContext.registerReceiver(_changeReceiver, intentFilter);
  }

}
