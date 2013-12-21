module.exports.layout = {
	type: 'view',
	className: 'pr-form pr-form-login',
	childs: [
		{
		type: 'scrollView',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		layout: 'vertical',
		childs: [
			{
				type: 'label',
				className: 'pr-label pr-label-login',
				text: L('login_CompileFormToSignup')	
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
								text: L('login_FirstName')
							}
						]
					},
					{
						type: 'view',
						className: 'pr-field-control-container pr-field-control-container-login',
						childs: [
							{
								type: 'textField',
								id: 'signup_first_name',
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
								text: L('login_LastName')
							}
						]
					},
					{
						type: 'view',
						className: 'pr-field-control-container pr-field-control-container-login',
						childs: [
							{
								type: 'textField',
								id: 'signup_last_name',
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
								id: 'signup_username',
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
								id: 'signup_password',
								className: 'pr-field-control pr-field-control-textfield pr-field-control-textfield-login',
								passwordMask: true
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
								text: L('RepeatPassword')
							}
						]
					},
					{
						type: 'view',
						className: 'pr-field-control-container pr-field-control-container-login',
						childs: [
							{
								type: 'textField',
								id: 'signup_password_confirmation',
								className: 'pr-field-control pr-field-control-textfield pr-field-control-textfield-login',
								passwordMask: true
							}
						]
					}				
				]
			},
			{
				type: 'button',
				id: '#pr-button-signup',
				className: 'pr-button pr-button-signup',
				title: L('Signup')
			}
		]
		
		}
	]	
};