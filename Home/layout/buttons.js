/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = {
	
	type: 'view',
	className: 'pr-home-buttons',
	childs: [
		{
			type: 'view',
			forEach: '{buttons}',
			className: 'pr-home-button-container',
			childs: [
				{
					type: 'button',
					className: 'pr-button pr-button-home',
					id: '{data.id}',
					title: '{data.title}'
				}
			]
			
		}
	
	]
	
};