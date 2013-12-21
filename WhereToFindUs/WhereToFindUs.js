/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');

/*
TODO
- add button for email, phone and driving directions
- parametrize pin

*/

/**
* @class presto.addons.WhereToFindUs
* Classic where to find us, with the map and  
* @extend presto.Plugin
*/
var WhereToFindUs = Plugin.extend({

	className: 'WhereToFindUs',

	/**
	* @method onInitialize
	* Initialize, add action for map directions
	* @chainable
	*/
	onInitialize: function() {
	
		var that = this;
	
		that.app.registerAction({
			name: 'directions',
			label: L('wheretofindus_Directions'),
			execute: function() {
				that.getDirections();
			}
		});
		
		return that;
	},

	/**
	* @method getDefaults
	* Get default options of the plugin
	* @return {Object}
	*/
	getDefaults: function() {
	
		var result = this._super.call(this);
		
		return _.extend(result,{
			
			/**
			* @property {String} company
			* Name of the company
			*/
			company: null,
			
			/**
			* @property {String} address
			* Address of the company
			*/
			address: null,
			
			/**
			* @property {String} zip
			*/
			zip: null,
			
			/**
			* @property {String} city
			* City of the company
			*/
			city: null,
			
			/**
			* @property {String} phone
			* Clickable phone number
			*/
			phone: null,

			/**
			* @property {String} email
			* Clickable email
			*/
			email: null,

			/**
			* @property {Boolean} userLocation
			* Boolean indicating if the user's current device location should be shown on the map. 
			* If true, the user's location is marked with a pin.
			*/
			userLocation: false,
			
			/**
			* @property {Number} mapType
			* Map type, either: Titanium.Map.STANDARD_TYPE, Titanium.Map.SATELLITE_TYPE or Titanium.Map.HYBRID_TYPE.
			*/
			mapType: Ti.Map.STANDARD_TYPE,
			
			/**
			* @property {Number} latitudeDelta
			* The amount of north-to-south distance displayed on the map, measured in decimal degrees.
			*/
			latitudeDelta: 0.1,
			
			/**
			* @property {Number} longitudeDelta
			* The amount of east-to-west distance displayed on the map, measured in decimal degrees.
			*/
			longitudeDelta: 0.1,
			
			action: 'directions'

					
		});
		
	},

	/**
	* @method getVariables
	* Get the variables
	* @return {Object}
	*/
	getVariables: function() {
		
		var that = this;
		var result = that._super.apply(that,arguments);
		var options = that.getOptions();
		
		result.company = options.company;
		result.address = options.address;
		result.zip = options.zip;
		result.city = options.city;
		result.phone = options.phone;
		result.email = options.email;
		result.userLocation = options.userLocation;
		
		return result;
	},

	/**
	* @method onLayout
	* Paint the map when the layout is ready
	*/
	onLayout: function() {

		var that = this;
				
		var layoutManager = that.getLayoutManager();
		var options = that.getOptions();
		var mapContainer = layoutManager.getById('mapContainer');
				
		that._map = Titanium.Map.createView({
			width: Ti.UI.FILL,						
			animate: false,
			height: Ti.UI.FILL,
			userLocation: options.userLocation,								
			annotations: [
				{
					animate: true,
					latitude: options.latitude,
					longitude: options.longitude,
					title: options.company,
					subtitle: options.address+', '+options.city,
					pincolor: Ti.Map.ANNOTATION_RED
					//rightButton: Titanium.UI.iPhone.SystemButton.INFO_DARK
					//rightButton: Titanium.UI.iPhone.SystemButton.INFO_LIGHT,
					//rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
					//rightButton: Titanium.UI.iPhone.SystemButton.CONTACT_ADD
				}					
			],
			mapType: options.mapType,
			regionFit: true
		});
		
		var onComplete = function() {
			// put a timeout or set region won't work
			setTimeout(function() {
				that._map.setRegion({
					longitudeDelta: options.longitudeDelta,
					longitude: options.longitude,
					latitude: options.latitude,
					latitudeDelta: options.latitudeDelta
				});
			},400);
			
			that._map.removeEventListener('complete',onComplete);
		};

		that._map.addEventListener('complete',onComplete);

		// attach link
		/*var annotations = that._map.getAnnotations();
		if (_.isArray(annotations) && annotations.length) {
			annotations[0].addEventListener('click',function(evt) {
				if (evt.clicksource == 'rightButton') {
					var destination = options.address+' '+options.city;
					var start = that.getCurrentLocationLabel();
					Ti.Platform.openURL('http://maps.apple.com/?saddr='+start+'&daddr='+destination);
				}
			});
		}
		*/
				
		mapContainer.add(that._map);
		
	},
	
	/**
	* @method getDirections
	* Open built in map directions
	* @chainable
	*/
	getDirections: function() {
		
		var that = this;
		var options = that.getOptions();

		Ti.Geolocation.getCurrentPosition(function(result) {
			if (result.success) {
				var destination = options.address+' '+options.city;
				var start = result.coords.latitude+','+result.coords.longitude;
				Ti.Platform.openURL('http://maps.apple.com/?saddr='+start+'&daddr='+destination);
			} else {
				alert(L('wheretofindus_ImpossibileToFindCurrentPosition'));
			}
			
		});
		
		return this;
	},
	
	/**
	* @method getCurrentLocationLabel
	* Get the label of current position in different languages
	* @return {String}
	*/
	getCurrentLocationLabel: function() {
	
		var that = this;
		var locale = that.app.getLocale();
		
		switch (locale) {
			case 'en': return "Current Location";
			case 'nl': return "Huidige locatie";
			case 'fr': return "Lieu actuel";
			case 'fr': return "Aktueller Ort";
			case 'it': return "Posizione attuale";
			case 'ja': return "現在地";
			case 'es': return "Ubicación actual";
			case 'ca': return "Ubicació actual";
			case 'cs': return "Současná poloha";
			case 'da': return "Aktuel lokalitet";
			case 'el': return "Τρέχουσα τοποθεσία";
			case 'fi': return "Nykyinen sijainti";
			case 'hr': return "Trenutna lokacija";
			case 'hu': return "Jelenlegi helyszín";
			case 'id': return "Lokasi Sekarang";
			case 'ko': return "현재 위치";
			case 'ms': return "Lokasi Semasa";
			case 'no': return "Nåværende plassering";
			case 'pl': return "Bieżące położenie";
			case 'pt': return "Localização Atual";
			case 'ro': return "Loc actual";
			case 'ru': return "Текущее размещение";
			case 'sk': return "Aktuálna poloha";
			case 'sv': return "Nuvarande plats";
			case 'th': return "ที่ตั้งปัจจุบัน";
			case 'tr': return "Şu Anki Yer";
			case 'uk': return "Поточне місце";
			case 'vi': return "Vị trí Hiện tại";
			case 'zh': return "当前位置";			
		}

	}

});

module.exports = WhereToFindUs;