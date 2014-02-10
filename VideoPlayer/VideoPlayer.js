/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var Cloud = require('ti.cloud');

/*

TODO

*/


/**
* @class presto.addons.VideoPlayer
*
* @extend presto.Plugin
*/
var VideoPlayer = Plugin.extend({

  className: 'VideoPlayer',

  init: function() {

    var that = this;

    that._super.apply(that,arguments);


  },

  /**
  * @method getPlayer
  * Return the current video player
  * @return {Ti.Media.VideoPlayer}
  */
  getPlayer: function() {

    if (this._player == null) {
      var layout = this.getLayoutManager();
      this._player = layout.getById('player');
    }

    return this._player;
  },

  onBeforeHide: function() {

    var player = this.getPlayer();

    // pause the video when exiting
    player.pause();

    return true;
  },


  onBeforeShow: function() {

    //Ti.API.info('onBeforeShow@HtmlPage');

    var that = this;


    var player = this.getPlayer();
    var variables = that.getVariables();

    if (that.collection.length >= 0) {
      var video = that.collection.at(0);
      var file_path = variables.contentPath+'videos/'+video.get('file_name');

      player.url = file_path;

    }

    return true;
  },

  /**
  * @method getDefaults
  * Get default options of the plugin
  * @return {Object}
  */
  getDefaults: function() {

    var result = this._super();

    return _.extend(result,{

      orientable: true



    });

  }

});

module.exports = VideoPlayer;


