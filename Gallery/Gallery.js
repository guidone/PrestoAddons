/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');


/*
TODO
- deferred in showPhoto

*/

/**
* @class presto.addons.Gallery
* Gallery of images and full page image viewer  
* @extend presto.Plugin
*/
var GalleryPlugin = Plugin.extend({

	className: 'Gallery',

	/**
	* @method showPhoto
	* Show a photo in a modal overlay
	* @param {presto.models.Photo} photo
	*/
	showPhoto: function(photo) {
		
		Ti.API.info('showPhoto@Gallery '+JSON.stringify(photo));
		var that = this;
		var layoutManager = that.getLayoutManager();
		var options = that.getOptions();
		
		// set the photo to be displayed
		layoutManager.setVariable('photo',photo);
		layoutManager.setVariable('zoomSize',options.zoomSize);
		// create the layout
		var overlayWindow = layoutManager.createLayout('OVERLAY');
		// attach close
		//var btn = layoutManager.getById('btn-close');

		// close events
		var close = function(evt) {
			overlayWindow.close();	
		};		
		layoutManager.events({
			'#btn-close': {
				'click': close
			},
			'#btn-image': {
				'click': close
			},
			'#btn-share': {
				'click': function() {

					var share = that.app.getPluginById('share');
					share.share(that);			

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
				
	},

	
	/**
	* @method clickThumb
	* Handle the click on the table, calls onClick passing the event and the post as paramenter, the context is the plugin
	* @param {Object} event
	*/
	clickThumb: function(evt) {
	
		Ti.API.info('clickTable@gallery'+JSON.stringify(evt.source));
		
		var that = this;
		var layoutManager = that.getLayoutManager();
		var photo = layoutManager.getDataFromElement(evt.source);
		var options = that.getOptions();

		//Ti.API.info('photo'+JSON.stringify(photo))				
		// callback
		if (_.isFunction(options.onClick)) {
			options.onClick.call(that,evt,photo);
		} else {
			that.showPhoto(photo);
		}
		
	},
	
	events: {
		'.pr-thumb': {
			'click': 'clickThumb'
		}
	},

	tags: {
		//'/Volumes/Macintosh HD/web/presto/Resources/addons/Posts/layout/header.js'
		'HEADER': '/addons/Gallery/layout/header.js',
		'POSTLIST': '/addons/Gallery/layout/list.js',
		'OVERLAY': '/addons/Gallery/layout/overlay.js'
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
			* @cfg {Function} onClick
			* Executed on click of element, second argument is the clicked Backbone model
			*/
			onClick: null,
			
			/**
			* @cfg {String} zoomSize
			* Size of image to be displayed when zooming, available formats: square_75, thumb_100, small_240, medium_500,
			* medium_640, large_1024, original
			*/
			zoomSize: 'medium_640',
			
			sharing: {
				text: function() {
					var that = this;			
					var layout = that.getLayoutManager();
					var photo = layout.getVariable('photo');
					return photo.get('title') != null ? photo.get('title') : photo.get('filename');
				},
				image: function() {
					var that = this;			
					var layout = that.getLayoutManager();
					var photo = layout.getVariable('photo');
					var contentPath = layout.getVariable('contentPath');
					var zoomSize = layout.getVariable('zoomSize');
					return contentPath+photo.get(zoomSize);
				}		
			}
						
		});
		
	}

});

module.exports = GalleryPlugin;