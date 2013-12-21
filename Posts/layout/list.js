/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

module.exports.layout = {
	type: 'view',
	layout: 'vertical',
	className: 'pr-container pr-container-posts',
	childs: [
		{
			type: 'tableView',
			className: 'pr-list pr-list-posts',
			childs: [
				{
					type: 'tableViewRow',
					className: 'pr-list-row pr-list-row-posts',
					forEach: '{posts}',
					childs: [
						{
							type: 'view',
							className: 'pr-list-row-container pr-list-row-container-posts',
							childs: [
								{
									type: 'imageView',
									className: 'pr-list-photo pr-list-photo-posts',
									image: function(style,post) {
										var photo = post.getPhoto();
										var contentPath = this.getVariable('contentPath');

										return photo != null ? contentPath+photo.get('square_75') : '';
									}
								},
								{
									type: 'view',
									className: 'pr-list-label-container pr-list-label-container-posts',
									childs: [
										{
											type: 'label',
											className: 'pr-list-label pr-list-label-posts',
											text: '{data.title}'								
										},
										{
											type: 'label',
											className: 'pr-list-description pr-list-description-posts',			
											text: function(style,post) {
												return post.getContent({stripHtml: true});
											}
										}										
									]
								}
							]
							
						}
					]
				}				
			]
		}		
	]
};
