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