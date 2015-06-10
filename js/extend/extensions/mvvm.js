(function($) {
    $(function() {
        /*
         * Extend the controller object to add the update functionality
         */
        $.x.extend.controller('_update', function() {
            return function() {
                return;
            };
        });

        $.x.extend.controller('update', function() {
            return function(updateHandler) {
                this._update = updateHandler;
            };
        });

        /*
         * Extend the view object to add apply loop capabilities
         */
        $.x.extend.view('_applyBefore', function() {
            return [];
        });

        $.x.extend.view('_apply', function() {
            return [];
        });

        $.x.extend.view('apply', function() {
            return function() {
                var controller = $.x.controller(this._id);
                $.each(this._applyBefore, function(i, applyFunction) {
                    if ($.type(applyFunction) === $.x.type.function) {
                        applyFunction(controller, controller._view);
                    }
                });
                controller._update();
                $.each(this._apply, function(i, applyFunction) {
                    if ($.type(applyFunction) === $.x.type.function) {
                        applyFunction(controller, controller._view);
                    }
                });

                var childrenControllers = controller.children();
                if (childrenControllers) {
                    $.each(childrenControllers, function(i, childController) {
                        childController._view.apply();
                    });
                }
            };
        });

        /*
         * Add the ability to extend the apply loop
         * $.x.extend.apply([applyBeforeUpdate], applyFunction);
         * $.x.extend.apply(applyFunction);
         */
        $.x.extend.apply = function(a, b) {
            var applyBeforeUpdate, applyFunction;
            if ($.type(a) === $.x.type.boolean) {
                applyBeforeUpdate = a;
                applyFunction = b;
            } else {
                applyBeforeUpdate = false;
                applyFunction = a;
            }

            if ($.type(applyFunction) !== $.x.type.function) {
                return $.x.error('Apply function must be a function');
            }

            if (applyBeforeUpdate) {
                $.x._abstractView._applyBefore.push(applyFunction);
            } else {
                $.x._abstractView._apply.push(applyFunction);
            }
        };

        /**
         * Extend the controller to manage keep track of its bindings.
         */
        $.x.extend.controller('_binds', function() {
            return function() {
                var controller = this;
                var view = this._view;
                var binds = new $();
                view.$().find('[data-x-bind]').each(function() {
                    var bindElem = this;
                    if ($.x._myController(bindElem) === controller._id) {
                        binds.push(bindElem);
                    }
                });
                return binds;
            };
        });

        /*
         * Extend Apply to manage bindings
         */
        $.x.extend.apply(function(controller, view) {
            var binds = controller._binds();
            if (binds.length > 0) {
                binds.on('change.x keyup.x', function() {
                    if (this.tagName === 'INPUT' && (this.type === 'text' || this.type === 'password')) {
                        if ($(this).data('val') !== this.value) {
                            view.accessor($(this).attr('data-x-bind'), this.value);
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
                        view.accessor($(this).attr('data-x-bind'), bindValue);
                        view.apply();
                    }

                });
                binds.addClass('x-mvvm');
            }
            //apply bindings values
            controller._binds().each(function() {
                var binding = this;
                //get the element
                var elem = $(binding);
                //find out what type of element we are trying to set
                var elemType = binding.tagName;
                //get the value of the property of the viewModel
                var bindValue = view.accessor(elem.attr('data-x-bind'));
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
