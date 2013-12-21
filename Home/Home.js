/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var Social = require('dk.napp.social');


/*

TODO

*/


/**
* @class presto.addons.Home
* Home plugin, a launcher for other plugins  
* @extend presto.Plugin
*/
var Home = Plugin.extend({

	className: 'Home',

	tags: {
		'BUTTONS': '/addons/Home/layout/buttons.js',
		'DASHBOARD': '/addons/Home/layout/dashboard.js'		
	},
	
	/**
	* @method getDefaults
	* Get default options of the plugin
	* @return {Object}
	*/
	getDefaults: function() {
	
		var result = this._super();
		
			
		return _.extend(result,{						
						
			plugins: null,
						
			/**
			* @cfg {String} type
			* Type of home page: buttons - a simple list of buttons, dasboard - a spring board like list of icons
			*/
			type: 'dashboard'
			
			
		});
		
	},
	
	getVariables: function() {
		
		var that = this;
		var result = that._super.apply(that,arguments);
		var options = that.getOptions();
		
		result.buttons = options.buttons;		
		result.type = options.type;
		
		return result;
	},
	
	clickButton: function(evt) {
		
		var that = this;
		var layout = that.getLayoutManager();		
		var data = layout.getDataFromElement(evt.source);
		that.app.open(data.id);
		
	},
	
	events: {
		'.pr-dashboard-home': {
			'click': function() {
				//Ti.API.info('asdadasd');
			}
		},
		'.pr-button-home': {
			'click': 'clickButton'
		}
		
	},
	
	clickDashboardItem: function(evt) {
	
		Ti.API.info('clicked clickDashboardItem');
		
	}

	
	
});

module.exports = Home;


