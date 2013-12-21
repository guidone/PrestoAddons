/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = {
	type: 'view',
	className: 'pr-container pr-container-wheretofindus',
	childs: [
		{	
		type: 'view',
		className: 'pr-legend pr-legend-wheretofindus',
		
		childs: [
			{
			type: 'view',
			className: 'pr-legend-inner pr-legend-inner-wheretofindus',
			childs: [
				{
					type: 'label',
					className: 'pr-legend-title',
					text: '{company}',
				},
				{
					type: 'label',
					text: '{address}',
					className: 'pr-legend-label',
					condition: function(opts) {						
						var company = this.getVariable('company');
						return company != null;
					}				
				},
				{
					type: 'label',
					text: '{zip} {city}',
					className: 'pr-legend-label',
					condition: function() {
						var city = this.getVariable('city');
						var zip = this.getVariable('zip');
						return city != null || zip != null;
					}		
				},
				{
					type: 'label',
					id: 'phone',
					text: 'Tel: {phone}',
					className: 'pr-legend-label-small',
					condition: function(opts) {						
						var phone = this.getVariable('phone');
						return phone != null;
					}			
				},
				{
					type: 'label',
					id: 'email',
					text: 'Email: {email}',
					className: 'pr-legend-label-small',
					condition: function(opts) {						
						var email = this.getVariable('email');
						return email != null;
					}			
				}			
			]
			}						
		]
		},
		{
			type: 'view',
			className: 'pr-separator'	
		},


		{
				type: 'view',
				className: 'mapContainer',
				id: 'mapContainer',
				zIndex: 10,
				backgroundColor: 'red',
				//top: (headerSize-10)+'dp',
				width: Ti.UI.FILL,
				height: Ti.UI.FILL
					
			}

					
	]	
};