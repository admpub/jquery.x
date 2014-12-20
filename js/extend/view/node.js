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