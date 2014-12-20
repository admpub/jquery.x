(function ($) {
    $(function () {
        $.x.extend.view('parent', function () {
            return function () {
                return Object.getPrototypeOf(this);
            };
        });
    });
})(jQuery);