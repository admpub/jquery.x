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

## X Overview

jQuery.x is an MVVM library built around 4 basic components. These components work together to provide you with an MVVM design pattern structure for your project code. Remember, MVVM is built on top of MVC so the organization will be very similar for your MVVM projects.

1. **The X Object** - This object is the main object the entire library is built on and contains everything required to track and automate the update of the View when the View Model is updated.
2. **The Controller Object** - This object represents your application's business logic and should only contain code that manipulates your View Model.
3. **The View Object** - This object represents your View Model and acts as the middle layer between the Controller and the View.
4. **The Apply Loop** - This is the most crucial component of the MVVM pattern designed for X. The Apply Loop is a collection of functions that run whenever there is a need to update the update the View. When we run this loop we simply say that we are "applying the changes of the View Model to the View."

## The X Object

## The Controller Object

## The View Object

## The Apply Loop

## Controller's Update Function

## Aspects

## Extending X

## Library API Documentation

##Acknowledgements

This library was the brain child of [Joshua L Johnson](https://github.com/joshualjohnson "Joshua L Johnson"), [Jake Quattrocchi](https://github.com/globaljake "Jake Quattrocchi"), and [Arian Caraballo](https://www.linkedin.com/pub/arian-caraballo/33/3a2/40bhttps://www.linkedin.com/pub/arian-caraballo/33/3a2/40b "Arian Caraballo")

Special thanks to both Jake and Arian for all of the hours of your personal time brain storming critical components of **X**.

## License
MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php "MIT license")
