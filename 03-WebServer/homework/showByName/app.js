var fs = require("fs");
var http = require("http");

// Escribí acá tu servidor
http
  .createServer(function (req, res) {
    //Desde el archivo (este) que escribo, es a partir hacia donde
    //envio a buscar/leer el resto de la info.
    //__dirname: ptm3/03weserver/hw/showByName
    //Y por eos le agrego el resto que le falta /images/...etc
    fs.readFile(`${__dirname}/images${req.url}.jpg`, (err,data) =>{
        if(err) {
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end("El perrito no se ha encontrado")
        } else {
            res.writeHead(200, {'Content-Type': "image/jpg"})
            res.end(data)
        }
    })
  })
  .listen(3000, /*'127.0.0.1'*/ "localhost");
