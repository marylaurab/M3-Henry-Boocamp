
//Exportare un obj, donde sus propiedades tendran nombres de los
//comandos, y su valor una funcion que ejecute lo que debe de hacer.

//importo un modulo del core fs para interactuar con el file system:
const fs = require("fs");
//instalo e importo un nuevo modulo, ya que el interno 'http' es menos amigable
//para trabajar:
const request = require("request");

module.exports = {
  pwd: function (cb) {
    cb(process.cwd());
  },
  date: function (cb) {
    cb(Date());
  },
  ls: function (cb) {
    fs.readdir(".", function (err, arrFiles) {
      if (err) throw cb(err);
      cb(arrFiles.join("\n"));
      // Lo mismo que arriba pero en mas lineas: var files = "";
      // arrFiles.forEach((file) => {
      //   files=files.concat(file, '\n')
      // });cb(files);
    });
    // Por que aparece sin definir aca:(aun y usando var) cb(files);
  },
  echo: function (cb, args) {
    cb(args.join(" "));
  },
  cat: function (cb, args) {
    fs.readFile(args[0], function (err, content) {
      if (err) throw cb(err);
      cb(content);
    });
  },
  head: function (cb, args) {
    fs.readFile(args[0], "utf-8", function (err, content) {
      if (err) throw cb(err);
      cb(content.split("\n").slice(0, 10).join("\n"));
    }); //Luego probar pasar como argumento la cant de lineas que el usuario
    //desea leer
  },
  tail: function (cb, args) {
    fs.readFile(args[0], "utf-8", function (err, content) {
      if (err) throw cb(err);
      cb(content.split("\n").slice(-10).join("\n"));
    });
  },
  curl: function (cb, args) {
    request(args[0], function (err, data) {
      if (err) throw err;
      cb(data.doby); //me tira error, why??
    });
  },
  clear: function() {
    console.clear()
  }
};
