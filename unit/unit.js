(function (qunit, $) {
    $(function () {
        /*
         * $.x.extend.x() Extends the jqX object.
         */
        qunit.test('$.x.extend.x(extensionName, extensionHandler)', function (assert) {
            assert.ok($.x.extend.x() instanceof Error, 'Empty Extension Name Check');
            assert.ok($.x.extend.x('test') instanceof Error, 'Empty Extension Handler Check');
            $.x.extend.x('test', function () {
                return {
                    test: 'test'
                };
            });
            assert.ok($.type($.x.test) === $.x.type.object && $.x.test.test === 'test', 'Extension Gets Applied Correctly to Page Object Check');
            $.x.extend.x('test1', function () {
                return function () {
                    assert.equal(this, $.x, 'This Keywork In Context Of Page Check');
                };
            });
            $.x.test1();
        });

        /*
         * $.x.extend.controller() Extends the page object.
         */
        qunit.test('$.x.extend.controller(extensionName, extensionHandler)', function (assert) {
            assert.ok($.x.extend.controller() instanceof Error, 'Empty Extension Name Check');
            assert.ok($.x.extend.controller('test') instanceof Error, 'Empty Extension Handler Check');
            $.x.extend.controller('test', function () {
                return {
                    test: 'test'
                };
            });
            var controller = $.x.controller('element1Node');
            assert.ok($.type(controller.test) === $.x.type.object && controller.test.test === 'test', 'Extension Gets Applied Correctly to Controller Object Check');
            $.x.extend.controller('test1', function () {
                return function () {
                    assert.equal(this, controller, 'This Keywork In Context Of Controller Check');
                };
            });
            controller.test1();
        });

        /*
         * $.x.extend.view() Extends the page object.
         */
        qunit.test('$.x.extend.view(extensionName, extensionHandler)', function (assert) {
            assert.ok($.x.extend.view() instanceof Error, 'Empty Extension Name Check');
            assert.ok($.x.extend.view('test') instanceof Error, 'Empty Extension Handler Check');
            $.x.extend.view('test', function () {
                return {
                    test: 'test'
                };
            });
            var view = $.x.controller('element1Node')._view;
            assert.ok($.type(view.test) === $.x.type.object && view.test.test === 'test', 'Extension Gets Applied Correctly to View Object Check');
            $.x.extend.view('test1', function () {
                return function () {
                    assert.equal(this, view, 'This Keywork In Context Of View Check');
                };
            });
            view.test1();
        });

        /*
         * $.x.extend.apply() Extends the page object.
         */
        qunit.test('$.x.extend.apply(applyFunction)', function (assert) {
            assert.ok($.x.extend.apply() instanceof Error, 'Empty Extension Name Check');
            $.x.extend.apply(function () {
                return 'passed';
            });
            assert.ok($.x._abstractView._apply[$.x._abstractView._apply.length - 1] && $.x._abstractView._apply[$.x._abstractView._apply.length - 1]() === 'passed', 'Apply Extensions Applied Correctly Check');
        });

        /*
         * $.x.extend.apply(applyAfterUpdate, applyFunction) Extends the page object.
         */
        qunit.test('$.x.extend.apply(applyBeforeUpdate, applyFunction)', function (assert) {
            assert.ok($.x.extend.apply() instanceof Error, 'Empty Extension Name Check');
            $.x.extend.apply(true, function () {
                return 'passed';
            });
            assert.ok($.x._abstractView._applyBefore[$.x._abstractView._applyBefore.length - 1] && $.x._abstractView._applyBefore[$.x._abstractView._applyBefore.length - 1]() === 'passed', 'Apply Extensions Applied Correctly Check');
        });

        /*
         * $.x.controller() creates a controller and returns it
         */
        qunit.test('$.x.controller(controllerId, initHandler)', function (assert) {
            assert.ok($.x.controller() instanceof Error, 'Empty Controller ID Check');
            assert.ok($.x.controller('NoController') instanceof Error, 'No DOM data-x-controller Declaration Check');
            var validController = $.x.controller('element1Node');
            assert.equal(Object.getPrototypeOf(validController), validController.parent(), 'Valid Controller Created From Parent Controller');
            assert.ok(validController._view, 'View Created On Controller');
            assert.equal(Object.getPrototypeOf(validController._view)._id, 'parentNode', 'View is Prototype of Parent View');
        });

        /*
         * $.x.isController(controllerId) Determines if a controller by the name of controllerId Exists
         */

        qunit.test('$.x.isController(controllerId)', function (assert) {
            assert.ok($.x.isController() === false, 'Empty Controller ID Check');
            assert.ok($.x.isController('fakeController') === false, 'Fake Controller Check');
            $.x.controller('element1Node');
            assert.ok($.x.isController('element1Node') === true, 'Real Controller Check');
        });

        /*
         * $.x._myController(domNode) Gives the id of the controller the domNode belongs to
         */
        qunit.test('$.x._myController(domNode)', function (assert) {
            assert.ok($.x._myController($('#selector1')[0]) === 'element1Node', 'Node With Proper Controller Check');
            assert.ok($.x._myController($('#tests')[0]) === false, 'No Controller Node Check');
        });

        /*
         * $.x.error() Throws an error and debugs in the console
         */
        qunit.test('$.x.error(message)', function (assert) {
            assert.ok($.x.error() instanceof Error, 'Throws Error Check');
        });

        /*
         * $.x.on() registers events listeners to the page object
         */

        qunit.test('$.x.on(eventId, eventHandler)', function (assert) {
            assert.ok($.x.on() instanceof Error, 'Empty EventID Error Check');
            assert.ok($.x.on('test') instanceof Error, 'Event Handler Error Check');
            $.x.on('test', function () {
                //empty
            });
            assert.ok($.x._events.test, 'Event Registered Properly');
        });

        /*
         * $.x.broadcast() emits an event that will execute listeners that have been
         * for the event.
         */
        qunit.test('$.x.broadcast(eventId, val)', function (assert) {
            var eventResult;
            assert.ok($.x.broadcast() instanceof Error, 'Empty Event ID Error Check');
            $.x.on('test', function (param) {
                eventResult = param;
            });
            $.x.broadcast('test', 'passed');
            assert.equal(eventResult, 'passed', 'Broadcasted Event Property Check');
        });


        /*
         * $.x.aspect() creates a bundled package to create aspect widgets on the page.
         */
        qunit.test('$.x.aspect(aspectName, initFunction)', function (assert) {
            assert.ok($.x.aspect() instanceof Error, 'Undefined Element Name Check');
            assert.ok($.x.aspect('', function () {
            }) instanceof Error, 'Empty String Element Name Check');
            assert.ok($.x.aspect('test', 'test') instanceof Error, 'initFunction Function Check');
            $.x.aspect('test', function () {
            });
            assert.ok($.type($.x._aspects.test.handler) === $.x.type.function, 'Function Closure Stored Check');
        });

        /*
         * controller._dom() Gets the DOM of the controller
         */
        qunit.test('controller._dom()', function (assert) {
            var controller = $.x.controller('element1Node');
            assert.ok(controller._dom() instanceof $, 'DOM Is Return Check');
        });

        /*
         * controller.update() Defines the update function that will run with the apply loop
         */
        qunit.test('controller.update(updateFunction)', function (assert) {
            var controller = $.x.controller('element1Node');
            controller.update(function () {
                return 'passed';
            });
            assert.ok(controller._update() === 'passed', '_update Function Replaced Properly Check');
        });

        /*
         * controller.children() Gets the children controllers of the controller you call this method on
         */
        qunit.test('controller.children()', function (assert) {
            var controller = $.x.controller('parentNode');
            var children = controller.children();
            var childs = ['element1Node', 'element2Node'];
            $.each(children, function (i, child) {
                assert.ok(child._id = childs[i], 'Found Child: ' + childs[i]);
            });
        });

        /*
         * controller.parent() Gets the parent controller of the selected controller object
         */
        qunit.test('controller.parent()', function (assert) {
            var controller = $.x.controller('element1Node');
            assert.ok(controller.parent()._id === 'parentNode', 'Parent Controller Found');
        });

        /*
         * controller.accessor() Accesses the controller to either set a property or get a property
         */
        qunit.test('controller.accessor(property, value)', function (assert) {
            var controller = $.x.controller('element1Node');
            var view = controller;
            assert.ok(view.accessor({}) instanceof Error, 'Check Error For Non-String as Property');
            view.accessor('unit.test', 'passed');
            assert.ok(view.unit.test === 'passed', 'Property On View Model Set Properly Check');
            assert.ok(view.accessor('unit.test') === 'passed', 'Property On View Model Get Properly Check');
            //check index notation
            view.unit = {
                test: [
                    {test: 1},
                    {test: 2}
                ]
            };
            assert.ok(view.accessor('unit.test.1.test') === 2, 'Accessor Accessed Property of Array');
            view.accessor('unit.test.0.test', 'Updated');
            assert.ok(view.unit.test[0].test === 'Updated', 'Access Updated Property of Array');
            view.accessor('parent().unit.test', 'Passed');
            assert.ok($.x.controller('parentNode').unit.test === 'Passed', 'Accessor Setting Property on Parent View Using parent() Notation');
            assert.ok(view.accessor('parent().unit.test') === 'Passed', 'Acccessor Accessed Property of Parent View');
        });

        /*
         * view.apply() Runs the apply loop to update the view
         */
        qunit.test('view.apply()', function (assert) {
            var applyTest = false;
            $.x.extend.apply(function () {
                applyTest = true;
            });
            var parent = $.x.controller('parentNode');
            var controller1 = $.x.controller('element1Node');
            var controller1UpdateTest = false;
            controller1.update(function () {
                controller1UpdateTest = true;
            });
            var controller2 = $.x.controller('element2Node');
            var controller2UpdateTest = false;
            controller2.update(function () {
                controller2UpdateTest = true;
            });
            parent._view.apply();
            assert.ok(applyTest, 'Apply Ran Properly Check');
            assert.ok(controller1UpdateTest, 'Controller Update Method Ran Properly Check');
            assert.ok(controller1UpdateTest && controller2UpdateTest, 'Children Controllers Update Method Ran Properly Check');
        });

        /*
         * view.accessor() Accesses the view model to either set a property or get a property
         */
        qunit.test('view.accessor(property, value)', function (assert) {
            var controller = $.x.controller('element1Node');
            //set a property on the viewmodel
            var view = controller._view;
            assert.ok(view.accessor({}) instanceof Error, 'Check Error For Non-String as Property');
            view.accessor('unit.test', 'passed');
            assert.ok(view.unit.test === 'passed', 'Property On View Model Set Properly Check');
            assert.ok(view.accessor('unit.test') === 'passed', 'Property On View Model Get Properly Check');
            //check index notation
            view.unit = {
                test: [
                    {test: 1},
                    {test: 2}
                ]
            };
            assert.ok(view.accessor('unit.test.1.test') === 2, 'Accessor Accessed Property of Array');
            view.accessor('unit.test.0.test', 'Updated');
            assert.ok(view.unit.test[0].test === 'Updated', 'Access Updated Property of Array');
            view.accessor('parent().unit.test', 'Passed');
            assert.ok($.x.controller('parentNode')._view.unit.test === 'Passed', 'Accessor Setting Property on Parent View Using parent() Notation');
            assert.ok(view.accessor('parent().unit.test') === 'Passed', 'Acccessor Accessed Property of Parent View');
        });

        /*
         * view.parent() gets the parent view
         */
        qunit.test('view.parent()', function (assert) {
            var controller = $.x.controller('element1Node');
            assert.ok(controller._view.parent()._id === 'parentNode', 'Got Parent View Successfully Check');
        });
    });

})(QUnit, jQuery);
