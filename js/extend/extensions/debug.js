/*
 * This plugin is reponsible for adding debugging features to jQuery.X
 */
(function ($) {
    $(function () {
        $.x.extend.x('_debug', function () {
            return false;
        });

        $.x.extend.x('debug', function () {
            function display(consoles, pause) {
                if (console && console.clear) {
                    console.clear();
                }
                if (console && console.log) {
                    $.each(consoles, function (i, output) {
                        setTimeout(function () {
                            console.log(output);
                        }, pause * (i + 1));
                    });
                    setTimeout(function () {
                        console.debug('Debugging Started Successfully!!');
                        $.x._debug = true;
                    }, pause * (consoles.length + 1));
                }
            }

            return function () {
                var consoles = [];

                //show debugging message
                var debugMessage = '\n' +
                        '                ██╗  ██╗    ██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗\n' +
                        '                ╚██╗██╔╝    ██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝\n' +
                        '█████╗█████╗     ╚███╔╝     ██║  ██║█████╗  ██████╔╝██║   ██║██║  ███╗    █████╗█████╗\n' +
                        '╚════╝╚════╝     ██╔██╗     ██║  ██║██╔══╝  ██╔══██╗██║   ██║██║   ██║    ╚════╝╚════╝ \n' +
                        '                ██╔╝ ██╗    ██████╔╝███████╗██████╔╝╚██████╔╝╚██████╔╝ \n' +
                        '                ╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═════╝  ╚═════╝  ╚═════╝';

                consoles.push(debugMessage);

                //check uninitialized controllers
                var notControllers = [];
                $('[data-x-controller]').each(function () {
                    var controllerId = $(this).attr('data-x-controller');
                    if (!$.x._controllers[controllerId]) {
                        notControllers.push(controllerId);
                    }
                });
                if (notControllers.length > 0) {
                    consoles.push('----------------UNINITIALIZED CONTROLLERS----------------\n' + notControllers.join('\n'));
                }

                //display out errors
                if ($.x._errors.length > 0) {
                    consoles.push('----------------------ERROR LOG--------------------------\n' + $.x._errors.join('\n'));
                }
                display(consoles, 0);
                return 'Starting X Debug...';
            };
        });

        $.x.extend.apply(true, function (controller) {
            if ($.x._debug && window.console && console.log) {
                console.log('---------------"' + controller._id + '" CONTROLLER UPDATED----------------------');
                console.log(controller);
            }
        });
    });
})(jQuery);