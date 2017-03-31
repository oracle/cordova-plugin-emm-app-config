/*
 *
 * Copyright (c) 2016 Oracle and/or its affiliates
 * The Universal Permissive License (UPL), Version 1.0
 *
*/

/* jshint jasmine: true */

exports.defineAutoTests = function() {
  describe('EmmAppConfig Information (cordova.plugins.EmmAppConfig)', function () {
    it("should exist", function() {
      expect(cordova.plugins.EmmAppConfig).toBeDefined();
    });

    it("should contain a getValue property that is a function", function() {
      expect(cordova.plugins.EmmAppConfig.getValue).toBeDefined();
      expect(typeof cordova.plugins.EmmAppConfig.getValue).toBe("function");
    });

    it("should contain a registerChangedListener property that is a function", function() {
      expect(cordova.plugins.EmmAppConfig.registerChangedListener).toBeDefined();
      expect(typeof cordova.plugins.EmmAppConfig.registerChangedListener).toBe("function");
    });
  });
};

exports.defineManualTests = function(contentEl, createActionButton) {
    var logMessage = function (message, color) {
        var log = document.getElementById('info');
        var logLine = document.createElement('div');
        if (color) {
            logLine.style.color = color;
        }
        logLine.innerHTML = message;
        log.appendChild(logLine);
    };

    var clearLog = function () {
        var log = document.getElementById('info');
        log.innerHTML = '';
    };

    var emmappconfig_tests = '<h3>Press Dump EmmAppConfig button to get emmappconfig information</h3>' +
        '<div id="dump_emmappconfig"></div>' +
        'Expected result: Status box will get updated with emmappconfig info.';

    contentEl.innerHTML = '<div id="info"></div>' + emmappconfig_tests;

    createActionButton('Dump EmmAppConfig', function() {
      clearLog();
      logMessage(JSON.stringify(cordova.plugins.EmmAppConfig, null, '\t'));
    }, "dump_emmappconfig");
};
