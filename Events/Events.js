/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var Posts = require('/addons/Posts/Posts');

/*
TODO

*/

/**
* @class presto.addons.Events
* Master detail post list, it automatically register a plugin {@link presto.addons.HtmlPage} to display the detail of the event
* and a content class events
* @extend presto.addons.Posts
*/
var EventsPlugin = Posts.extend({

	className: 'Events',

	/**
	* @method onInitialize
	* Inizialize the plugin, register the detail plugin
	* @chainable
	*/
	onInitialize: function() {

		var that = this;
		var options = that.getOptions();

		that.app.registerPlugin('HtmlPage',{
			id: 'eventDetail',
			title: null,
			template: options.template,
			cssStyles: [
				'/assets/style.css'
			],
			zoomSize: options.zoomSize, // must be the same
			action: 'share'
		});

		// copy in content class
		that._options.content.language = that._options.language;

		return that;
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

			// handle the click
			onClick: function(evt,model) {
				that.open('eventDetail',{
					model: model
				});
			},

			tags: {
				//'/Volumes/Macintosh HD/web/presto/Resources/addons/Posts/layout/header.js'
				'HEADER': '/addons/Events/layout/header.js',
				'EVENTLIST': '/addons/Events/layout/list.js'
			},

			// fixed zoom size
			zoomSize: 'medium_500',

			// fixed content class
			content: {
				imageSizes: ['square_75','thumb_100','medium_500'],
				className: 'events',
				types: ['events','photos']
			},

			/**
			* @cfg {Boolean} language
			* Tells if content is language aware
			*/
			language: false,

			/**
			* @property {String} template
			* The HTML template to be shown in the detail of the event
			*/
			template: '<h4>{{dateTimeFormat model.start_time}}</h4>'
				+'<h1>{{model.title}}</h1>'
				+'<img src="{{contentPath}}{{model.photo.medium_500}}" width="100%" align="center"><br>'
				+'{{{model.content}}}'

		});

		return result;
	}

});

module.exports = EventsPlugin;