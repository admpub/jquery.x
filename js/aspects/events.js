(function ($) {
    $(function () {
        $.x.aspect('events', function (object, attributes) {
            if (attributes.dataClick) {
                var method = attributes.dataClick;
                var node = object[0];
                var obj = object;
                var attrs = attributes;
                object.on('click.x', function (e) {
                    var controller = $.x.controller($.x._myController(node));
                    if (controller[method]) {
                        controller[method](e, obj, attrs);
                    }
                });
            }
        });
    });
})(jQuery);