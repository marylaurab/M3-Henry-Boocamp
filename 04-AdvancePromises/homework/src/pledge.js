"use strict";

/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
  if (typeof executor !== "function")
    throw new TypeError("the argument used as executor must be a function");
  this._state = "pending";
  this._value = undefined;
  this._handlerGroups = [];
  //arrow function:
  executor(
    (value) => this._internalResolve(value),
    (reason) => this._internalReject(reason)
  );

  //usando bind:
  //executor(this._internalResolve(this), this._internalReject(this))
}
$Promise.prototype._internalResolve = function (value) {
  if (this._state === "pending") {
    this._state = "fulfilled";
    this._value = value;
    //NO ENTIENDO ESTA LINEA AUN:
    this._callHandlers();
  }
};
$Promise.prototype._internalReject = function (reason) {
  if (this._state === "pending") {
    this._state = "rejected";
    this._value = reason;
    this._callHandlers();
  }
};
$Promise.prototype.then = function (successHandler, errorHandler) {
  if (typeof successHandler !== "function") successHandler = false;
  if (typeof errorHandler !== "function") errorHandler = false;
  this._handlerGroups.push({
    successCb: successHandler,
    errorCb: errorHandler,
  });
  if (this._state !== "pending") this._callHandlers();
};
$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    let actual = this._handlerGroups.shift();
    if (this._state === "fulfilled" && actual.successCb) {
      actual.successCb(this._value);
    } else {
      if (actual.errorCb) {
        actual.errorCb(this._value);
      }
    }
  }
};
$Promise.prototype.catch = function (errorHandler) {
  this.then(null, errorHandler);
};

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
