			window.$on = function(target, type, cb) {
				target.addEventListener(type, cb, false);
			}

var CORE = (function() {
	"use strict";
	var modules = {};

	function addModule(module_id, module) {
		modules[module_id] = module;
	}

	function registerEvents(evt, module_id) {
		var theMod = modules[module_id];
		theMod.events = evt;
	}

	function triggerEvents(evt) {
		var mod;

		for(mod in modules) {
			if(modules.hasOwnProperty(mod)) {
				mod = modules[mod];

				if(mod.events && mod.events[evt.type]) {
					mod.events[evt.type] (evt.data)
				}
			}
		}
	}

	return {
		addModule: addModule,
		registerEvents: registerEvents,
		triggerEvents: triggerEvents
	}
})();

var sb = (function(){
	function listen(evt, module_id) {
		CORE.registerEvents(evt, module_id)
	}
	function notify(evt) {
		CORE.triggerEvents(evt)
	}
	return {
		
		listen: listen,
		notify: notify
	}
})();

var celsius = (function(){
	var id, _celsuis, form, submit;

	id="converter";

	function init() {
	   form = document.getElementById("converter");
	   _celsuis = form.getElementsByClassName("celsius")[0];
	   submit = form.getElementsByClassName("submit")[0];

	   $on(submit, "click", convertToFahrenheit);

	   sb.listen({"toCelsuis":displayCelsius}, id);
	}

	function displayCelsius(toCelsuis) {
		_celsuis.value = fahren;
	}

	function toFahrenheit(celsius) {
		return ((celsius * 9/5) + (32))
	}

	function convertToFahrenheit(e) {
		var temperature;
		temperature = _celsuis.value;
		cels = toFahrenheit(temperature)
		console.log(cels);
		sb.notify({
			type: "toFahrenheit",
			data: cels
		});

		e.preventDefault();
	}

	return{

		id:id,
		init:init,
		convertToFahrenheit: convertToFahrenheit,
		displayCelsius: displayCelsius
	}


})();


var fahrenheit = (function() {
	var id, form, _fahrenheit, submit2;

	id = "converter";
	
	function init() {

		form = document.getElementById("converter");
		_fahrenheit = form.getElementsByClassName("fahrenheit")[0];
		submit2 = form.getElementsByClassName("submit2")[0];


		sb.listen({"toFahrenheit":displayFahrenheit}, id);

		$on(submit2, "click", convertToCelsuis) 

}

function displayFahrenheit(toFahrenheit) {
	_fahrenheit.value = cels;
}

function toCelsuis(fahrenheit) {
	return ((fahrenheit - 32) * (5/9))
}

function convertToCelsuis(e) {
	var temperature;

	temperature = _fahrenheit.value;
	console.log(temperature)

	fahren = toCelsuis(temperature)

	console.log(fahren)

	sb.notify({
		type: "toCelsuis",
		data: fahren
	});

		e.preventDefault();
	}

	return {
		id:id,
		init:init,
		displayFahrenheit:displayFahrenheit,
		convertToCelsuis:convertToCelsuis
	}
})();

	CORE.addModule(celsius.id, celsius);
	CORE.addModule(fahrenheit.id, fahrenheit);

	celsius.init();
	fahrenheit.init();

