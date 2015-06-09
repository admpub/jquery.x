**jQuery.x**, or simply **X**, is a natural extension to the jQuery library and was created to bring MVVM (a modern derivation of MVC) to your jQuery projects. At the center of the library lies the Apply Loop (where all the magic happens). The Apply Loop automates the process of having to update the UI when changes are made to the underlying data model.

## Installation
For ease of use, I decided to make jquery.x available through [Bower](http://bower.io "Bower"). To download it simply run: `bower install jquery.x` in your console.

With each release, there will be a prebuilt version of the library that you may use in the `dist` directory. I recommend using `/dist/jquery.x.min.js` for your production environment.

## Requirements
**jQuery** - Works with jQuery versions greater than 1.8.

## Getting Started
To get started with jquery.x it all begins with defining a controller and binding it to a DOM node:

	//jquery and jquery.x must be ready
	$(function(){
		//register a controller
		$.x.controller('HelloWorldController', function(controller, view){
			//empty controller
		});
	})

Next we need to bind our newly defined controller to a DOM node:

	<div data-x-controller="HelloWorldController"></div>

What is so important here about the binding of 'HelloWorldController' controller is that you just set the boundaries of where all of your interactions will happen. No changes to the view should be happening outside of these boundaries.

Now that we have our controller defined and our DOM node bound, lets play with some MVVM magic, add two lines of code to your HTML markup:

	<div data-x-controller="HelloWorldController">
    	<p>Your Name: <input type="text" data-x-model="name" /></p>
    	<p>Hello My Name Is: <span data-x-bind="name"></span></p>
	</div>

[View Results](http://jsfiddle.net/jljLabs/2tqu3bm2/3/)

## Why MVVM?

MVVM is a modern interpretation of your traditional MVC, but with a twist. In a traditional MVC framework, there is typically a middle layer that sits between the Controller and the View called the View Model. In an MVC, the View Model is an object representation of the view that contains dynamic data that will be consumed by the View. This allows you to decouple view logic and business logic. In a traditional MVC, this is known as a one-way binding. MVVM builds on top of the MVC pattern and provides a two-way binding. Which not only allows the Controller to communicate with the View, but the View to communicate to the Controller as well through the View Model, and it is all done automatically! So whenever, say you make a change to the value in the View Model from the Controller, the View will automatically be refreshed to reflect the change. If you make a change to a value in a field in the View, the value in the Controller will automatically be updated. All of this coordination happens through the View Model. If this all sounds like giberish to you, you will need to do some more research on MVC so that you can understand the Binding Concept.

## X vs. AngularJS

X and Angular are very similar in the implementation of MVVM. When we originally started planning the development of X, we tried very hard not to be Angular. Angular is Awesome! We did not want to replicate it, there is no need. The developers who built and maintain Angular are much more advanced than we are. Over the past several years Angular has set the standard in the implementation of the MVVM design pattern in JavaScript. So we decided to make our framework for a different need than what Angular solves. Angular is very powerful and provides a good foundation for enterprise level application development. X, although just as powerful, provides a bare bones foundation and an easier implementation for your projects. We are targeting developers who are most familiar with jQuery and want an easy transition to implement MVVM within their projects.

X differs from Angular in many distinct ways:

* **No Dependency Injection** Although this is one of the best Design Patterns for developing very large enterprise applications, we decided not to include it within X because we are not targeting large enterprise application development.
* **Clearer Separation of View and Controller** The Controller in Angular is merely a definition and not so an object. So you cannot add methods to it. Instead, you are forced to add methods to your View Model. Your View Model is then responsible for both State and Business Logic. X has solved this problem by providing a Controller object separate from a View object directly in the controller definition.
* **DOM Manipulation Based MVVM** Angular provides View updates through the use of template logi,c defined within Directives, in the template. X has provided a way to define DOM Manipulation logic within the Apply Loop for each Controller separately. Each controller has an Update Function that runs when the Apply Loop is invoked where all of your DOM Manipulation will happen based on your View Model state.
* **Easier Library Extensions** Angular has made a way to extend the library through Service Providers and Dependency Injection. Extending Angular can become very difficult to understand because of the number of options they provide as you extend the library. You can extend Angular with a Service, Provider, Factory, Filter, etc. There are a number of blog posts out there to try and help you define which to use and why. X provides you direct access to extend the four primary components with one configuration interface.
* **The Plugin** Angular provides you with the ability to "extend the functionality of HTML" through the use of Directives. Directives, however, again are very difficult to implement. There are so many possible configurations, it becomes difficult to understand. X Plugins are very similar to Angular Directives except there is only on two possible configurations available. A configuration that wraps the DOM in a dynamic Controller and one that does not use a controller definition.

## X Overview

jQuery.x is an MVVM library built around 4 basic components. These components work together to provide you with an MVVM design pattern structure for your project code. Remember, MVVM is built on top of MVC so the organization will be very similar for your MVVM projects.

1. **The X Object** - This object is the main object the entire library is built on and contains everything required to track and automate the update of the View when the View Model is updated.
2. **The Controller Object** - This object represents your application's business logic and should only contain code that manipulates your View Model.
3. **The View Object** - This object represents your View Model and acts as the middle layer between the Controller and the View.
4. **The Apply Loop** - This is the most crucial component of the MVVM pattern designed for X. The Apply Loop is a collection of functions that run whenever there is a need to update the update the View. When we run this loop we simply say that we are "applying the changes of the View Model to the View."

## The X Object

The X Object is where it all begins. X is responsible for providing MVVM to your jQuery project. After you include the jQuery.x library into your project it becomes a part of jQuery and is available through:

	jQuery.x

or

	$.x

You will mostly use this object to register and define your application components. Like your Controllers, Plugins, and Custom Events.

	//register a Controller
	$.x.controller('controllerId', function(controller, view){});
	//register an plugin
	$.x.plugin('pluginId', function(element, attributes){});
	//register an event
	$.x.on('eventId', function(eventObj){});
	//trigger an event
	$.x.broadcast('eventId');

## The Controller Object

**Purpose and Use**

The Controller is where all of the business logic exists. You will use the controller to wrap all of your application specific interactions. A Controller in X binds your view to a specific region of the DOM. To register a controller you need to define a controller definition:

	$.x.controller('controllerId', function(controller, view){});

The definition above defines an empty controller. Notice that when you define a controller, you get back the `controller` and `view` objects in your controller definition constructor. These two objects gives you direct access to the both the Controller and the View Model.

Once you have a controller definition, you need to bind it to the view using the attribute `data-x-controller="controllerId"`.

Now that you have the Controller bound to the View you should use the controller to manage your View by changing data in your View Model only. You should never directly manipulate the View within the controller unless it is done within your Controller's `update` method.

**Controller Prototype Inheritance**

Each Controller created inherits its root properties from a base abstract controller object that lives in `$.x._abstractController`. For the following example, we will take a look at a single controller instance:

	<div data-x-controller="controller1"></div>

In the example above the controller we have defined inherits from the abstractController `$.x._abstractController`:

	controller1 inherits from $.x._abstractController

Controllers can also be nested. Below is an example of how nested controllers inherit from one another:

	<div data-x-controller="parentController">
		<div data-x-controller="childController"></div>
	</div>

In an instance where you have controllers that are nested, child controllers will inherit the properties of a parent controller:

	childController inherits from parentController
	parentController inherits from $.x._abstractController

## The View Object

**Purpose and Use**

The View Object, also known as the View Model, is meant to maintain the "state" of the view. When we describe state, we are talking about storing all of the data that makes up the view. For example, if we want to hide and show an element in the view, we can represent its hide/show state with a true and false property on the View Object.

A View Object is created when a Controller is created. In other words, every Controller has a View.

**View Prototype Inheritance**

Just like a Controller, each View Object created inherits its root properties from an abstract view object that lives in `$.x._abstractView`.

Also just like a Controller, if a View is nested within another View, the child View Object will inherit its properties from its parent View Object.

## The Apply Loop

## Controller's Update Function

## Plugins

## Custom Events

## Extending X

## Library View Attributes

* **data-x-controller** - This attribute is used to bind a controller to its definition. As a value it is expected the ID of the controller definition you want to bind the DOM node to.

		<div data-x-controller="controllerId"></div>

* **data-x-bind** - This attribute is used to bind the value of a property in a View Object to the view itself. As a value it is expecting the dot-notation path to the property you want to bind it to.

		<span data-x-bind="path.to.property"></span>

## Library API Documentation

##Acknowledgements

This library was the brain child of [Joshua L Johnson](https://github.com/joshualjohnson "Joshua L Johnson"), [Jake Quattrocchi](https://github.com/globaljake "Jake Quattrocchi"), and [Arian Caraballo](https://www.linkedin.com/pub/arian-caraballo/33/3a2/40bhttps://www.linkedin.com/pub/arian-caraballo/33/3a2/40b "Arian Caraballo")

Special thanks to both Jake and Arian for all of the hours of your personal time brain storming critical components of **X**.

## License
MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php "MIT license")
