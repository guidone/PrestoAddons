/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var Social = require('dk.napp.social');


/**
* @class presto.addons.SocialSharing
* Add sharing capabilities, to share the content of a plugin
*
*     this.app.social.share(my_plugin)
*
* Where the plugin must define a sharing structure {@link presto.models.Sharing}. It also defines an action **share** in the
* application, the easiest way to trigger the sharing is
*
*     // context is the plugin
*     this.action('share')
*
* The sharing class defines the content of the plugin to be shared: image, text and url. These methods could be also function, 
* likely these callback will grab the **.model** properties and format it according with the purpouse of the plugin
* @extend presto.Plugin
*/
var SocialSharing = Plugin.extend({

	className: 'SocialSharing',
	
	init: function() {
	
		var that = this;
		that._super.apply(that,arguments);
		
		// Register the share action
		that.app.registerAction({
			name: 'share',
			label: L('Share'),
			execute: function() {
				that.share(this);				
			},
			view: null			
		});
		
		return that;
	},
	
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
			id: 'share'			
		});
		
	},
	
	/**
	* @method share
	* Share the content associated with a plugin
	* @param {presto.Plugin} plugin
	* @chainable
	*/
	share: function(plugin) {
		
		var sharing = plugin.getSharing();

		if (_.isFunction(sharing.text)) {
			sharing.text = sharing.text.call(plugin);
		}
		if (_.isFunction(sharing.image)) {
			sharing.image = sharing.image.call(plugin);
		}
		if (_.isFunction(sharing.url)) {
			sharing.url = sharing.url.call(plugin);
		}
		if (_.isFunction(sharing.removeIcons)) {
			sharing.removeIcons = sharing.removeIcons.call(plugin);
		}
		
		Social.activityView(sharing);

		return this;		
	}

	
	
});

module.exports = SocialSharing;


