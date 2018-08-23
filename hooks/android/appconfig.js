var fs = require('fs'),
    path = require('path');


module.exports = function (context) {
    var Q = context.requireCordovaModule('q');
    var defer = new Q.defer();

    // only apply hook for android builds
    if (context.opts.cordova.platforms.indexOf('android') === -1) {
        throw new Error('This plugin expects the android platform to exist.');
    }

    var appConfigPath = path.join(context.opts.projectRoot, 'appconfig.json');

    if (!fs.existsSync(appConfigPath)) {
        throw new Error("Could not find appconfig.json file in: " + context.opts.projectRoot);
    }

    var appConfig = require(appConfigPath);

    console.log('appConfig', appConfig);

    return defer.promise;
    // make sure it's the proper event to run?


    // read in data for appConfig

    // validate/sanitize data in appConfig

    // update app_restrictions.xml && plugin.xml
}