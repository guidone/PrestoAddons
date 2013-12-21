/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var HtmlPage = require('/addons/HtmlPage/HtmlPage');
var Backbone = require('/presto/components/backbone/backbone');

/*

TODO

*/




/**
* @class presto.addons.Reviews
* Testflight plugin
* @extend presto.addons.HtmlPage
*/
var Reviews = HtmlPage.extend({

	className: 'Reviews',

	/**
	* @method getVariables
	* Fix the method, Handlebars doesn't handle backbone directly, so collections and models are serialized. If a current
	* post is defined, then override the variable 'post'
	* @return {Object}
	*/
	getVariables2: function() {

		var that = this;
		var result = that._super.call(that);

		return result;
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
			* @cfg {String} template
			* The inner template to render inside the html page, by default is the first post of the posts collection
			*/
			template: '<div class="reviews">'
				+'{{#each posts}}'
					+'<div class="review">'
						+'<div class="message">"{{{content}}}"</div>'
						+'<div class="author">{{author}}</div>'
					+'</div>'
				+'{{/each}}'
				+'</div>',

			tags: {
				'HEADER': '/addons/Gallery/layout/header.js'
			}

		});

	}


});

module.exports = Reviews;


