/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = {
	type: 'view',
	className: 'pr-form pr-form-logout',
	childs: [
		{
			type: 'view',
			className: 'pr-welcome-login',	
			childs: [
				{
					type: 'label',
					className: 'pr-label',
					width: Ti.UI.SIZE,
					text: L('Welcome')
				},
				{
					type: 'label',
					className: 'pr-label-bold',
					width: Ti.UI.SIZE,
					text: function() {
						var user = this.getVariable('user');
						return user != null ? ' '+user.first_name+' '+user.last_name : '';
					}	
				},
				{
					type: 'label',
					className: 'pr-label',
					width: Ti.UI.SIZE,
					text: '!'
				}	
			]
		},
		{
			type: 'view',
			className: 'pr-push-panel-login',
			id: 'btnSwitchPushMessages',
			childs: [
				{
					type: 'switch',
					value: '{isSubscribed}'
				},
				{
					type: 'label',
					className: 'pr-label pr-label-login',
					text: L('login_EnablePushMessages')					
				}
			]
		},
		{
			type: 'button',
			className: 'pr-button pr-button-logout',
			title: L('Logout')
		}
	]
};