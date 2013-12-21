/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = {
	type: 'window',
	className: 'pr-window pr-window-privacy',
	childs: [
		{
			type: 'view',
			className: 'pr-toolbar',
			childs: [
				{
					type: 'button',
					id: 'btn-accept',
					className: 'pr-button pr-button-accept',
					title: L('privacy_OkAccept')
				},
				{
					type: 'button',
					id: 'btn-cancel',
					className: 'pr-button-secondary pr-button-cancel',
					title: L('privacy_NoThanks')
				}				
			]
		},



				{
					type: 'scrollView',				
					childs: [
						{
							type: 'view',
							className: 'pr-container',
							childs: [
								{
									type: 'label',
									className: 'pr-label pr-label-content',
									text: '{content}'
								}
							]
						}
					]
				}
	]	
};

