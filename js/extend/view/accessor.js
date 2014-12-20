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