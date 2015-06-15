(function($) {
    "use strict";
    var x = function() {
        var x = {
            _abstractController: {
                _id: false,
                _addExtension: function(extensionId, extension) {
                    this[extensionId] = extension;
                },
                $: function(selector) {
                    var $controller = $('[data-x-controller="' + this._id + '"]');
                    if (selector) {
                        return $controller.find(selector);
                    }
                    return $controller;
                }
            },
            _addExtension: function(extensionId, extension) {
                this[extensionId] = extension;
            },
            _myController: function(domNode) {
                var controllerNode = $(domNode).parents('[data-x-controller]')[0];
                if (controllerNode) {
                    return controllerNode.attributes['data-x-controller'].value;
                } else {
                    return false;
                }
            },
            _controllers: {},
            extend: {
                x: function(extensionId, extensionFactory) {
                    if ($.type(extensionId) !== $.x.type.string || !extensionId) {
                        return $.x.error('Extension ID must be a string');
                    }
                    if ($.type(extensionFactory) !== $.x.type.function) {
                        return $.x.error('Extension factory must be a function');
                    }
                    $.x._addExtension(extensionId, extensionFactory());
                },
                controller: function(extensionId, extensionFactory) {
                    if ($.type(extensionId) !== $.x.type.string || !extensionId) {
                        return $.x.error('Extension ID must be a string');
                    }
                    if ($.type(extensionFactory) !== $.x.type.function) {
                        return $.x.error('Extension factory must be a function');
                    }
                    $.x._abstractController._addExtension(extensionId, extensionFactory());
                }
            },
            controller: function(controllerId, initHandler) {
                if (!controllerId) {
                    return this.error('A controller ID is required');
                }

                //variable used to determine if we need to run controller's apply method
                var runApply = false;

                //if there is not an init handler and controller is not defined, we need to run the
                //apply method of the controller to initialize the controller's bindings and
                //plugins
                if(!initHandler && !this.isController(controllerId)) {
                    runApply = true;
                }
                //determine if controllers defined
                if (!this.isController(controllerId)) {
                    //if not defined make sure that it has a binding
                    //data-x-controller="controllerId" in the dom markup
                    var controllerDom = $('[data-x-controller="' + controllerId + '"]');
                    if (controllerDom.length === 0) {
                        return this.error('Controller binding could not be found');
                    }
                    if (controllerDom.length > 1) {
                        return this.error('Controllers can only be bound once');
                    }
                    var x = this;
                    this._controllers[controllerId] = function(controllerId) {
                        var controller;
                        var allParentsDom = $('[data-x-controller=' + controllerId + ']').parents('[data-x-controller]');
                        if (allParentsDom.length > 0) {
                            var parentDom = allParentsDom[0];
                            var parentControllerId = $(parentDom).attr('data-x-controller');
                            var parentController = x.controller(parentControllerId);
                            controller = Object.create(parentController);
                        } else {
                            controller = Object.create(x._abstractController);
                        }

                        //set the controller Id
                        controller._id = controllerId;
                        return controller;
                    }(controllerId);
                }
                //if initHandler run the handler and set the apply method to run
                if (initHandler) {
                    runApply = true;
                    initHandler(this._controllers[controllerId]);
                }
                if(runApply) {
                    this._controllers[controllerId].apply();
                }

                return this._controllers[controllerId];
            },
            isController: function(controllerId) {
                if (this._controllers[controllerId]) {
                    return true;
                }
                return false;
            },
            error: function(message) {
                var errorHeading = '' +
                    '            _  _      ___  ____  ____ __   ___\n' +
                    ' ________  | |/ /    / _ |  __/|  __/ _ `|  __|  ________\n' +
                    '/___/___/   >  <    |  __/ |   | | | (_) | |    /___/___/\n' +
                    '           /_/|_|    |___|_|   |_| |____/|_|\n';
                if (window.console && console.debug) {
                    console.debug(errorHeading);
                }
                var error = new Error(message);
                if (window.console && console.log) {
                    console.log(error.stack);
                }
                return error;
            }
        };

        //storing static types to check against using the jQuery.type() method
        x.type = {};
        x.type.object = 'object';
        x.type.function = 'function';
        x.type.string = 'string';
        x.type.undefined = 'undefined';
        x.type.array = 'array';
        x.type.boolean = 'boolean';

        return x;
    };
    //execute the x factory
    $.x = x();

})(jQuery);
