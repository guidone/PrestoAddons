/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = [

	{
		type: 'view',
		className: 'pr-container pr-container-home',
		childs: [
      {
        type: 'tag',
        name: function(style, obj) {

          var type = this.getVariable('header');

          if (type == 'banner') {
            return 'BANNER';
          } else {
            return 'LOGO';
          }
        }
      },
			{
				type: 'tag',
				//name: 'BUTTONS'
				name: function(style, obj) {
					var type = this.getVariable('type');
					if (type == 'buttons') {
						return 'BUTTONS';
					} else {
						return 'DASHBOARD';
					}
				}

			}



		]
	}
];

