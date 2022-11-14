/*********** Yo explico `exerciseUtils` ********
 *
 * excersiceUtils es una variable que viene de un archivo en este repo
 * El archivo `./utils` esta en este nivel y se llama `utils.js`
 *
 * Este archivo crea un `promisifiedReadFile` - FIJATE EN ÉL!!!
 *
 * Las funciones `blue` y `magenta` para mantener tu código DRY
 *
 ***********************************************/

"use strict";

var Promise = require("bluebird"),
  exerciseUtils = require("./utils");

var readFile = exerciseUtils.readFile,
  promisifiedReadFile = exerciseUtils.promisifiedReadFile,
  blue = exerciseUtils.blue,
  magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function (st) {
  return st.toUpperCase();
});

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE,
  problemF: problemF,
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function (arg) {
  var problem = module.exports["problem" + arg];
  if (problem) problem();
});

function problemA() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loguea el poema uno stanza uno (ignorá errores)
   *
   */

  // callback version
  // readFile('poem-one/stanza-01.txt', function (err, stanza) {
  //   console.log('-- A. callback version --');
  //   blue(stanza);
  // });

  //Promise version
  // promisifiedReadFile('poem-one/stanza-01.txt').then(stanza1=>blue(stanza1))

  // AsyncAwait version
  let stanza = async (archivo) => {
    let stanza1 = await promisifiedReadFile(archivo);
    blue(stanza1);
  };
  stanza("poem-one/stanza-01.txt");
}

function problemB() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea el poema uno stanza dos y tres, en cualquier orden
   *    (ignora errores)
   *
   */

  // callback version
  // readFile('poem-one/stanza-02.txt', function (err, stanza2) {
  //   console.log('-- B. callback version (stanza two) --');
  //   blue(stanza2);
  // });
  // readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //   console.log('-- B. callback version (stanza three) --');
  //   blue(stanza3);
  // });

  //promise version
  // promisifiedReadFile('poem-one/stanza-02.txt').then(stanza2=>blue(stanza2));
  // promisifiedReadFile('poem-one/stanza-03.txt').then(stanza3=>blue(stanza3))
  // AsyncAwait version:
  const readFile1 = async (file) => {
    blue(await promisifiedReadFile(file));
  };
  readFile1("poem-one/stanza-02.txt");
  // const readFile2 = async (file) => {
  //   blue(await promisifiedReadFile(file));
  // };
  readFile1("poem-one/stanza-03.txt");
}

function problemC() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. lee & loggea el poema uno stanza dos y *DESPUES* lee & loggea
   *    stanza tres. Loggea 'done' cuando ambas hayan terminado. Fijate
   *    que los specs estan opinionados y espara la palabra exacata
   *    'done' (case sensitive) para ser loggeada para poder pasar
   *    (ignora errores)
   *
   */

  // callback version
  // readFile("poem-one/stanza-02.txt", function (err, stanza2) {
  //   console.log("-- C. callback version (stanza two) --");
  //   blue(stanza2);
  //   readFile("poem-one/stanza-03.txt", function (err, stanza3) {
  //     console.log("-- C. callback version (stanza three) --");
  //     blue(stanza3);
  //     console.log("-- C. callback version done --");
  //   });
  // });

  //promise version
  // promisifiedReadFile("poem-one/stanza-02.txt")
  //   .then((stanza2) => {
  //     blue(stanza2);
  //     return promisifiedReadFile("poem-one/stanza-03.txt");
  //   })
  //   .then((stanza3) => blue(stanza3));

  // AsyncAwait version
  let stanza = async (file) => {
    let stanza = await promisifiedReadFile(file);
    blue(stanza);
  };
  async function inOrder() {
    await stanza("poem-one/stanza-02.txt");
    await stanza("poem-one/stanza-03.txt");
    //O ACA DIRECTAMENTE:
    //console.log("done")
  } //inOrder()
  async function log() {
    await inOrder();
    console.log("done");
  }
  log();
}

function problemD() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea el poema uno stanza cuatro o un error si llega a ocurrir
   *
   */

  // callback version
  // readFile("poem-one/wrong-file-name.txt", function (err, stanza4) {
  //   console.log("-- D. callback version (stanza four) --");
  //   if (err) magenta(err);
  //   else blue(stanza4);
  // });

  // AsyncAwait version

  const stanza = async (file) => {
    try {
      const stanza1 = await promisifiedReadFile(file);
      blue(stanza1);
    } catch (e) {
      magenta(e);
    }
  };
  stanza("poem-one/wrong-file-name.txt");
}

function problemE() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Lee y loggea el poema uno stanza tres y *DESPUES* lee y loggea la
   *    stanza cuatro o loggea un error si llegase a ocurrir para
   *    cuaquiera de las lecturas
   *
   */
  // callback version
  // readFile("poem-one/stanza-03.txt", function (err, stanza3) {
  //   console.log("-- E. callback version (stanza three) --");
  //   if (err) return magenta(err);
  //   blue(stanza3);
  //   readFile("poem-one/wrong-file-name.txt", function (err2, stanza4) {
  //     console.log("-- E. callback version (stanza four) --");
  //     if (err2) return magenta(err2);
  //     blue(stanza4);
  //   });
  // });
  //promise version:
  // promisifiedReadFile("poem-one/stanza-03.txt")
  //   .then((stanza3) => {
  //     blue(stanza3);
  //     return promisifiedReadFile("poem-one/wrong-file-name.txt");
  //   })
  //   .then((stanza4) => blue(stanza4))
  //   .catch((e) => new Error(magenta(e)));
  // AsyncAwait version
  const stanza = async (file) => {
    blue(await promisifiedReadFile(file));
  };

  const inOrder = async () => {
    try {
      await stanza("poem-one/stanza-03.txt");
      await stanza("poem-one/wrong-file-name.txt");
    } catch (e) {
      new Error(magenta(e));
    }
  };
  inOrder();
}

function problemF() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * F. Lee & loggea el poema uno stanza tres y *DESPUES* lee y loguea la
   *    stanza cuatro o loggea un error si occrre para cualquiera de las
   *    lecturas y siempre loggea 'done' cuando todo haya terminado
   *
   */
  // callback version
  // readFile("poem-one/stanza-03.txt", function (err, stanza3) {
  //   console.log("-- F. callback version (stanza three) --");
  //   if (err) {
  //     magenta(err);
  //     console.log("-- F. callback version done --");
  //     return;
  //   }
  //   blue(stanza3);
  //   readFile("poem-one/wrong-file-name.txt", function (err2, stanza4) {
  //     console.log("-- F. callback version (stanza four) --");
  //     if (err2) magenta(err2);
  //     else blue(stanza4);
  //     console.log("-- F. callback version done --");
  //   });
  // });
  //Promise version
  // promisifiedReadFile("poem-one/stanza-03.txt")
  //   .then((stanza3) => {
  //     blue(stanza3);
  //     return promisifiedReadFile("poem-one/wrong-file-name.txt");
  //   })
  //   .then((stanza4) => blue(stanza4))
  //   .catch((e) => new Error(magenta(e)))
  //   .finally(()=>console.log("done"));
  // AsyncAwait version
  const readStanza = async (file) => blue(await promisifiedReadFile(file));

  async function inOrder() {
    try {
      await readStanza("poem-one/stanza-03.txt");
      await readStanza("poem-one/wrong-file-name.txt");
      //console.log("done"); aca solo se ejecutara si todo sale bien
    } catch (e) {
      new Error(magenta(e));
    } finally {
      console.log("done");
    }
  }
  inOrder();
}
