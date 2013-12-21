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
* @class presto.addons.Email
* Send email through the ACS cloud email, must set a valid SMTP server in ACS settinga and a template. The predefined template
* 'default' should be a simple: {{body}} for text and {{subject}} as subject, it's also possibile to predefine a from email
* address, so for the simplest case sending an email would be just a
*
*      this.app.email.send({
*        body: 'the message',
*        subject: 'the subject',
*        recipients: 'who@email.it'
*        }).done(function() {
*          // email sent
*        })
*
* It's possibile to register the plugin multiple time with different ids and different predefined values
*
*      App.registerPlugin('Email',{
*        id: 'signupemail',
*        template: 'my_template',
*        from: 'noreply@email.it'
*      });
* 
* The plugin will be available as **this.app.signupemail.send()**, in the dictionary it's possibile to include any number of
* additional custom fields that will be available in the ACS Email template as **{{my_field}}**
* @extend presto.Plugin
*/
var Email = Plugin.extend({

	className: 'Email',
	
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
			id: 'email',
			
			/**
			* @cfg {String} [template=default]
			* Default template to be used if not specified
			*/
			template: 'default',
			
			/**
			* @cfg {String} email
			* The default senders email
			*/
			from: null
			
			
		});
		
	},
	
	/**
	* @method send
	* Send email through the ACS cloud email, it will populate automatically the template and the from field with the
	* user information if it's logged
	* @param {Object} options
	* @param {String} options.from Email sender
	* @param {String} [options.template=default] Template to send the email to
	* @param {String} options.recipients Comma delimited list of the email to send
	* @deferred
	*/
	send: function(params) {
		
		var that = this;
		var options = that.getOptions();
		var deferred = jQ.Deferred();
		
		if (params.template == null) {
			params.template = options.template;
		}
		if (params.from == null && options.email) {
			params.from = options.email;
		}
		if (params.from == null && that.app.session.isLogged()) {
			if (!_.isEmpty(that.app.session.user.email)) {
				params.from = that.app.session.user.email;
			}
		}
		
		that.app.loader.show(L('Sending'));
		Cloud.Emails.send(params,function(e) {
			that.app.loader.hide();
			if (e.success) {
				deferred.resolve();	
			} else {
				deferred.reejct(e);
			}
		});
	
		return deferred.promise();
	},

	
});

module.exports = Email;


