var http = require("http");
var fs = require("fs");

var beatles = [
  {
    name: "John Lennon",
    birthdate: "09/10/1940",
    profilePic:
      "https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg",
  },
  {
    name: "Paul McCartney",
    birthdate: "18/06/1942",
    profilePic:
      "http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg",
  },
  {
    name: "George Harrison",
    birthdate: "25/02/1946",
    profilePic:
      "https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg",
  },
  {
    name: "Richard Starkey",
    birthdate: "07/08/1940",
    profilePic:
      "http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg",
  },
];
function template(html, beatle) {
  return html
    .replace("{name}", beatle.name)
    .replace("{birthdate}", beatle.birthdate)
    .replace("{profilePic}", beatle.profilePic);
} //"/{birthdate}/g"

http
  .createServer(function (req, res) {
    if (req.url === "/") {
      fs.readFile(`${__dirname}/index.html`, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Ocurrio un error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else if (req.url === "/api") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(beatles));
    } else if (req.url.includes("/api/")) {
      let beatleName = req.url.slice(5).split("%20").join(" "); //John Lennon
      let foundBeatle = beatles.find(function (b) {
        return beatleName === b.name;
      });
      if (foundBeatle) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(foundBeatle));
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Ese beatle no se encuentra");
      }
    } else {
      //ESTO YA NO ME CORRE aun no entiendo por que noup.
      let beatleName = req.url.split("/").pop(); //localhost:3000/John%20Lennon>> ["","John%20Lennon"]>> "John%20Lennon"
      let foundBeatle = beatles.find(function (b) {
        return beatleName === encodeURI(b.name);
      });
      if (foundBeatle) {
        fs.readFile(`${__dirname}/beatle.html`, "utf-8", (err, data) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Ocurrio un error");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            let finalHTML = template(data, foundBeatle);
            res.end(finalHTML);
          }
        });
      }
    }
  })
  .listen(3000, "localhost");

/*--------------------------------------------------------------------------------
  //MARTINA:else if (req.url.substring(0, 5) === "/api/" && req.url.length > 5) {
    //   let beatleName = req.url.split("/").pop(); //John%20Lennon
    //   let foundBeatle = beatles.find(function (b) {
    //     return beatleName === encodeURI(b.name);
    //   });
    //   if (foundBeatle) {
    //     res.writeHead(200, { "Content-Type": "application/json" });
    //     res.end(JSON.stringify(foundBeatle));
    //   } else {
    //     res.writeHead(404, { "Content-Type": "text/plain" });
    //     res.end("Ese beatle no se encuentra");
    //   }
    //------------------------------------------------------------------------------
    // }*/
