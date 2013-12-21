/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = {
	type: 'button',
	id: '#pr-button-login-facebook',
	className: 'pr-button pr-button-login-facebook',
	title: ' '+L('facebook_LoginWithFacebook'),
	top: '10dp',
	width: '100%',
	height: '46dp',
	backgroundImage: '/addons/Facebook/assets/pr-facebook-button.png',
	image: '/addons/Facebook/assets/fb-icon.png',
	color: '#ffffff',
	font: {
		fontSize: '18dp',
		fontFamily: 'DroidSans'			
	}	
};