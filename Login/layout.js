module.exports.layout = [
	{
		type: 'view',
		className: 'pr-container pr-container-posts',
		childs: [
			{
				type: 'tag',
				name: 'HEADER'	
			},
			{
				type: 'tag',
				name: function() {
					return this.getVariable('isLogged') ? 'LOGOUTFORM' : 'LOGINFORM';
				}
			}					
		]
	}
];
