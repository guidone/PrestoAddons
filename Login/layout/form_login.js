module.exports.layout = {
	type: 'view',
	className: 'pr-form pr-form-login',
	childs: [
		{
			type: 'label',
			className: 'pr-label pr-label-login',
			text: L('login_CompileFormToSignin')	
		},		
		{
			type: 'view',
			className: 'pr-field pr-field-textfield pr-field-textfield-login',
			childs: [
				{
					type: 'view',
					className: 'pr-field-label-container pr-field-label-container-login',
					childs: [
						{
							type: 'label',							
							className: 'pr-field-label pr-field-label-login',
							text: L('Email')
						}
					]
				},
				{
					type: 'view',
					className: 'pr-field-control-container pr-field-control-container-login',
					childs: [
						{
							type: 'textField',
							id: 'username',
							className: 'pr-field-control pr-field-control-textfield pr-field-control-textfield-login'
						}
					]
				}				
			]
		},
		{
			type: 'view',
			className: 'pr-field pr-field-textfield pr-field-textfield-login',
			childs: [
				{
					type: 'view',
					className: 'pr-field-label-container pr-field-label-container-login',
					childs: [
						{
							type: 'label',
							className: 'pr-field-label pr-field-label-login',
							text: L('Password')
						}
					]
				},
				{
					type: 'view',
					className: 'pr-field-control-container pr-field-control-container-login',
					childs: [
						{
							type: 'textField',
							id: 'password',
							className: 'pr-field-control pr-field-control-textfield pr-field-control-textfield-login',
							passwordMask: true
						}
					]
				}				
			]
		},
		{
			type: 'button',
			id: '#pr-button-login',
			className: 'pr-button pr-button-login',
			title: 'Login'
		},
		{
			type: 'tag',
			name: function() {
				var isFacebook = this.getVariable('isFacebook');
				return isFacebook ? 'FACEBOOKBUTTON' : null;
			}
		}
		
		/*,
		{
			type: 'view',
			className: 'pr-login-socialbuttons',
			childs: [
				{
					type: 'imageView',
					className: 'pr-login-socialbutton pr-login-facebook'
				},
				{
					type: 'imageView',
					className: 'pr-login-socialbutton pr-login-twitter',
					left: '15dp'
				},
				{
					type: 'imageView',
					className: 'pr-login-socialbutton pr-login-linkedin',
					left: '15dp'
				}				
			]
			
		}*/
	]	
};