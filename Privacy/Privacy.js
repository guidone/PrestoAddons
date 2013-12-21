/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var Handlebars = require('/presto/libs/handlebars');

/*
TODO
*/

/**
* @class presto.addons.Privacy
* Privacy plugin, customize tipical privacy statement for the customer, to show up the privacy statement
*
*      this.app.privacy.show()
*        .done(function() {
*          // ok accepted
*          });
*
* Once accepted the dialog will not be shown again, and the deferred will resolve immediately without displaying anything
* @extend presto.Plugin
*/
var Privacy = Plugin.extend({

	className: 'Privacy',
	
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
		
		// register accept privacy
		that.app.config.registerParam('privacy','accepted','boolean');
		
		return that;
	},
	
	/**
	* @method layout
	* Null the layout, no window is created
	*/
	layout: null,

	tags: {
		'PRIVACY': '/addons/Privacy/layout/privacy.js'
	},

	/**
	* @method getDefaults
	* Get default options of the plugin
	* @return {Object}
	*/
	getDefaults: function() {
	
		var result = this._super();
		
		return _.extend(result,{						
			
			// name is fixed
			id: 'privacy',
						
			/**
			* @property {String} name
			* Name of the privacy owner
			*/
			name: null,
			
			/**
			* @property {String} email
			* Email of the privacy owner
			*/	
			email: null
			
		});
		
	},
	
	/**
	* @method getContent
	* Get the content of the privacy, depends on local
	* @return {String}
	*/
	getContent: function() {
		
		var that = this;
		var options = this.getOptions();
		var locale = that.app.getLocale();
		var result = null;
		
		if (locale == 'it') {
			result = "Ai sensi dell'art.130 comma 4 del Codice della Privacy, D.lgs. n. 196/2003, La informiamo che i Suoi dati personali verranno raccolti al solo fine di soddisfare la Sua richiesta, quindi, potranno essere utilizzati per l'invio di comunicazioni o documentazione che Le interessa. Tali dati personali saranno trattati con l'ausilio di strumenti informatici e telematici adottando tutte le misure di sicurezza informatiche consigliate dalla legge per tutelare e garantire la riservatezza. Il conferimento di tali dati è facoltativo ma in mancanza non sarà possibile trasmetterLe la documentazione richiesta. I dati forniti non saranno comunicati né diffusi.\n"
			+"La informiamo che il titolare del trattamento dei dati personali è "+options.name+" email "+options.email+" II titolare del trattamento dei dati personali Le assicura l'esercizio dei diritti previsti dal Titolo II del Codice della Privacy; in particolare, mediante istanza orale o scritta. Lei ha il diritto di conoscere i dati trattati, di farli aggiornare e rettificare nonché, qualora ne abbia interesse, integrare; inoltre, Lei potrà in ogni momento richiedere la cancellazione in blocco dei dati trattati in violazione di legge, nonché opporsi al trattamento per finalità di promozione commerciale inviando un' e-mail a "+options.email;
		} else {
			result = "Personal data collected on any form of this web site by the controller "+options.name+" are processed in printed, computing and telematic form for the performance of contractual and lawful obligations as well as for the effective handling of business relationships."
			+"The data subjects may exercise all the rights set forth in art.7 of L.n.196/2003 (including the rights of data access, updating, objects to data processing and cancellation) by sending an e-mail message to: "+options.email+" at any moment.";
		}
	
		return result;
	},
	
	/**
	* @method show
	* Show the privacy dialog, if user accepts, resolve
	* @deferred
	*/
	show: function() {

		Ti.API.info('show@Privacy ');
		
		var deferred = jQ.Deferred();
		var that = this;
		var layoutManager = that.getLayoutManager();
		
		// check if already accepted
		var accepted = that.app.config.get('privacy','accepted');
		if (accepted === true) {
			deferred.resolve();
			Ti.API.info('Privacy statement already accepted');
			return deferred.promise();
		}
				
		// set the photo to be displayed
		layoutManager.setVariable('content',that.getContent());
		// create the layout
		var overlayWindow = layoutManager.createLayout('PRIVACY');
	
		layoutManager.events({
			'#btn-accept': {
				'click': function() {
					// close
					overlayWindow.close();
					// store accepted
					that.app.config.set('privacy','accepted',true);
					// resolve
					deferred.resolve();
				}
			},
			'#btn-cancel': {
				'click': function() {
					overlayWindow.close();
					deferred.reject();
				}
			}
						
		});
		
		// open the window
		// Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
		// Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL				
		overlayWindow.open({
			fullscreen: true,
			modal: true,
			animated: true,
			modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
		});

		return deferred.promise();
	}
	
});

module.exports = Privacy;


