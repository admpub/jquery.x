(function ($) {
    $(function () {
        $.x.extend.controller('children', function () {
            return function () {
                var controller = this;
                var view = this._view;
                var allChildrenDom = view.$().find('[data-x-controller]');
                if (allChildrenDom.length > 0) {
                    var childrenControllers = [];
                    allChildrenDom.each(function () {
                        var controllerId = $(this).attr('data-x-controller');
                        var childController = $.x.controller(controllerId);
                        if (childController.parent()._id === controller._id) {
                            childrenControllers.push(childController);
                        }
                    });
                    return childrenControllers;
                } else {
                    return false;
                }
            };
        });
    });
})(jQuery);
