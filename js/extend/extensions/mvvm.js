(function($) {
    $(function() {
        /*
         * Extend the controller object to add the update functionality
         */
        $.x.extend.controller('_update', function() {
            return false;
        });

        $.x.extend.controller('update', function() {
            return function(updateHandler) {
                if (!this._update) {
                    this._update = [];
                }
                this._update.push(updateHandler);
            };
        });

        $.x.extend.controller('_applyBefore', function() {
            return [];
        });

        $.x.extend.controller('_apply', function() {
            return [];
        });

        $.x.extend.controller('apply', function() {
            return function() {
                var controller = this;
                //runt apply before functions
                $.each(this._applyBefore, function(i, applyFunction) {
                    if ($.type(applyFunction) === $.x.type.function) {
                        applyFunction(controller);
                    }
                });
                //run all update functions for this controller
                if (this._update) {
                    $.each(this._update, function(i, updateFunction) {
                        if ($.type(updateFunction) === $.x.type.function) {
                            updateFunction(controller);
                        }
                    });
                }
                //run apply functions
                $.each(this._apply, function(i, applyFunction) {
                    if ($.type(applyFunction) === $.x.type.function) {
                        applyFunction(controller);
                    }
                });

                var childrenControllers = this.children();
                if (childrenControllers) {
                    $.each(childrenControllers, function(i, childController) {
                        childController.apply();
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
                $.x._abstractController._applyBefore.push(applyFunction);
            } else {
                $.x._abstractController._apply.push(applyFunction);
            }
        };

        /**
         * Extend the controller to manage keep track of its bindings.
         */
        $.x.extend.controller('_binds', function() {
            return function() {
                var binds = new $();
                var controller = this;
                this.$().find('[data-x-bind]:not(.x-mvvm)').each(function() {
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
        $.x.extend.apply(function(controller) {
            var binds = controller._binds();
            if (binds.length > 0) {
                binds.on('change.x keyup.x', function() {
                    if (this.tagName === 'INPUT' && (this.type === 'text' || this.type === 'password')) {
                        if ($(this).data('val') !== this.value) {
                            controller.accessor($(this).attr('data-x-bind'), this.value);
                            controller.apply();
                        }
                        $(this).data('val', this.value);
                    } else {
                        var bindValue;
                        if (this.tagName === 'INPUT' && this.type === 'checkbox') {
                            bindValue = this.checked;
                        } else {
                            bindValue = this.value;
                        }
                        controller.accessor($(this).attr('data-x-bind'), bindValue);
                        controller.apply();
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
                //get the value of the property of the controller
                var bindValue = controller.accessor(elem.attr('data-x-bind'));
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
