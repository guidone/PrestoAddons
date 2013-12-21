/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

/*
TODO

-aggiungere nome del plugin
*/
module.exports.layout = [
	{
		type: 'view',
		className: 'pr-container pr-container-gallery',
		childs: [
			{
				type: 'tag',
				name: 'HEADER'	
			},

			{
				type: 'view',
				layout: 'horizontal',
				className: 'pr-imagewall pr-imagewall-gallery',
				childs: [
					{
						type: 'imageView',
						className: 'pr-thumb pr-thumb-gallery',
						forEach: function() {
							return this.getVariable('photos');
						},
						image: function(style,photo) {
							var contentPath = this.getVariable('contentPath');
							return contentPath+photo.get('square_75');
						}
						
					}
				
				]
				
			}

			
		
		]
	}	
];