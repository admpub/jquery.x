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