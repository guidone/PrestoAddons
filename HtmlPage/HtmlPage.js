/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var Backbone = require('/presto/components/backbone/backbone');
var Handlebars = require('/presto/libs/handlebars');
var logger = require('/presto/logger');

/*
TODO inserire methodo back

- fixare il preload della pagina

*/


/**
* @class presto.addons.HtmlPage
* Simple HTML page, create a menu, fetch content from the cloud, uses Handlebars for parsing the template. Inside the template
* are available the variables model and collection and the following helpers:
*
* - dateTimeFormat (format following the locale date)
* - dateFormat
* - timeFormat
*
* These helpers format the date/time using the current locale, to change the layout of the date (for example to have the time before the
* date), just change {@link presto.Plugin#dateFormat}, {@link presto.Plugin#timeFormat}, {@link presto.Plugin#dateTimeFormat}.
*
* Handlebar will also make pubblic any model or collection passed to the plugin, for example to iterate through a collection, change
* the {@link presto.addons.HtmlPage#property-template} of the plugin
*
*     {{#each collection}}
*       {{title}}
*     {{/each}}
*
* The list of available variables present in Handlebars template
*
* - title Title of the plugin, taken from options
* - random A random number to avoid caching problems
* - themePath The path to the current theme
* - pluginPath The path to the current plugin
* - appPath The path to the application
* - contentPath The path to the content data
*
* To address an image inside the template, it's a good practice to use the correct *contentPath*
*
*     <img src="{{contentPath}}{{model.photo.medium_500}}">
*
* but is possible to reference an image directly with the name and the postfix for the size (assuming was included in the download
* {@link presto.models.ContentClass#imageSizes})
*
*     <img src="{{contentPath}}my_image_name_small_240.png">
*
* The plugin also predefine a sharing capabilities: by default it's shared the full content of the {@link presto.addons.HtmlPage#model}
* with the html stripped, the image associated to the content using the size defined {@link presto.addons.HtmlPage#zoomSize} and, if
* present, the link present in the custom field *url*
* @extend presto.Plugin
*/
var HtmlPagePlugin = Plugin.extend({

  className: 'HtmlPage',

  /**
  * @method getDefaults
  * Get default options of the plugin
  * @return {Object}
  */
  getDefaults: function() {

    var result = this._super();

    return _.extend(result,{

      /**
      * @cfg {String} template
      * The inner template to render inside the html page, by default is the first post of the posts collection
      */
      template: '{{{model.content}}}',

      /**
      * @cfg {Array} cssStyles
      * Array of CSS style to include in the page. Files are relative to the app path, you likely use something like
      * /assets/my_style.css
      */
      cssStyles: null,

      /**
      * @cfg {String} [debug=false]
      * If not sure about what is going on in the html, just enable this to see what HTML code si passed to the webview
      */
      debug: false,

      /**
      * @cfg {String} zoomSize
      * Size of image to be displayed when zooming, available formats: square_75, thumb_100, small_240, medium_500,
      * medium_640, large_1024, original
      */
      zoomSize: 'medium_640',

      // fix the sharing behaviour, whole text without tags, the image of the current model and link
      // taken from custom field 'url'
      sharing: {
        image: function() {
          var that = this;
          var layout = that.getLayoutManager();
          var options = that.getOptions();
          var result = null;
          var photo = _.isFunction(that.model.getPhoto) ? that.model.getPhoto() : null;
          if (photo != null) {
            var contentPath = layout.getVariable('contentPath');
            result = contentPath+photo.get(options.zoomSize);
          }
          return result;
        },
        text: function() {
          var text = this.model.getContent({stripHtml: true});
          var url = this.model.getCustomField('url');
          if (url != null) {
            text += '\n\n'+url;
          }
          return text;
        },
        url: function() {
          return this.model.getCustomField('url');
        }
      }

    });

  },

  getWebView: function() {

    var that = this;
    var layoutManager = that.getLayoutManager();
    var views = layoutManager.getByClass('pr-webview');

    if (_.isArray(views) && views.length !== 0) {
      return views[0];
    } else {
      return null;
    }

  },

  _loadedContentId: null,

  /**
  * @method getVariables
  * Fix the method, Handlebars doesn't handle backbone directly, so collections and models are serialized. If a current
  * post is defined, then override the variable 'post', any custom fields defined in ACS are merged into the serialized object
  * @return {Object}
  */
  getVariables: function() {

    var that = this;
    var result = that._super.call(that);
    var options = that.getOptions();

    // serialize Backbone models and collections
    _(result).each(function(value,key) {

      // if a model
      if (value instanceof Backbone.Model) {
        result[key] = value.toJSON();
        result[key] = _.extend(result[key],value.getCustomFields());
      }

      // if a collection
      if (value instanceof Backbone.Collection) {

        var items = [];
        value.each(function(item) {
          var serialized = item.toJSON();
          serialized = _.extend(serialized,item.getCustomFields());
          items.push(serialized);
        });

        result[key] = items;
      }
    });

    // collect the styles
    result.styles = '';
    _(options.cssStyles).each(function(style) {
      if (options.debug) {
        logger.info('[Plugin:HtmlPage] Linking CSS style: '+result.appPath+style);
      }
      result.styles += '<link href="'
        +result.appPath+style
        +'" rel="stylesheet" type="text/css" />';
    });

    // collect the model
    if (that._model) {
      result.model = that._model.toJSON();
    }
    if (that._collection) {
      result.collection = that._collection.toJSON();
    }

    return result;
  },


  /**
  * @method onBeforeShow
  * Preload the content in the html, resolve when the load is finished
  * @deferred
  */
  onBeforeShow: function() {

    //Ti.API.info('onBeforeShow@HtmlPage');

    var that = this;
    var deferred = jQ.Deferred();

    var webView = that.getWebView();
    var moment = that.app.getMoment();
    var options = that.getOptions();

    // if content is the same, then resolve immediately
// fix here
    //if (false && that._loadedContentId == node.posts[0].id) {
    //  deferred.resolve();
    //  return deferred.promise();
    //}

    var onComplete = function(evt) {
      webView.removeEventListener('load',onComplete);
      //that._loadedContentId = node.posts[0].id;
      deferred.resolve();
    };

    // get the variables to pass to renderer
    var variables = that.getVariables();

    var templatePath = variables.appPath+'addons/HtmlPage/template.html';
    Ti.API.info('Opening layout '+templatePath);
    var fileHtml = Ti.Filesystem.getFile(templatePath);
    var fileHtmlContents = fileHtml.read();
    var layout = fileHtmlContents.toString();

    Handlebars.registerPartial('innerTemplate',options.template);

    // register helper
    Handlebars.registerHelper('dateFormat', function(date) {
      var tmp = moment(date);
      return tmp.isValid() ? tmp.format(options.dateFormat) : '';
    });
    Handlebars.registerHelper('dateTimeFormat', function(date) {
      var tmp = moment(date);
      return tmp.isValid() ? tmp.format(options.dateTimeFormat) : '';
    });
    Handlebars.registerHelper('timeFormat', function(date) {
      var tmp = moment(date);
      return tmp.isValid() ? tmp.format(options.timeFormat) : '';
    });

    var template = Handlebars.compile(layout);
    var html = template(variables);

    if (options.debug) {
      logger.info('----- START HTML PAGE -----');
      logger.info(html);
      logger.info('----- END HTML PAGE -----');
    }

    // start the view
    webView.addEventListener('load',onComplete);
    webView.setHtml(html,{
      baseURL: variables.contentPath
    });

    return deferred.promise();
  },

  _currentPost: null

});

/**
* @property {String} post
* Set the post to be displayed
*/
Object.defineProperty(HtmlPagePlugin.prototype,'post',{
  get: function() {
    return this._currentPost;
  },
  set: function(currentPost) {
    this._currentPost = currentPost;
  },
  enumerable: true,
  configurable: true
});


module.exports = HtmlPagePlugin;