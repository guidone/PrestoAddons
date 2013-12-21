/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = [
	{
	type: 'label',
	text: 'ok passa di qua'	
		
	},

{
	type: 'dashboardView',
	className: 'pr-dashboard pr-dashboard-home',
	
	childs: [
		{
			type: 'dashboardItem',
			className: 'pr-dashboard-item pr-dashboard-item-home',
			forEach: '{buttons}',			
			image: function(style,obj) {
				return obj.icon;
			},
			//badge: 2,
			text: 'icona',
		}
	
	]
}];