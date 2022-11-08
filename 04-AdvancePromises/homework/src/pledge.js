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
  const downstreamPromise = new $Promise(function () {});
  this._handlerGroups.push({
    successCb: successHandler,
    errorCb: errorHandler,
    downstreamPromise, //(poder anidar .then())
  });
  if (this._state !== "pending") this._callHandlers();
  return downstreamPromise; //que la siguiente promesa devuelva una promesa
};
$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    let actual = this._handlerGroups.shift();
    if (this._state === "fulfilled") {
      if (actual.successCb) {
        try {
          const result = actual.successCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              function (value) {
                actual.downstreamPromise._internalResolve(value);
              },
              function (err) {
                actual.downstreamPromise._internalReject(err);
              }
            );
          } else {
            actual.downstreamPromise._internalResolve(result);
          }
        } catch (e) {
          actual.downstreamPromise._internalReject(e);
        }
      } else {
        actual.downstreamPromise._internalResolve(this._value);
      }
    } else {
      if (actual.errorCb) {
        try {
          const result = actual.errorCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              function (value) {
                actual.downstreamPromise._internalResolve(value);
              },
              function (err) {
                actual.downstreamPromise._internalReject(err);
              }
            );
          } else {
            actual.downstreamPromise._internalResolve(result);
          }
        } catch (e) {
          actual.downstreamPromise._internalReject(e);
        }
      } else {
        actual.downstreamPromise._internalReject(this._value);
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
