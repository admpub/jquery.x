(function ($) {
    $(function () {
        $.x.extend.x('_aspects', function () {
            return {};
        });

        $.x.extend.x('aspect', function () {
            //$.x.aspect(id,[hasOwnController], initHandler)
            //$.x.aspect(id, initHandler)
            return function (a, b, c) {
                var hasOwnController, aspectName, initHandler;
                if ($.type(b) === $.x.type.boolean) {
                    aspectName = a;
                    hasOwnController = b;
                    initHandler = c;
                } else {
                    aspectName = a;
                    hasOwnController = false;
                    initHandler = b;
                }
                if ($.type(aspectName) !== $.x.type.string || !aspectName) {
                    return this.error('Aspect name must be a string');
                }

                if ($.type(initHandler) !== $.x.type.function) {
                    return this.error('Aspect initHandler must be a function');
                }

                this._aspects[aspectName] = {
                    controller: hasOwnController,
                    handler: initHandler
                };
            };
        });

        $.x.extend.apply(function (controller, view) {
            var getAttributes = function (domNode) {
                var attributes = {};
                $.each(domNode.attributes, function () {
                    if (this.specified) {
                        var property = this.name.replace(/\W+(.)/g, function (x, chr) {
                            return chr.toUpperCase();
                        });
                        attributes[property] = this.value;
                    }
                });
                return attributes;
            };
            //get all of the aspects
            var aspects = controller._dom().find('[data-x-aspect]:not(.x-aspect)');
            if (aspects && aspects.length > 0) {
                var reApply = false;
                $.each(aspects, function (i, aspect) {
                    if ($.x._myController(aspect) === controller._id) {
                        //let the apply loop know that this aspect is already queued up
                        $(aspect).addClass('x-aspect');
                        var aspectNames = $(aspect).attr('data-x-aspect').split(' ');
                        $.each(aspectNames, function (i, aspectName) {
                            //check to see if aspect was defined
                            if (!$.x._aspects[aspectName]) {
                                return $.x.error('The Aspect "' + aspectName + '" is not defined');
                            }

                            //determine if aspect was configured with controller
                            if ($.x._aspects[aspectName].controller) {
                                var aspectControllerId;
                                var aspectController;
                                //make sure there is not already a controller on this aspect.
                                if ($(aspect).attr('data-x-controller')) {
                                    aspectControllerId = $(aspect).attr('data-x-controller');
                                } else {
                                    aspectControllerId = 'E' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                                    $(aspect).attr('data-x-controller', aspectControllerId);
                                }
                                //get the controller
                                aspectController = $.x.controller(aspectControllerId);
                                $.x._aspects[aspectName].handler(aspectController, aspectController._view, $(aspect), getAttributes(aspect));
                            } else {
                                reApply = true;
                                $.x._aspects[aspectName].handler($(aspect), getAttributes(aspect));
                            }
                        });


                    }
                });
                //if aspect is one without a controller we need
                //to run the controller's update function to apply
                //the changes of this addition
                if (reApply) {
                    $.each(controller._view._apply, function (i, applyFunction) {
                        if ($.type(applyFunction) === $.x.type.function) {
                            applyFunction(controller, controller._view);
                        }
                    });
                }
            }
        });
    });
})(jQuery);