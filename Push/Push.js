/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var Cloud = require('ti.cloud');

/*

TODO

*/


/**
* @class presto.addons.Push
* This plugin enable the support for push messages.
*
* Users need to be registered to enable push messages, by default, after signup users are requested to signup push messages
*
* To install
*
* - generate certificates on dev.apple.com
* - upload certificate on Titanium ACS
*
* It's possible to send message, change the badge count (the little number in the top right corner of the icon) and open the
* app starting with a specifi plugin
*
*     {
*       badge: 42,
*       alert: 'my message',
*       addon: 'id-of-the-plugin-to-open'
*     }
*
* @extend presto.Plugin
* @requires presto.addons.Login
*/
var Push = Plugin.extend({

	className: 'Push',

	init: function() {

		var that = this;

		that._super.apply(that,arguments);

		that.addEventListener('auth_login',function() {
			Ti.API.info('PUSH Logged in');
			//that.askSubscribe();
		});

		that.addEventListener('auth_logout',function() {
			Ti.API.info('PUSH Logged out');
		});

		that.addEventListener('auth_signup',function() {
			Ti.API.info('PUSH Signup');
			that.askSubscribe();
		});

		// register config params
		that.app.config.registerParam('push','subscribed','boolean');

		// if app token, then listen for messages
		if (that.isSubscribed()) {
			Ti.Network.registerForPushNotifications({
				callback: function(msg) {
					that.executeMessage(msg);
				},
				types: [
					Titanium.Network.NOTIFICATION_TYPE_BADGE,
					Titanium.Network.NOTIFICATION_TYPE_ALERT,
					Titanium.Network.NOTIFICATION_TYPE_SOUND
				]
			});
		}

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

			id: 'push',

			/**
			* @cfg {Boolean} [debug=false]
			* Show the debug menu
			*/
			debug: false,

			channels: [
				{
					name: 'app'
				}
			]


		});

	},

	/**
	* @method getDeviceToken
	* Ask for device token (request user permission)
	* @return {String} deviceToken
	* @deferred
	*/
	getDeviceToken: function() {

		var deferred = jQ.Deferred();
		var that = this;

		Ti.Network.registerForPushNotifications({
			success: function(msg) {
				Ti.API.info('Registrato! '+JSON.stringify(msg));
				deferred.resolve(msg.deviceToken);
				//alert(deviceToken);
			},
			error: function(err) {
				deferred.reject();
				Ti.API.info('Registrato error! '+JSON.stringify(err));
			},
			callback: function(msg) {
				//alert('Resume da messaggio push '+JSON.stringify(msg));
				//Ti.API.info('Registrato! '+JSON.stringify(msg));
				that.executeMessage(msg);
			},
			types: [
				Titanium.Network.NOTIFICATION_TYPE_BADGE,
				Titanium.Network.NOTIFICATION_TYPE_ALERT,
				Titanium.Network.NOTIFICATION_TYPE_SOUND
			]
		});

		return deferred.promise();
	},

	/**
	* @event push_message
	* Fired when a push message is received, even if the application is resumed after a message
	* @param {Object} payload
	*/

	/**
	* @method executeMessage
	* Identify the plugin from the notification message and open it
	* @param {Object} message
	* @chainable
	*/
	executeMessage: function(msg) {

		var that = this;

		// open the plugin if any
		if (msg.data != null && msg.data.addon != null) {
			var plugin = that.app.getPluginById(msg.data.addon);
			// if exists
			if (plugin != null) {
				that.app.open(msg.data.addon);
			}
		}

		// broadcast message
		that.app.fireEvent('push_message',msg.data);

		return that;
	},

	/**
	* @method askSubscribe
	* Ask for subscribe if not yet subscribed
	* @deferred
	*/
	askSubscribe: function() {

		var that = this;

		if (!that.isSubscribed()) {
			that.subscribe()
				.done(function() {
					alert(L('push_SuccessfullySubscribed'));
				})
				.fail(function(e) {
					alert('push_ErrorWhileSubscribing');
				});

		}

	},

	/**
	* @property {Number} [AUTHENTICATION_ERROR=404]
	* Error code for authentication error
	*/
	AUTHENTICATION_ERROR: 404,

	/**
	* @method subscribe
	* Subscribe to the notifications, first require app token if not present
	* @deferred
	*/
	subscribe: function() {

		Ti.API.info('subscribe@Push');

		var that = this;
		var deferred = jQ.Deferred();
		var options = that.getOptions();

		var channel = options.channels[0]; // only one channel for now

		that.getDeviceToken()
			.done(function(deviceToken) {

				Cloud.PushNotifications.subscribe(
					{
						channel: channel.name,
						device_token: deviceToken
					},
					function (e) {
						if (e.success) {
							// store subscribed
							that.app.config.set('push','subscribed',true);
							deferred.resolve();
						} else {
							if (e.code == 404) {
								deferred.reject({
									code: that.AUTHENTICATION_ERROR,
									message: L('push_AuthenticationErrorLoginAgain')
								});
							} else {
								deferred.reject();
							}

						}
					}
				);
			})
			.fail(function(e) {
				deferred.reject(e);
			});

		return deferred.promise();

	},

	/**
	* @method unsubscribe
	* Unsubscribe from notifications
	* @deferred
	*/
	unsubscribe: function() {

		Ti.API.info('unsubscribe@Push');

		var that = this;
		var deferred = jQ.Deferred();
		var options = that.getOptions();

		var channel = options.channels[0]; // only one channel for now

		that.getDeviceToken()
			.done(function(deviceToken) {

				Cloud.PushNotifications.unsubscribe(
					{
						channel: channel.name,
						device_token: deviceToken
					},
					function (e) {
						if (e.success) {
							// store un subscribed
							that.app.config.set('push','subscribed',false);
							// remove token
							Ti.Network.unregisterForPushNotifications();

							deferred.resolve();
						} else {
							if (e.code == 404) {
								deferred.reject({
									code: that.AUTHENTICATION_ERROR,
									message: L('push_AuthenticationErrorLoginAgain')
								});
							} else {
								deferred.reject();
							}
						}
					}
				);
			})
			.fail(function(e) {
				deferred.reject(e);
			});

		return deferred.promise();

	},

	/**
	* @method isSubscribed
	* Tells if the app has already subscribed and has an app token
	* @return {Boolean}
	*/
	isSubscribed: function() {

		var that = this;

		var subscribed = that.app.config.get('push','subscribed');

		return subscribed === true;

	},

	/**
	* @method onInit
	* Start and reset the badge
	* @deferred
	*/
	onInit: function() {

		//var that = this;
		var deferred = jQ.Deferred();
		//var options = that.getOptions();

		// set the app badge to zero
		Titanium.UI.iPhone.appBadge = 0;

		// resolve
		deferred.resolve();

		return deferred.promise();
	}

});

module.exports = Push;


