(function ($) {
    $(function () {
        $.x.extend.x('_plugins', function () {
            return {};
        });

        $.x.extend.x('plugin', function () {
            //$.x.plugin(id,[hasOwnController], initHandler)
            //$.x.plugin(id, initHandler)
            return function (a, b, c) {
                var hasOwnController, pluginName, initHandler;
                if ($.type(b) === $.x.type.boolean) {
                    pluginName = a;
                    hasOwnController = b;
                    initHandler = c;
                } else {
                    pluginName = a;
                    hasOwnController = false;
                    initHandler = b;
                }
                if ($.type(pluginName) !== $.x.type.string || !pluginName) {
                    return this.error('plugin name must be a string');
                }

                if ($.type(initHandler) !== $.x.type.function) {
                    return this.error('plugin initHandler must be a function');
                }

                this._plugins[pluginName] = {
                    controller: hasOwnController,
                    handler: initHandler
                };
            };
        });

        $.x.extend.apply(function (controller, view) {
            //get all of the plugins
            var plugins = view.$().find('[data-x-plugin]:not(.x-plugin)');
            if (plugins && plugins.length > 0) {
                var reApply = false;
                $.each(plugins, function (i, plugin) {
                    if ($.x._myController(plugin) === controller._id) {
                        //let the apply loop know that this plugin is already queued up
                        $(plugin).addClass('x-plugin');
                        var pluginNames = $(plugin).attr('data-x-plugin').split(' ');
                        $.each(pluginNames, function (i, pluginName) {
                            //check to see if plugin was defined
                            if (!$.x._plugins[pluginName]) {
                                return $.x.error('The plugin "' + pluginName + '" is not defined');
                            }

                            //determine if plugin was configured with controller
                            if ($.x._plugins[pluginName].controller) {
                                var pluginControllerId;
                                var pluginController;
                                //make sure there is not already a controller on this plugin.
                                if ($(plugin).attr('data-x-controller')) {
                                    pluginControllerId = $(plugin).attr('data-x-controller');
                                } else {
                                    pluginControllerId = 'plugin-x-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                                    $(plugin).attr('data-x-controller', pluginControllerId);
                                }
                                //get the controller
                                pluginController = $.x.controller(pluginControllerId);
                                $.x._plugins[pluginName].handler(pluginController, pluginController._view, $(plugin));
                            } else {
                                reApply = true;
                                $.x._plugins[pluginName].handler($(plugin));
                            }
                        });


                    }
                });
                //if plugin is one without a controller we need
                //to run the controller's update function to apply
                //the changes of this addition
                if (reApply) {
                    $.each(controller._view._apply, function (i, applyFunction) {
                        if ($.type(applyFunction) === $.x.type.function) {
                            applyFunction(controller, controller._view);
                        }
                    });
                }
            }
        });
    });
})(jQuery);
