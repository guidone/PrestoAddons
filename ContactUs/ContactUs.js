/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var dialogs = require('/presto/helpers/dialogs');
var validators = require('/presto/helpers/validators');
var Handlebars = require('/presto/libs/handlebars');

/*
TODO

*/

/**
* @class presto.addons.ContactUs
* Master detail post list
* @extends presto.Plugin
* @requires presto.addons.Mail
*/
var ContactUs = Plugin.extend({

	className: 'ContactUs',

	ui: {
		'contactName': '#contactName',
    'contactEmail': '#contactEmail',
		'contactPhone': '#contactPhone',
		'contactText': '#contactText'
	},

	events: {
		'#contactus_Send': {
			'click': 'contact'
		}
	},

	/**
	* @method reset
	* Reset the form
	*/
	reset: function() {

		that.ui.bookingReservation.setValue('');
	},

	/**
	* @method bookViaEmail
	* Send the reservation through email
	*/
  contact: function(evt) {

		var that = this;
		var app = that.app;
		var options = that.getOptions();

		if (!validators.isPersonName(that.ui.contactName.getValue())) {
			alert(L('contactus_InsertFirstLastName'));
			return false;
		}
		if (!validators.isPhoneNumber(that.ui.contactPhone.getValue())) {
			alert(L('contactus_InsertPhoneNumberOrEmail'));
			return false;
		}
		if (that.ui.contactText.getValue() === '') {
			alert(L('contactus_InsertYourRequest'));
			return false;
		}

		jQ.when(app.privacy != null ? app.privacy.show() : true)
			.done(function() {

				var template = Handlebars.compile(that.resolveLocale(options.template));
				var the_message = template({
					reservation: that.ui.contactText.getValue(),
					name: that.ui.contactName.getValue(),
					phone: that.ui.contactPhone.getValue(),
          email: that.ui.contactEmail.getValue(),
          company: options.company
				});

				// send through the cloud
				that.app.email.send({
					recipients: options.email,
					body: the_message,
					subject: that.resolveLocale(options.subject)
				}).done(function() {
					// clear form
					that.ui.contactText.setValue('');
					that.ui.contactPhone.setValue('');
					that.ui.contactName.setValue('');
          that.ui.contactEmail.setValue(),
					// ok
					alert(L('contactus_RequestSent'));
				});

			});

	},

	/**
	* @method getDefaults
	* Get default options of the plugin
	* @return {Object}
	*/
	getDefaults: function() {

		var result = this._super();

		return _.extend(result,{

			/**
			* @cfg {String} email
			* Email to send the booking email to
			*/
			email: null,

			/**
			* @cfg {String/Object} subject
			* Default subject to send on reservation via email, could be a locale map
			*/
			subject: L('contactus_Request'),

			/**
			* @cfg {String/Object} template
			* Email template, it's an handlebar template, use variable like: name, restaurant, phone and reservation.
			* Could be a locale map
			*/
			template: {
				it: 'Desidero effettuare una prenotazione presso il {{restaurant}}:<br><br>'
					+'Nome e cognome: {{name}}<br>'
					+'Cell.: {{phone}}<br>'
					+'Prenotazione: {{reservation}}<br><br>Grazie',
				en: 'I would like to make a reservation for {{restaurant}}:<br><br>'
					+'First and last name: {{name}}<br>'
					+'Mobile: {{phone}}<br>'
					+'Reservation: {{reservation}}<br><br>Thanks'
			},

      /**
       * @cfg {String} company
       * The name of the company
       */
      company: 'name of the company'

		});

	}

});

module.exports = ContactUs;
