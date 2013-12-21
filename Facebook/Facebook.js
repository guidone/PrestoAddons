/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var fb = require('facebook');

// use ios6 built in feature


/**
* @class presto.addons.Facebook
* Facebook basic module, needed to use the single sign on with the Facebook account. Attention: the bundle id of the application must
* be the same of the appId (tiapp.xml), in the tiapp.xml add the row <property name="ti.facebook.appid">my_app_id</property>, if a 
* info.plist is specified then add
*
*     <array>
*       <dict>
*       <key>CFBundleURLName</key>
*       <string>it.saliceblu</string>
*       <key>CFBundleURLSchemes</key>
*         <array>
*           <string>saliceblu</string>
*           <string>fb--my-app-id--</string>
*         </array>
*       </dict>
*     </array>
*
* PS: pay attention to the leading **fb**
* @extend presto.Plugin
*/
var Facebook = Plugin.extend({

	className: 'Facebook',
		
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
			
			// name is fixed
			id: 'facebook',
			
			/**
			* @cfg {String} appId
			* Facebook aplpication id
			*/
			appId: null,
			
			/**
			* @cfg {Array} permissions
			* Facebook permission to get
			*/
			permissions: ['publish_stream','email']
			
		});
		
	},
	
	/**
	* @method onInitialize
	* Initialize the app id of Facebook
	* @chainable
	*/
	onInitialize: function() {
	
		var that = this;
		var options = that.getOptions();

		fb.forceDialogAuth = false;
		fb.appid = options.appId;
		fb.permissions = options.permissions;

		return that;
	},

	/**
	* @method getAccessToken
	* Return the Facebook access token, or null if not authorized
	* @return {String}
	*/
	getAccessToken: function() {
		
		return fb.accessToken;
	
	},

	createLoginButton: function(style) {
		
		return fb.createLoginButton(_.extend(style,{
			style: fb.BUTTON_STYLE_WIDE
		}));
		
	},

	/**
	* @method authorize
	* Authorize the app with Facebook
	* @return {String} accessToken The access token for the app
	* @deferred
	*/
	authorize: function() {
		
		Ti.API.info('Bundle id must be '+Ti.App.id);		
		var deferred = jQ.Deferred();
		
		// if already authorized, resolve immediately
		if (fb.accessToken != null) {
			deferred.resolve(fb.accessToken);
			return deferred.promise();
		}
		
		var on_login = function(e) {			
			// detach event
			fb.removeEventListener('login',on_login);
			// handle result
			if (e.success) {
				deferred.resolve(fb.accessToken);
			} else {
				deferred.reject(e);
			}
		};
		// attach event
		fb.addEventListener('login',on_login);
		// cast
		fb.authorize();
		
		return deferred.promise();
		
	},
	
	/**
	* @method deauthorize
	* Deauthorize this app
	*/
	deauthorize: function() {
		
		fg.logout();
	}	
	
});

module.exports = Facebook;


