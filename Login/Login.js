/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var Cloud = require('ti.cloud');
var dialogs = require('/presto/helpers/dialogs');

/*
TODO
- togliere loader su click tasto facebook
- controllo email valida
- controllo password uguali
- recupero password

*/

/**
* @class presto.addons.Login
* Simple HTML page, create a menu, fetch content from the cloud
* @extend presto.Plugin
*/
var Login = Plugin.extend({

	className: 'Login',

	tags: {
		'HEADER': '/addons/Login/layout/header.js',
		'LOGINFORM': '/addons/Login/layout/form_login.js',
		'LOGOUTFORM': '/addons/Login/layout/form_logout.js',
		'SIGNUPFORM': '/addons/Login/layout/form_signup.js',
		'FACEBOOKBUTTON': '/addons/Facebook/layout/button.js'
	},

	/**
	* @method doLoginWithFacebook
	* Executes the signup/login with facebook credentials, at the end cast an event as the user just signed up
	* @chainable
	*/
	doLoginWithFacebook: function() {

		var that = this;

		that.app.loader.show();
		that.app.facebook.authorize()
			.done(function(appToken) {

				that.app.session.loginWithFacebook(appToken)
					.done(function(user) {
						// refresh the window
						that.refresh();
						// fire signup event
						that.app.fireEvent('auth_signup');
						// remove signup action
						that.setAction(null);
					})
					.fail(function() {
						alert(L('login_FacebookSignupFailed'));
					});

			})
			.fail(function() {
				that.app.loader.hide();

				// login failed, perhaps the session on facebook elapsed, ask to deauthorize
				dialogs.confirm(L('login_FacebookAuthorizationFailedDeauthorize'))
					.done(function() {
						that.app.facebook.deauthorize();
					});

			});

		return that;
	},

	/**
	* @method getEvents
	* Add an on click event to the list
	* @protected
	*/
	getEvents: function() {

		var that = this;
		var events = that._super.call(that,arguments);

		events = _.extend(events,{
			'.pr-button-login-facebook': {
				'click': function() {
					that.doLoginWithFacebook();
				}
			},
			'.pr-login-twitter': {
				'click': function() {
					Ti.API.info('twitter');
				}
			},
			'.pr-login-linkedin': {
				'click': function() {
					Ti.API.info('linkedin');
				}
			},
			'.pr-button-login': {
				'click': function(evt) {

					// check valid form
					var check = that.validateLoginForm();
					if (check != null) {
						alert(check);
						return false;
					}

					that.executeLogin(evt);
				}
			},
			'.pr-button-logout': {
				'click': function(evt) {
					that.doLogout(evt);
				}
			},

			'#btnSwitchPushMessages': {
				'change': function(evt) {

					if (evt.value) {
						that.app.push.subscribe()
							.done(function() {
								alert(L('login_SubscribeSuccessful'));
							})
							.fail(function(e) {
								alert(L('login_ErrorTryingToSubscribe'));
								that.getLayoutManager().getById('btnSwitchPushMessages').value = false;
							});
					} else {
						that.app.push.unsubscribe()
							.done(function() {
								alert(L('login_UnsubscribeSuccessful'));
							})
							.fail(function(e) {
								alert(L('login_ErrorTryingToUnsubscribe'));
								that.getLayoutManager().getById('btnSwitchPushMessages').value = true;
							});
					}

				}
			}
		});

		return events;
	},

	/**
	* @method getVariables
	* Get variables for the login form
	* @return {Object}
	* @protected
	*/
	getVariables: function() {

		var that = this;
		var result = that._super.apply(that,arguments);

		var user = that.app.config.get('session','user');

		result = _.extend(result,{
			isLogged: that.app.session.hasSessionOrToken(),
			isSubscribed: that.app.push != null && that.app.push.isSubscribed(),
			user: user,
			isFacebook: that.app.facebook != null
		});

		return result;
	},

	/**
	* @method getDefaults
	* Get default options of the plugin
	* @return {Object}
	*/
	getDefaults: function() {

		var that = this;
		var result = that._super();

		result = _.extend(result,{

			// fix the id
			id: 'login'

		});

		return result;
	},

	getSignupAction: function() {

		var that = this;

		return {
			label: L('Signup'),
			execute: function() {
				that.showSubscribe();
			}
		};
	},


	/**
	* @method getAction
	* Override the get action, show signup only if user is not logged
	* @return {presto.models.Action}
	*/
	getAction: function() {

		var that = this;

		if (that.app.session.isLogged()) {
			return null;
		} else {
			return that.getSignupAction();
		}
	},


	doLogout: function() {

		var that = this;

		that.app.session.logout()
			.done(function(result) {

				Ti.API.info('logged out');
				that.refresh();
				// fire login event
				that.app.fireEvent('auth_logout');
				// put signup action
				that.setAction(that.getSignupAction());

			}).fail(function(err) {
				Ti.API.error('Error on logging out');
			});

	},

	/**
	* @method executeLogin
	* Executes login, check form, fire event and swap button
	* @private
	* @deferred
	*/
	executeLogin: function() {

		var that = this;
		var deferred = jQ.Deferred();
		var layoutManager = that.getLayoutManager();
		var username = layoutManager.getById('username').getValue();
		var password = layoutManager.getById('password').getValue();

		that.app.session.login(
			username,
			password
		).done(function(result) {

			//Ti.API.info('logged'+JSON.stringify(result));
			// refresh the window
			that.refresh();
			// fire login event
			that.app.fireEvent('auth_login');
			// remove signup action
			that.setAction(null);
			// resolve
			deferred.resolve();

		}).fail(function(e) {

			alert(L('login_ErrorOnLogin')+': '+e.message);
			// reject
			deferred.reject();

		});

		return deferred.promise();
	},

	doLogin: function() {

		var that = this;
		var deferred = jQ.Deferred();
		var layoutManager = that.getLayoutManager();
		var username = layoutManager.getById('username').getValue();
		var password = layoutManager.getById('password').getValue();

		that.app.session.login(
			username,
			password
		).done(function(result) {

			// fire login event
			that.app.fireEvent('auth_login');
			// resolve
			deferred.resolve();

		}).fail(function(e) {

			alert(L('login_ErrorOnLogin')+': '+e.message);
			// reject
			deferred.reject();

		});

		return deferred.promise();
	},

	validateLoginForm: function() {

		var that = this;
		var layoutManager = that.getLayoutManager();
		var username = layoutManager.getById('username').getValue();
		var password = layoutManager.getById('password').getValue();

		if (_.isEmpty(username)) {
			return L('InsertEmailToLogin');
		}
		if (_.isEmpty(password)) {
			return L('InsertPasswordToLogin');
		}

		return null;
	},

	/**
	* @method validateSignupForm
	* Validate signup form, return null if no error, or the error message
	* @private
	* @return {String}
	*/
	validateSignupForm: function() {

		var that = this;
		var layoutManager = that.getLayoutManager();
		var username = layoutManager.getById('signup_username').getValue();
		var password = layoutManager.getById('signup_password').getValue();
		var password_confirmation = layoutManager.getById('signup_password_confirmation').getValue();
		var signup_first_name = layoutManager.getById('signup_last_name').getValue();
		var signup_last_name = layoutManager.getById('signup_last_name').getValue();

		if (_.isEmpty(signup_first_name)) {
			return L('login_InsertYourFirstNameToSignup');
		}
		if (_.isEmpty(signup_last_name)) {
			return L('login_InsertYourLastNameToSignup');
		}
		if (_.isEmpty(username)) {
			return L('login_InsertValidEmailToSignup');
		}
		if (_.isEmpty(password)) {
			return L('login_InsertValidPassword');
		}
		if (password != password_confirmation) {
			return L('login_PasswordsDontMatch');
		}

		return null;
	},

	/**
	* @method doSignup
	* Execute signup and cast event at the end, return the record from ACS node
	* @return {Object} user
	* @deferred
	*/
	doSignup: function() {

		// guido.bellomo+2@gmail.com

		var that = this;
		var deferred = jQ.Deferred();
		var layoutManager = that.getLayoutManager();
		var username = layoutManager.getById('signup_username').getValue();
		var password = layoutManager.getById('signup_password').getValue();
		var password_confirmation = layoutManager.getById('signup_password_confirmation').getValue();
		var signup_first_name = layoutManager.getById('signup_last_name').getValue();
		var signup_last_name = layoutManager.getById('signup_last_name').getValue();

		jQ.when(that.app.privacy != null ? that.app.privacy.show() : true)
			.done(function() {

				Cloud.Users.create({
					first_name: signup_first_name,
					last_name: signup_last_name,
					email: username,
					password: password,
					password_confirmation: password_confirmation
				},function(e) {

					if (e.success) {

						// refresh the window
						//that.refresh();
						// fire login event
						// include the password
						e.users[0].password = password;
						// now perform login
						deferred.resolve(e);

					} else {
						// hide the loader
						deferred.reject(e);
					}
				});

			});


		return deferred.promise();
	},

	/**
	* @method showSubscribe
	* Show a photo in a modal overlay
	*/
	showSubscribe: function() {

		Ti.API.info('showSubscribe@login');

		var that = this;
		var layoutManager = that.getLayoutManager();
		var navigation = that.getNavigation();
		var layout = that.getWindowLayout();

		layout.childs = [
			{
				type: 'tag',
				name: 'SIGNUPFORM'
			}
		];

		// set the action as privacy
		layout.rightNavButton = null;

		// create the layout
		var signupWindow = layoutManager.createLayout(layout);

		// close events
		var close = function(evt) {
			navigation.closeWindow(signupWindow);
		};
		layoutManager.events({
			'.pr-toolbarbtn-back': {
				'click': close
			},
			'.pr-toolbarbtn-action': {
				'click': function() {
					that.app.privacy.show();
				}
			},
			'.pr-button-signup': {
				'click': function() {

					// check valid form
					var check = that.validateSignupForm();
					if (check != null) {
						alert(check);
						return false;
					}

					// the start saving
					that.app.loader.show(L('login_SigningUp'));
					that.doSignup()
						.done(function(msg) {
							that.app.session.login(
								msg.users[0].email,
								msg.users[0].password
							).done(function(result) {

								// close the window
								navigation.closeWindow(signupWindow);
								// refresh the window
								that.refresh();
								// fire signup event
								that.app.fireEvent('auth_signup');
								// remove signup action
								that.setAction(null);

							}).fail(function(e) {
								alert(L('login_ErrorOnLogin')+': '+e.message);
							}).always(function() {
								that.app.loader.hide();
							});

						})
						.fail(function(e) {
							that.app.loader.hide();
							alert(L('login_ErrorOnSignup')+':'+e.message);
						});

				}
			}
		});

		navigation.openWindow(signupWindow);

	},


	/**
	* @method login
	* Executes the login in a popup window, it's possibile to signup. If the user is already logged, it resolves immediately
	* @deferred
	*/
	login: function() {

		Ti.API.info('showSubscribe@login');

		var deferred = jQ.Deferred();
		var that = this;
		var app = that.app;

		// resolve immediately if already logged
		if (app.session.isLogged()) {
			Ti.API.info('Already logged, skipping');
			deferred.resolve();
			return deferred.promise();
		}

		// ok start the login
		var layoutManager = that.getLayoutManager();
		var navigation = that.getNavigation();
		var layout = that.getWindowLayout({
			leftButton: {
				type: 'button',
				className: 'pr-toolbarbtn pr-toolbarbtn-back'
			}
		});

		layout.childs = [
			{
				type: 'tag',
				name: 'LOGINFORM'
			}
		];

		// create the layout
		var loginWindow = layoutManager.createLayout(layout);
		var loginNavigator = Ti.UI.iOS.createNavigationWindow({
			window: loginWindow,
			top: Ti.Platform.displayCaps.platformWidth
		});
		var close = function() {
			var slideDown = Titanium.UI.createAnimation();
			slideUp.top = Ti.Platform.displayCaps.platformWidth;
			slideUp.duration = 200;
			slideUp.curve = Ti.UI.ANIMATION_CURVE_EASE_OUT;
			loginNavigator.animate(slideUp,function() {
				loginNavigator.close();
				deferred.reject();
			});
		};

		// close events
		layoutManager.events({
			'.pr-button-login-facebook': {
				'click': function() {
					that.doLoginWithFacebook();
				}
			},
			'.pr-login-twitter': {
				'click': function() {
					Ti.API.info('twitter');
				}
			},
			'.pr-login-linkedin': {
				'click': function() {
					Ti.API.info('linkedin');
				}
			},
			'.pr-button-login': {
				'click': function(evt) {

					// check valid form
					var check = that.validateLoginForm();
					if (check != null) {
						alert(check);
						return false;
					}

					that.app.loader.show(L('login_LoggingIn'));
					that.doLogin(evt)
						.done(function() {
							close();
							deferred.resolve();
						})
						.fail(function() {
							deferred.reject();
						})
						.always(function() {
							that.app.loader.hide();
						});
				}
			},

			'.pr-toolbarbtn-back': {
				'click': function() {
					close();
				}
			}
		});

		loginNavigator.open({
			fullscreen: true,
			modal: false,
			animated: true,
			modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
		});
		var slideUp = Titanium.UI.createAnimation();
		slideUp.top = 0;
		slideUp.duration = 200;
		slideUp.curve = Ti.UI.ANIMATION_CURVE_EASE_IN;
		loginNavigator.animate(slideUp);

		return deferred.promise();
	}


});

module.exports = Login;