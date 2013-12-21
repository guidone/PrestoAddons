/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');


var TestPlugin = Plugin.extend({

	init: function() {
		
		var that = this;	
		that._super.apply(this,arguments);

//Ti.API.info('app '+JSON.stringify(this._app));
//Ti.API.info('app '+JSON.stringify(this._app.menu));
		
		var menu = this.getApp().menu;
		var app = this.getApp();
		
		
		/*
		menu.addSection({
			id: 'barabba',
			title: 'My Test',
			items: [
				{
					id: 'barabba_1',
					title: 'Ciccio',
					onClick: function() {
						Ti.API.info('clicco e apro '+that.reference);
						try {
						app.open(that.reference);
						} catch(e) {
							Ti.API.info('erorroroe open '+JSON.stringify(e));
						}
						
					}
				}
			]
		});
		*/
						
		return this;
	},

	/**
	* @cfg {String} content
	*/

	layout: function() {

		this.createMainWindow();

		var label = Ti.UI.createLabel({
			text: this._options.content,
			
		});
		
		this.getWindow().add(label);

		return this;
	}

	
	

});

module.exports = TestPlugin;