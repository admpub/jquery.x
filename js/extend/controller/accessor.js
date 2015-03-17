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