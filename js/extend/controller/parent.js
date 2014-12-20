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