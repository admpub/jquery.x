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
                        '           _  _      ___  ____  ____ __   ___\n' +
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
        /*
         * Extend the controller object to add the update functionality
         */
        $.x.extend.controller('_update', function () {
            return function () {
                return;
            };
        });

        $.x.extend.controller('update', function () {
            return function (updateHandler) {
                this._update = updateHandler;
            };
        });

        /*
         * Extend the view object to add apply loop capabilities
         */
        $.x.extend.view('_apply', function () {
            return [];
        });

        $.x.extend.view('apply', function () {
            return function () {
                var controller = $.x.controller(this._id);
                controller._update();
                $.each(this._apply, function (i, applyFunction) {
                    if ($.type(applyFunction) === $.x.type.function) {
                        applyFunction(controller, controller._view);
                    }
                });

                var childrenControllers = controller.children();
                if (childrenControllers) {
                    $.each(childrenControllers, function (i, childController) {
                        childController._view.apply();
                    });
                }
            };
        });

        /*
         * Add the ability to extend the apply loop
         */
        $.x.extend.apply = function (applyFunction) {
            if ($.type(applyFunction) !== $.x.type.function) {
                return $.x.error('Apply function must be a function');
            }

            $.x._abstractView._apply.push(applyFunction);
        };


        /*
         * Extended x to handle filter registration
         */
        $.x.extend.x('_filters', function () {
            return {};
        });

        $.x.extend.x('filter', function () {
            return function (filterName, filterHandler) {
                if ($.type(filterName) !== $.x.type.string || !filterName) {
                    $.x.error('Filter name must be a string');
                }
                if ($.type(filterHandler) !== $.x.type.function) {
                    $.x.error('Filter handler must be a function');
                }

                this._filters[filterName] = filterHandler;
            };
        });

        /**
         * Extend the controller to manage keep track of its bindings.
         */
        $.x.extend.controller('_binds', function () {
            return function () {
                var controller = this;
                var binds = new $();
                controller._dom().find('[data-x-bind], [data-x-model]').each(function () {
                    var bindElem = this;
                    if ($.x._myController(bindElem) === controller._id) {
                        binds.push(bindElem);
                    }
                });
                return binds;
            };
        });

        $.x.extend.controller('_models', function () {
            return function () {
                var controller = this;
                var models = new $();
                controller._dom().find('[data-x-model]:not(.x-mvvm)').each(function () {
                    var modelElem = this;
                    if ($.x._myController(modelElem) === controller._id) {
                        models.push(modelElem);
                    }
                });
                return models;
            };
        });

        /*
         * Extend Apply to manage bindings
         */
        $.x.extend.apply(function (controller, view) {
            var models = controller._models();
            if (models.length > 0) {
                models.on('change.x keyup.x', function () {
                    if (this.tagName === 'INPUT' && (this.type === 'text' || this.type === 'password')) {
                        if ($(this).data('val') !== this.value) {
                            view.accessor($(this).attr('data-x-model'), this.value);
                            view.apply();
                        }
                        $(this).data('val', this.value);
                    } else {
                        var bindValue;
                        if (this.tagName === 'INPUT' && this.type === 'checkbox') {
                            bindValue = this.checked;
                        } else {
                            bindValue = this.value;
                        }
                        view.accessor($(this).attr('data-x-model'), bindValue);
                        view.apply();
                    }

                });
                models.addClass('x-mvvm');
            }
            //apply bindings values
            controller._binds().each(function () {
                var binding = this;
                //get the element
                var elem = $(binding);
                //find out what type of element we are trying to set
                var elemType = binding.tagName;
                //get the property of the viewModel
                var bindProp = (elem.attr('data-x-bind')) ? elem.attr('data-x-bind') : elem.attr('data-x-model');
                //get the value of the property of the viewModel
                var bindValue;
                var bindVal = view.accessor(bindProp);
                if (elem.attr('data-x-filter') && $.type($.x._filters[elem.attr('data-x-filter')]) === $.x.type.function && !elem.attr('data-x-model')) {
                    bindValue = $.x._filters[elem.attr('data-x-filter')](bindVal);
                } else {
                    bindValue = bindVal;
                }
                //set the value of the binding
                if (!elem.is(':focus')) {
                    switch (elemType) {
                        case 'INPUT':
                            if (elem.attr('type') === 'radio') {
                                if (elem.val() === bindValue) {
                                    elem.prop('checked', true);
                                } else {
                                    elem.prop('checked', false);
                                }
                            } else if (elem.attr('type') === 'checkbox') {
                                if (bindValue) {
                                    elem.prop('checked', true);
                                } else {
                                    elem.prop('checked', false);
                                }
                            } else {
                                elem.val(bindValue);
                            }
                            break;
                        case 'SELECT':
                            elem.val(bindValue);
                            break;
                        case 'TEXTAREA':
                            elem.val(bindValue);
                            break;
                        default:
                            elem.html(bindValue);
                            break;
                    }
                }
            });
        });
    });
})(jQuery);
(function ($) {
    $(function () {
        $.x.extend.x('_aspects', function () {
            return {};
        });

        $.x.extend.x('aspect', function () {
            //$.x.aspect(id,[hasOwnController], initHandler)
            //$.x.aspect(id, initHandler)
            return function (a, b, c) {
                var hasOwnController, aspectName, initHandler;
                if ($.type(b) === $.x.type.boolean) {
                    aspectName = a;
                    hasOwnController = b;
                    initHandler = c;
                } else {
                    aspectName = a;
                    hasOwnController = false;
                    initHandler = b;
                }
                if ($.type(aspectName) !== $.x.type.string || !aspectName) {
                    return this.error('Aspect name must be a string');
                }

                if ($.type(initHandler) !== $.x.type.function) {
                    return this.error('Aspect initHandler must be a function');
                }

                this._aspects[aspectName] = {
                    controller: hasOwnController,
                    handler: initHandler
                };
            };
        });

        $.x.extend.apply(function (controller, view) {
            var getAttributes = function (domNode) {
                var attributes = {};
                $.each(domNode.attributes, function () {
                    if (this.specified) {
                        var property = this.name.replace(/\W+(.)/g, function (x, chr) {
                            return chr.toUpperCase();
                        });
                        attributes[property] = this.value;
                    }
                });
                return attributes;
            };
            //get all of the aspects
            var aspects = controller._dom().find('[data-x-aspect]:not(.x-aspect)');
            if (aspects && aspects.length > 0) {
                var reApply = false;
                $.each(aspects, function (i, aspect) {
                    if ($.x._myController(aspect) === controller._id) {
                        //let the apply loop know that this aspect is already queued up
                        $(aspect).addClass('x-aspect');
                        var aspectNames = $(aspect).attr('data-x-aspect').split(' ');
                        $.each(aspectNames, function (i, aspectName) {
                            //check to see if aspect was defined
                            if (!$.x._aspects[aspectName]) {
                                return $.x.error('The Aspect "' + aspectName + '" is not defined');
                            }

                            //determine if aspect was configured with controller
                            if ($.x._aspects[aspectName].controller) {
                                var aspectControllerId;
                                var aspectController;
                                //make sure there is not already a controller on this aspect.
                                if ($(aspect).attr('data-x-controller')) {
                                    aspectControllerId = $(aspect).attr('data-x-controller');
                                } else {
                                    aspectControllerId = 'E' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                                    $(aspect).attr('data-x-controller', aspectControllerId);
                                }
                                //get the controller
                                aspectController = $.x.controller(aspectControllerId);
                                $.x._aspects[aspectName].handler(aspectController, aspectController._view, $(aspect), getAttributes(aspect));
                            } else {
                                reApply = true;
                                $.x._aspects[aspectName].handler($(aspect), getAttributes(aspect));
                            }
                        });


                    }
                });
                //if aspect is one without a controller we need
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