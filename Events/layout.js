/*
TODO

-aggiungere nome del plugin
*/
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
				name: 'EVENTLIST'
			}		
		]
	}
];