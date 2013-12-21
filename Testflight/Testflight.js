/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');

// WARNING: ONLY USE THIS ON DEVELOPMENT! DON'T GO TO THE APP STORE WITH THIS LINE!!
var testflight = require('com.0x82.testflight');


/*

TODO

- replace my_username and attach to event on login
- rinominare onInit --- onBootstrap

*/




/**
* @class presto.addons.Testflight
* Testflight plugin  
* @extend presto.Plugin
*/
var Testflight = Plugin.extend({

	className: 'Gallery',
	
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
			
			// fix id
			id: 'testflight',
			
			/**
			* @cfg {String} appToken
			* Application token for Testflight
			*/
			appToken: null,
			
			/**
			* @cfg {Boolean} [feedback=true]
			* Show the feedback menu
			*/
			feedback: true
			
			
		});
		
	},
	
	/**
	* @method onInit
	* Init test flight module
	* @deferred 
	*/
	onInit: function() {
		
		var that = this;
		var deferred = jQ.Deferred();
		var options = that.getOptions();
		
		testflight.setDeviceIdentifier(Ti.Platform.id);
		testflight.takeOff(options.appToken);
				
		testflight.addCustomEnvironmentInformation({
			username: 'my_username'
		});
		
		// resolve
		deferred.resolve();
		
		return deferred.promise();
	},
	
	onInitialize: function() {
		
		var that = this;
		var options = that.getOptions();
		
		if (options.feedback) {
			options.menu = {
				icon: '/themes/roller/images/lists/globe_16.png',
				title: L('SendFeedback'),
				sectionId: 'dev',
				sectionName: L('Development'),
				onClick: function() {				
					that.openFeedbackView();
					// ensure menu closes
					return true;
				}				
			};
		}		
	},
	
	/**
	* @method openFeedbackView
	* Open feedback menu
	*/
	openFeedbackView: function() {
		
		testflight.openFeedbackView();
	
	},
	
	/**
	* @method passCheckpoint
	* Pass checkpoint
	* @param {String}
	* @return
	*/
	passCheckpoint: function(str) {
		
		testflight.passCheckpoint(str);
		
	}	
	
	


	
	
});

module.exports = Testflight;


