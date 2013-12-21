/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');


/*
TODO
- fix layout manager in modo da usare tag anche come oggetti di array e non solo come oggetti singoli
- aggiungere header e footer come tag	

*/

/**
* @class presto.addons.Posts
* Master detail post list 
* @extend presto.Plugin
*/
var HtmlPagePlugin = Plugin.extend({

	className: 'Posts',
	
	/**
	* @method clickTable
	* Handle the click on the table, calls onClick passing the event and the post as paramenter, the context is the plugin
	* @param {Object} event
	*/
	clickTable: function(evt) {
	
		//Ti.API.info('clickTable@posts'+JSON.stringify(evt.source));
		
		var that = this;
		var layoutManager = that.getLayoutManager();
		var post = layoutManager.getDataFromElement(evt.source);
		var options = that.getOptions();
				
		// callback
		if (_.isFunction(options.onClick)) {
			options.onClick.call(that,evt,post);
		}
		
	},
		
	events: {
		'.pr-list': {
			'click': 'clickTable'
		}	
	},

	tags: {
		//'/Volumes/Macintosh HD/web/presto/Resources/addons/Posts/layout/header.js'
		'HEADER': '/addons/Posts/layout/header.js',
		'POSTLIST': '/addons/Posts/layout/list.js'
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
			* @cfg {Boolean} [debug=false]
			* Dump the HTML in console, do not use this in production or will flood the logs
			*/
			debug: false,
			
			/**
			* @cfg {Function} onClick
			* Executed on click of element, second argument is the clicked Backbone model
			*/
			onClick: null
			
		});
		
	}



	
	

});

module.exports = HtmlPagePlugin;