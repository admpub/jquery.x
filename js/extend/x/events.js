(function ($) {
    $(function () {
        $.x.extend.x('_events', function () {
            return {};
        });

        $.x.extend.x('broadcast', function () {
            return function (eventId, param) {
                if ($.type(eventId) !== $.x.type.string || !eventId) {
                    return $.x.error('Event ID must be a string');
                }
                if ($.x._events[eventId]) {
                    $.each($.x._events[eventId], function (i, eventHandler) {
                        eventHandler(param);
                    });
                }
            };
        });

        $.x.extend.x('on', function () {
            return function (eventId, eventHandler) {
                if ($.type(eventId) !== $.x.type.string || !eventId) {
                    return $.x.error('Event ID must be a string');
                }
                if ($.type(eventHandler) !== $.x.type.function) {
                    return $.x.error('Event handler must be a function');
                }
                if (!$.x._events[eventId]) {
                    $.x._events[eventId] = [];
                }
                $.x._events[eventId].push(eventHandler);
                return this;
            };
        });
    });
})(jQuery);
