/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true */
/*global define: true,google: true */

var moment = require('/presto/components/moment/moment');

module.exports.layout = {
	type: 'view',
	layout: 'vertical',
	className: 'pr-container pr-container-events',
	childs: [
		{
			type: 'tableView',
			className: 'pr-list pr-list-events',
			childs: [
				{
					type: 'tableViewRow',
					className: 'pr-list-row pr-list-row-events',
					forEach: '{events}',
					childs: [
						{
							type: 'view',
							className: 'pr-list-row-container pr-list-row-container-events',
							childs: [
								{
									type: 'imageView',
									className: 'pr-list-photo pr-list-photo-events',
									image: function(style,event) {
										var photo = event.getPhoto();
										var contentPath = this.getVariable('contentPath');

										return photo != null ? contentPath+photo.get('square_75') : '';
									}
								},
								{
									type: 'view',
									className: 'pr-list-label-container pr-list-label-container-events',
									childs: [
										{
											type: 'label',
											className: 'pr-list-date pr-list-date-events',
											text: function(style,obj) {
												var momentjs = this.getMoment();
												var dateTimeFormat = this.getVariable('dateTimeFormat');
												return momentjs(obj.get('start_time')).format(dateTimeFormat);
											}
										},
										{
											type: 'label',
											className: 'pr-list-label pr-list-label-events',
											text: '{data.name}'
										},
										{
											type: 'label',
											className: 'pr-list-description pr-list-description-events',
											text: function(style,event) {
												return event.getContent({stripHtml: true});
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
