
module.exports.layout = {
  type: 'window',
  className: 'pr-overlay pr-overlay-gallery',
  childs: [
    {
      type: 'view',
      className: 'pr-layout pr-layout-gallery',
      childs: [
        {
          type: 'button',
          id: 'btn-close',
          className: 'pr-btn pr-btn-gallery pr-btn-close pr-btn-close-gallery',
          title: L('Close')
        },
        {
          type: 'button',
          id: 'btn-share',
          className: 'pr-btn pr-btn-gallery pr-btn-share pr-btn-share-gallery',
          title: L('Share'),
          condition: function() {
            return this.getVariable('hasSharing');
          }
        },
        {
          type: 'imageView',
          id: 'btn-image',
          className: 'pr-image pr-image-gallery',
          image: function() {
            var photo = this.getVariable('photo');
            var contentPath = this.getVariable('contentPath');
            var zoomSize = this.getVariable('zoomSize');
            return contentPath+photo.get(zoomSize);
          }
        },
        {
          type: 'view',
          condition: function() {
            return this.getVariable('caption');
          },
          className: 'pr-footer pr-footer-image-gallery',
          childs: [
            {
              type: 'view',
              className: 'pr-background pr-background-image-gallery'
            },
            {
              type: 'label',
              className: 'pr-label pr-label-title pr-label-title-image-gallery',
              text: function() {
                var photo = this.getVariable('photo');
                return photo.get('title');
              }
            }
          ]
        }
      ]
    }
  ]
};
