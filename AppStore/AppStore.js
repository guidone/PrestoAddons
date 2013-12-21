/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');

/*

TODO

*/

/**
* @class presto.addons.AppStore
* Utilities for App Store like rating. Use this utility to generate the link 
* [App Store Link Maker](https://linkmaker.itunes.apple.com/it/)
*
* To open the app store
*
*     this.app.appstore.rate()
*
* Or inside a plugin
*
*     this.action('rate')
*
* @extend presto.Plugin
*/
var Testflight = Plugin.extend({

	className: 'AppStore',
	
	/**
	* @method layout
	* Null the layout, no window is created
	*/
	layout: null,

	/**
	* @method getDefaults
	* Get default options of the plugin
	* @return {Object}
	*/
	getDefaults: function() {
	
		var result = this._super();
		
			
		return _.extend(result,{						
			
			id: 'appstore',
			
			/**
			* @cfg {String} appName
			* The application name
			*/
			appName: 'sparrow',
			
			/**
			* @cfg {String} iTunesId
			* The iTunes id
			*/
			iTunesId: '492573565'
					
		});
		
	},
	
	/**
	* @method rate
	* Open the app store for rating
	* @chainable
	*/
	rate: function() {
	
		var that = this;
		var options = that.getOptions();
		
		var url = 'itms-apps://itunes.apple.com/us/app/'+options.appName+'/id'+options.iTunesId;
		
		Ti.Platform.openURL(url);
	
		return that;	
	},
	
	/**
	* @method onInitialize
	* Init the app, define the *rate* action
	*/
	onInitialize: function() {
		
		var that = this;
		var options = that.getOptions();
		
		// register a test action
		that.registerAction({
			name: 'rate',
			label: L('appstore_Rate'),
			execute: function() {
				that.rate();
			}
		});
		
	}	


	
	
});

module.exports = AppStore;


