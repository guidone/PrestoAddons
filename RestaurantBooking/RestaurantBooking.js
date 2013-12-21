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
* @class presto.addons.RestaurantBooking
* Master detail post list
* @extend presto.Plugin
* @requires presto.addons.Mail
*/
var RestaurantBooking = Plugin.extend({

	className: 'RestaurantBooking',
	
	ui: {
		'bookingName': '#bookingName',
		'bookingPhone': '#bookingPhone',
		'bookingReservation': '#bookingReservation'	
	},

	events: {
		'#restaurantbookingEmail': {
			'click': 'bookViaEmail'
		},
		'#restaurantbookingSMS': {
			'click': 'bookViaSMS'
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
	* @method bookViaSMS
	* Send the reservation through email
	*/
	bookViaSMS: function() {
	
		var that = this;
		var options = that.getOptions();
				
		Ti.Platform.openURL('sms:'+options.mobile);
			
	},
	
	/**
	* @method bookViaEmail
	* Send the reservation through email
	*/
	bookViaEmail: function(evt) {
		
		var that = this;
		var app = that.app;
		var options = that.getOptions();

		if (!validators.isPersonName(that.ui.bookingName.getValue())) {
			alert(L('restaurantbooking_InsertFirstLastName'));
			return false;
		}
		if (!validators.isPhoneNumber(that.ui.bookingPhone.getValue())) {
			alert(L('restaurantbooking_InsertPhoneNumber'));
			return false;
		}		
		if (that.ui.bookingReservation.getValue() === '') {
			alert(L('restaurantbooking_WriteYourReservation'));
			return false;
		}

		jQ.when(app.privacy != null ? app.privacy.show() : true)
			.done(function() {

				var template = Handlebars.compile(that.resolveLocale(options.template));
				var the_message = template({
					reservation: that.ui.bookingReservation.getValue(),
					name: that.ui.bookingName.getValue(),
					phone: that.ui.bookingPhone.getValue(),
					restaurant: options.restaurant
				});
				
				// send through the cloud				
				that.app.email.send({
					recipients: options.email,
					body: the_message,
					subject: that.resolveLocale(options.subject)					
				}).done(function() {
					// clear form
					that.ui.bookingReservation.setValue('');
					that.ui.bookingPhone.setValue('');
					that.ui.bookingName.setValue('');
					// ok
					alert(L('restaurantbooking_ReservationSent'));
				});


				/*that.cloudEmail({
					template: 'default',
					recipients: options.email,
					reservation: that.ui.bookingReservation.getValue(),
					from: email,
					name: that.ui.bookingName.getValue(),
					phone: that.ui.bookingPhone.getValue()					
				}).done(function() {
					// clear form
					that.ui.bookingReservation.setValue('');
					that.ui.bookingPhone.setValue('');
					that.ui.bookingName.setValue('');
					// ok
					alert(L('restaurantbooking_ReservationSent'));
				});
				*/
				
				/*

				
				dialogs.email({
					to: options.email,
					subject: options.subject,
					body: the_message
				}).done(function() {
					that.reset();
					// alert
					alert(L('restaurantbooking_ReservationSent'));
				});
				*/

				
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
			subject: L('restaurantbooking_Reservation'),
			
			/**
			* @cfg {String} mobile
			* Mobile number to send the reservation to
			*/
			mobile: null,
			
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
			* @cfg {String} restaurant
			* The name of the restaurant to be used inside the email
			*/
			restaurant: 'restaurant'	
			
		});
		
	}

});

module.exports = RestaurantBooking;