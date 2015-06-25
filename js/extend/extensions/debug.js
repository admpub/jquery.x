/*
 * This plugin is reponsible for adding debugging features to jQuery.X
 */
(function ($) {
    $(function () {
        //create function for turning on debugging
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
                        if (!$.x._debug) {
                            console.debug('Debugging Started Successfully!!');
                            $.x._debug = true;
                        }
                    }, pause * (consoles.length + 1));
                }
            }

            var debug = function () {
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
                    consoles.push('================UNINITIALIZED CONTROLLERS================\n' + notControllers.join('\n'));
                }

                //display out errors
                var errorLog = '';
                if ($.x._errors.length > 0) {
                    $.each($.x._errors, function (i, error) {
                        errorLog += '[' + i + '] - ' + error.timestamp + ' - ' + error.message + '\n';
                    });
                    consoles.push('======================ERROR LOG==========================\n' + errorLog);
                }
                display(consoles, 0);
                return 'Starting X Debug...';
            };

            debug.error = function (index) {
                if (index) {
                    return $.x._errors[index].error.stack;
                }
                return $.x._errors;
            };

            return debug;
        });

        $.x.extend.apply(true, function (controller) {
            if ($.x._debug && window.console && console.log) {
                console.log('---------------"' + controller._id + '" CONTROLLER UPDATED----------------------');
                console.log(controller);
            }
        });
    });
})(jQuery);