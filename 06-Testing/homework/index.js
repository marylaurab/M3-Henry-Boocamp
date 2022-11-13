const express = require("express");
const app = express();

app.use(express.json()); // for parsing application/json

app.get("/", (req, res) => {
  res.send({
    message: "hola",
  });
});
app.get("/test", function (req, res) {
  res.send({ message: "hola" });
});
app.post("/sum", function (req, res) {
  let { a, b } = req.body;
  res.send({ result: a + b });
});
app.post("/product", (req, res) => {
  res.send({
    result: req.body.a * req.body.b,
  });
});
app.post("/sumArray", function (req, res) {
  let { array, num } = req.body;
  if (array.length === 0) return res.send({ result: true });
  for (var i = 0; i < array.length - 1; i++) {
    for (var j = i + 1; j < array.length; j++) {
      if (array[i] + array[j] === num) {
        return res.json({ result: true });
      } else {
        continue;
      }
    }
  }
  return res.json({ result: false });
});
app.get("/numString", function (req, res) {
  let { string } = req.query;
  if (parseInt(string) || !string) {
    return res.sendStatus(400);
  }
  res.send({ result: string.length });
});

app.post("/pluck", function (req, res) {
  let { array, prop } = req.body;
  if (!Array.isArray(array) || !prop) return res.sendStatus(400); //duda con 404 y 400
  let finalArray = [];
  array.forEach((i) => finalArray.push(i[prop]));
  return res.json({ result: finalArray });
});
module.exports = app; // Exportamos app para que supertest session la pueda ejecutar
