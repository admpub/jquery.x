(function ($) {
    "use strict";

    var x = function () {
        var x = {
            _abstractView: {
                _id: false,
                _addExtension: function (extensionId, extension) {
                    this[extensionId] = extension;
                }

            },
            _abstractController: {
                _id: false,
                _addExtension: function (extensionId, extension) {
                    this[extensionId] = extension;
                },
                _dom: function () {
                    return $('[data-x-controller="' + this._id + '"]');
                }
            },
            _addExtension: function (extensionId, extension) {
                this[extensionId] = extension;
            },
            _myController: function (domNode) {
                var controllerNode = $(domNode).parents('[data-x-controller]')[0];
                if (controllerNode) {
                    return controllerNode.attributes['data-x-controller'].value;
                } else {
                    return false;
                }
            },
            _controllers: {},
            extend: {
                x: function (extensionId, extensionFactory) {
                    if ($.type(extensionId) !== $.x.type.string || !extensionId) {
                        return $.x.error('Extension ID must be a string');
                    }
                    if ($.type(extensionFactory) !== $.x.type.function) {
                        return $.x.error('Extension factory must be a function');
                    }
                    $.x._addExtension(extensionId, extensionFactory());
                },
                controller: function (extensionId, extensionFactory) {
                    if ($.type(extensionId) !== $.x.type.string || !extensionId) {
                        return $.x.error('Extension ID must be a string');
                    }
                    if ($.type(extensionFactory) !== $.x.type.function) {
                        return $.x.error('Extension factory must be a function');
                    }
                    $.x._abstractController._addExtension(extensionId, extensionFactory());
                },
                view: function (extensionId, extensionFactory) {
                    if ($.type(extensionId) !== $.x.type.string || !extensionId) {
                        return $.x.error('Extension ID must be a string');
                    }
                    if ($.type(extensionFactory) !== $.x.type.function) {
                        return $.x.error('Extension factory must be a function');
                    }
                    $.x._abstractView._addExtension(extensionId, extensionFactory());
                }
            },
            controller: function (controllerId, initHandler) {
                if (!controllerId) {
                    return this.error('A controller ID is required');
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
                    this._controllers[controllerId] = function (controllerId) {
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

                        //build the viewmodel for the controller
                        controller._view = (function () {
                            var parentController = controller.parent();
                            if (parentController) {
                                return Object.create(parentController._view);
                            } else {
                                return Object.create(x._abstractView);
                            }
                        })();
                        //set the controller id
                        controller._view._id = controllerId;
                        return controller;
                    }(controllerId);
                }

                if (initHandler) {
                    initHandler(this._controllers[controllerId], this._controllers[controllerId]._view);
                    if ($.type(this._controllers[controllerId]._view.apply) === this.type.function) {
                        this._controllers[controllerId]._view.apply();
                    }
                }

                return this._controllers[controllerId];
            },
            isController: function (controllerId) {
                if (this._controllers[controllerId]) {
                    return true;
                }
                return false;
            },
            error: function (message) {
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

(function ($) {
    $(function () {
        $.x.extend.x('_events', function () {
            return {};
        });

        $.x.extend.x('broadcast', function () {
            return function (eventId, param) {
                if ($.type(eventId) !== $.x.type.string || !eventId) {
                    return $.x.error('Event ID must be a string');
                }
                if ($.x._events[eventId]) {
                    $.each($.x._events[eventId], function (i, eventHandler) {
                        eventHandler(param);
                    });
                }
            };
        });

        $.x.extend.x('on', function () {
            return function (eventId, eventHandler) {
                if ($.type(eventId) !== $.x.type.string || !eventId) {
                    return $.x.error('Event ID must be a string');
                }
                if ($.type(eventHandler) !== $.x.type.function) {
                    return $.x.error('Event handler must be a function');
                }
                if (!$.x._events[eventId]) {
                    $.x._events[eventId] = [];
                }
                $.x._events[eventId].push(eventHandler);
                return this;
            };
        });
    });
})(jQuery);

(function ($) {
    $(function () {
        $.x.extend.controller('accessor', function () {
            return function (property, value) {
                if ($.type(property) !== 'string') {
                    return $.x.error('Property must be a string');
                }
                var propertyArray = property.split('.');
                var controller = this;
                //determine if we want to set the value of the accessed property
                if ($.type(value) === $.x.type.undefined) {
                    $.each(propertyArray, function (i, prop) {
                        if (prop === 'parent()') {
                            if (typeof controller.parent === 'function') {
                                controller = controller.parent();
                            } else {
                                return false;
                            }
                        } else if (controller) {
                            controller = (function (viewModel, property) {
                                return viewModel[property];
                            })(controller, prop);
                        } else {
                            return;
                        }
                    });
                    return controller;
                } else {
                    $.each(propertyArray, function (i, prop) {
                        if (prop === 'parent()') {
                            if (typeof controller.parent === 'function') {
                                controller = controller.parent();
                            } else {
                                return false;
                            }
                        } else if (propertyArray.length === i + 1) {
                            controller[prop] = value;
                        } else {
                            if (controller) {
                                controller = (function () {
                                    if (!controller[prop]) {
                                        controller[prop] = {};
                                    }
                                    if ($.type(controller[prop]) !== $.x.type.object && $.type(controller[prop]) !== $.x.type.array) {
                                        return false;
                                    }
                                    return controller[prop];
                                })();
                            }
                        }
                    });
                    if (!controller) {
                        return false;
                    }
                    return this;
                }
                return;
            };
        });
    });
})(jQuery);
(function ($) {
    $(function () {
        $.x.extend.controller('children', function () {
            return function () {
                var controller = this;
                var allChildrenDom = controller._dom().find('[data-x-controller]');
                if (allChildrenDom.length > 0) {
                    var childrenControllers = [];
                    allChildrenDom.each(function () {
                        var controllerId = $(this).attr('data-x-controller');
                        var childController = $.x.controller(controllerId);
                        if (childController.parent()._id === controller._id) {
                            childrenControllers.push(childController);
                        }
                    });
                    return childrenControllers;
                } else {
                    return false;
                }
            };
        });
    });
})(jQuery);
(function ($) {
    $(function () {
        $.x.extend.controller('parent', function () {
            return function () {
                var parentControllerObject = Object.getPrototypeOf(this);
                if (parentControllerObject._id) {
                    return parentControllerObject;
                } else {
                    return false;
                }
            };
        });
    });
})(jQuery);
(function ($) {
    $(function () {
        $.x.extend.view('accessor', function () {
            return function (property, value) {
                if ($.type(property) !== 'string') {
                    return $.x.error('Property must be a string');
                }
                var propertyArray = property.split('.');
                var vm = this;
                //determine if we want to set the value of the accessed property
                if ($.type(value) === $.x.type.undefined) {
                    $.each(propertyArray, function (i, prop) {
                        if (prop === 'parent()') {
                            if (typeof vm.parent === 'function') {
                                vm = vm.parent();
                            } else {
                                return false;
                            }
                        } else if (vm) {
                            vm = (function (viewModel, property) {
                                return viewModel[property];
                            })(vm, prop);
                        } else {
                            return;
                        }
                    });
                    return vm;
                } else {
                    $.each(propertyArray, function (i, prop) {
                        if (prop === 'parent()') {
                            if (typeof vm.parent === 'function') {
                                vm = vm.parent();
                            } else {
                                return false;
                            }
                        } else if (propertyArray.length === i + 1) {
                            vm[prop] = value;
                        } else {
                            if (vm) {
                                vm = (function () {
                                    if (!vm[prop]) {
                                        vm[prop] = {};
                                    }
                                    if ($.type(vm[prop]) !== $.x.type.object && $.type(vm[prop]) !== $.x.type.array) {
                                        return false;
                                    }
                                    return vm[prop];
                                })();
                            }
                        }
                    });
                    if (!vm) {
                        return false;
                    }
                    return this;
                }
                return;
            };
        });
    });
})(jQuery);
(function ($) {
    $(function () {
        $.x.extend.view('node', function () {
            return function (nodeName) {
                var controller = $.x.controller(this._id);
                if ($.type(nodeName) !== $.x.type.undefined) {
                    return controller._dom().find('[data-x-node="' + nodeName + '"]');
                } else {
                    return controller._dom();
                }
            };
        });
    });
})(jQuery);
(function ($) {
    $(function () {
        $.x.extend.view('parent', function () {
            return function () {
                return Object.getPrototypeOf(this);
            };
        });
    });
})(jQuery);
(function ($) {
    $(function () {
        $.x.aspect('x', function (element, attributes) {
            if (attributes.dataClick) {
                var method = attributes.dataClick;
                var node = element[0];
                var attrs = attributes;
                element.on('click.x', function (e) {
                    var controller = $.x.controller($.x._myController(node));
                    var callMethod = controller.accessor(method);
                    if ($.type(callMethod) === $.x.type.function) {
                        callMethod(e, element, attrs);
                    }
                });
            }
        });
    });
})(jQuery);