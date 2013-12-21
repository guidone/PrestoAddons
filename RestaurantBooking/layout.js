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
							text: L('restaurantbooking_BookATable'),
							className: 'pr-label pr-label-restaurantBooking'
					},
					{
						type: 'view',
						className: 'pr-form-group pr-form-group-restaurantbooking pr-space-top',
						childs: [
							{
								type: 'textField',
								id: 'bookingName',						
								hintText: L('restaurantbooking_FirstNameLastName')
							},
							{
								type: 'textField',
								id: 'bookingPhone',
								className: 'pr-border',
								hintText: L('restaurantbooking_Cellphone')
							},
							{
								type: 'textArea',
								id: 'bookingReservation',
								hintText: L('restaurantbooking_Reservation')
							}
						]
					},
					{
						type: 'view',
						className: 'pr-restaurantbooking-buttons',
						childs: [
							{
								type: 'button',
								className: 'pr-button pr-button-restaurantbooking',
								id: 'restaurantbookingEmail',
								title: L('restaurantbooking_BookViaEmail')
							},
							{
								type: 'label',
								className: 'pr-label pr-label-restaurantbooking pr-restaurantbooking-or pr-label-center pr-space-top',
								text: L('or')
							},
							{
								type: 'button',
								className: 'pr-button pr-button-restaurantbooking pr-space-top',
								id: 'restaurantbookingSMS',
								title: L('restaurantbooking_BookViaSMS')
							}
						]
				}
				]
			}
		]
	}
];