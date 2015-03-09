/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = [
	{
		type: 'scrollView',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		disableBounce: true,
		showHorizontalScrollIndicator: false,
		childs: [
			{
				type: 'view',
				width: Ti.UI.FILL,
				className: 'pr-container pr-container-restaurantBooking',
				childs: [
					{
							type: 'label',
							text: L('contactus_Intro'),
							className: 'pr-label pr-label-restaurantBooking'
					},
					{
						type: 'view',
						className: 'pr-form-group pr-form-group-restaurantbooking pr-space-top',
						childs: [
							{
								type: 'textField',
								id: 'contactName',
								hintText: L('contactus_FirstNameLastName')
							},
              {
                type: 'textField',
                id: 'contactEmail',
                className: 'pr-border',
                hintText: L('contactus_Email')
              },
              {
								type: 'textField',
								id: 'contactPhone',

								hintText: L('contactus_Cellphone')
							},
							{
								type: 'textArea',
								id: 'contactText',
                className: 'pr-border',
                hintText: L('contactus_Text')
							}
						]
					},
					{
						type: 'view',
						className: 'pr-restaurantbooking-buttons',
						childs: [
							{
								type: 'button',
								className: 'pr-button pr-button-contact',
								id: 'contactus_Send',
								title: L('contactus_Send')
							}
						]
				}
				]
			}
		]
	}
];
