/*jshint laxbreak: true,eqnull: true,browser: true,jquery: true,devel: true,regexdash: true,multistr: true, white: false */
/*global define: true, require: true, module: true, Ti: true, L: true, Titanium: true, Class: true */

var _ = require('/presto/libs/underscore');
var Plugin = require('/presto/plugin');
var jQ = require('/presto/libs/deferred/jquery-deferred');
var dialogs = require('/presto/helpers/dialogs');
var moment = require('/presto/components/moment/moment');

/*
TODO

*/

/**
* @class presto.addons.Memento
* Remember to call actions on daily basis. Only one task per application launch will be executed
* (the other will be deferred to the next launch). To define task
*
*     App.registerPlugin('Memento',{
*       tasks: [
*         {
*           every: 10, // remeber every n days
*           after: 1, // start remember after n days
*           action: 'rate', // the action
*           question: 'Would you take a moment to rate this app?'
*         }
*       ]
*      });
*
* To start the task as soon as the application starts, just set *after: 0* or null. The *action* field
* must be an action defined elsewhere, this plugin is just a task manager, the task are no defined in this
* plugin. The *question* parameter is what the alert box will display
*
* @extend presto.Plugin
*/
var Memento = Plugin.extend({

	className: 'Memento',

	/**
	* @method layout
	* Null the layout, no window is created
	*/
	layout: null,

	/**
	* @method getDefaults
	* Get default options of the plugin
	* @return {Object}
	*/
	getDefaults: function() {

		var result = this._super();


		return _.extend(result,{

			// fix id
			id: 'memento',

			/**
			* @cfg {Array} tasks
			* The array of tasks
			*/
			tasks: null

		});

	},

	/**
	* @method reset
	* Just for testing, reset all the task flags
	* @chainable
	*/
	reset: function() {

		var that = this;

		that.app.config.set('memento','flags',{});

		return that;
	},

	/**
	* @method executeTasks
	* Execute the chain of task
	* @protected
	*/
	executeTasks: function() {

		var that = this;
		Ti.API.info('EXECUTE TASKS -- '+JSON.stringify(that.app.config.get('memento','flags')));
		//that.reset();
		var options = that.getOptions();
		var triggered = false;
		var flags = that.app.config.get('memento','flags');

		// check if null
		if (flags == null) {
			flags = {};
		}

		_(options.tasks).each(function(task) {

			var showTask = false;

			// skip if said no
			if (flags[task.action] === false || flags[task.action] === true) {
				Ti.API.info('Task '+task.action+' skipped');
				showTask = false;
			}

			// if is date
			if (_.isDate(flags[task.action])) {
				// check the date
				if (moment(flags[task.action]).isAfter()) {
					showTask = true;
				}
			} else if (flags[task.action] == null) {
				// if nothing specified
				if (_.isNumber(task.after) && task.after > 0) {
					showTask = false;
					flags[task.action] = moment().add('days',task.after);
					Ti.API.info('Memento not before, '+JSON.stringify(flags));
				} else {
					showTask = true;
				}
			}

			var action = that.app.getAction(task.action);

			if (showTask && !triggered && action != null) {
				triggered = true;
				var buttons = [
					action.label,
					L('memento_RemindMeLater'),
					L('memento_NoThanks')
				];
				// ask
				dialogs.ask(task.question,buttons)
					.done(function(idx) {
						Ti.API.info('scelto '+idx);
						if (idx === 0) {
							// ok execute action
							that.action(task.action);
							// store he did
							flags[task.action] = true;
						} else if (idx == 1) {
							// remind me later, do nothing
							flags[task.action] = moment().toDate();
						} else if (idx == 2) {
							// he said no
							flags[task.action] = false;
						}
						// store the flags
						that.app.config.set('memento','flags',flags);
					});
			}

		});

	},

	/**
	* @method onInitialize
	* Init the params, listen to app to start
	*/
	onInitialize: function() {

		var that = this;
		var options = that.getOptions();

		that.app.config.registerParam('memento','flags','object');

		// listen to app start
		that.addEventListener('app_start',function() {
			that.executeTasks();
		});

	}




});

module.exports = Memento;


