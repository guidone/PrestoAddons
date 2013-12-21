/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = [

	{
		type: 'view',
		className: 'pr-container pr-container-home',
		childs: [

	{
		type: 'imageView',
		backgroundImage: '/assets/windows/top_bg.png',
		height: '107dp',
		backgroundRepeat: true,
		width: Ti.UI.FILL,
		childs: [
			{
				type: 'imageView',
				image: '/assets/windows/top_logo.png',
				width: '140dp',
				height: '80dp'
				
			}
		]
		
	},

			{
				type: 'tag',
				//name: 'BUTTONS'
				name: function(style,obj) {
					var type = this.getVariable('type');
					if (type == 'buttons') {
						return 'BUTTONS';
					} else {
						return 'DASHBOARD';
					}
				}
				
			},


			
		]	
	}
];

