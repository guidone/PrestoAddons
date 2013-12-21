/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = [{
	type: 'webView',
	className: 'pr-webview pr-webview-htmlpage',
	//height: Ti.UI.FILL,
	//height: '200dp',
	willHandleTouches: false,
	disableBounce: true,
	touchEnabled: true,
	width: Ti.UI.FILL
}
];