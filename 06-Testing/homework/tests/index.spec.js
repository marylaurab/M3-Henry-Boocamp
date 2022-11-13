const session = require("supertest-session");
const app = require("../index.js"); // Importo el archivo de entrada del server de express.

const agent = session(app);

describe("Test de APIS", () => {
  describe("GET /", () => {
    it("responds with 200", () => agent.get("/").expect(200));
    it("responds with and object with message `hola`", () =>
      agent.get("/").then((res) => {
        expect(res.body.message).toEqual("hola");
      }));
  });

  describe("GET /test", () => {
    it("responds with 200", () => agent.get("/test").expect(200));
    it("responds with and object with message `test`", () =>
      agent.get("/test").then((res) => {
        expect(res.body.message).toEqual("hola");
      }));
  });

  describe("POST /sum", () => {
    it("responds with 200", () => agent.post("/sum").expect(200));
    it("responds with the sum of 2 and 3", () =>
      agent
        .post("/sum")
        .send({ a: 2, b: 3 })
        .then((res) => {
          expect(res.body.result).toEqual(5);
        }));
  });

  describe("POST /producto", () => {
    it("responds with 200", () => agent.post("/product").expect(200));
    it("responds with the product of 2 and 3", () =>
      agent
        .post("/product")
        .send({ a: 2, b: 3 })
        .then((res) => {
          expect(res.body.result).toEqual(6);
        }));
  });

  describe("POST /sumArray", () => {
    it("responds with 200", () =>
      agent.post("/sumArray").send({ array: [], num: 6 }).expect(200));
    it("responds with and object with message `true`", () =>
      agent
        .post("/sumArray")
        .send({ array: [2, 5, 7, 10, 11, 15, 20], num: 13 })
        .then((res) => {
          expect(res.body.result).toEqual(true);
        }));
    it("responds with false if no combination of two numbers matches with de given number", () =>
      agent
        .post("/sumArray")
        .send({ array: [1, 2, 3, 4], num: 16 })
        .then(res=>expect(res.body.result).toEqual(false)));
  });
  describe("GET /numString", () => {
    it("responds with 200", () =>
      agent.get("/numString?string=holaxx").expect(200));
    it("responds with 400 if query parameter is a number", () =>
      agent.get("/numString?string=4").expect(400));
    it("responds with 400 if query parameter is empty", () =>
      agent.get("/numString").expect(400));
    it("responds 4 if query parameter is hola", () =>
      agent
        .get("/numString?string=hola")
        .then((res) => expect(res.body.result).toEqual(4)));
  });
});

describe("POST /pluck", () => {
  const arr = [
    { name: "Mary Laura", type: "jazz" },
    { name: "yeya", type: "urban" },
  ];

  it("responds with 200", () =>
    agent.post("/pluck").send({ array: arr, prop: "type" }).expect(200));
  it("responds with functionality", () =>
    agent
      .post("/pluck")
      .send({
        array: arr,
        prop: "type",
      })
      .then((res) => expect(res.body.result).toEqual(["jazz", "urban"])));
  it("responds with 400 if array is not an array", () =>
    agent
      .post("/plunk")
      .send({ array: {1:"1"}, prop: "test" })
      .expect(400));
  it("respondes with 400 if string is empty", () =>
    agent
      .post("/plunk")
      .send({ array: [{ a: "a" }, { b: "b", c: "c" }], prop: "" }));
});
