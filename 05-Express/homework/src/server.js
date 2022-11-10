// const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json()); //aun no entiendo esta linea/tambien se podia usar server.use(bodyParser.json())

// TODO: your code to handle requests
const PATH = "/posts";
let id = 1;
server.post(PATH, function (req, res) {
  let { author, title, contents } = req.body;
  if (author && title && contents) {
    const obj = {
      //Trabajando con destructuring me da esta ventaja:
      author, //: author,
      title, //: title,
      contents, //: contents,
      id: id++,
    };
    posts.push(obj);
    res.json(obj);
  } else {
    var errorObj = {
      error: "No se recibieron los parámetros necesarios para crear el Post",
    };
    res.status(STATUS_USER_ERROR).json(errorObj);
  }
});

server.post(`${PATH}/author/:author`, function (req, res) {
  let { title, contents } = req.body;
  let { author } = req.params;
  if (!title || !contents) {
    res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  } else {
    const obj = {
      author,
      title,
      contents,
      id: id++,
    };
    posts.push(obj);
    res.json(obj);
  }
});

server.get(PATH, function (req, res) {
  let { term } = req.query;
  if (term) {
    const finalPosts = posts.filter(
      (p) => p.title.includes(term) || p.contents.includes(term)
    );
    res.json(finalPosts);
  } else {
    res.json(posts);
  }
});

server.get(`${PATH}/:author`, function (req, res) {
  let { author } = req.params;
  const authorPosts = posts.filter((p) => p.author === author);
  if (authorPosts.length > 0) {
    res.json(authorPosts);
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  }
});

server.get(`${PATH}/:author/:title`, function (req, res) {
  let { author, title } = req.params;
  const authorPosts = posts.filter(
    (p) => p.author === author && p.title === title
  );
  if (authorPosts.length > 0) {
    res.json(authorPosts);
  } else {
    res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  }
});

server.put(PATH, function (req, res) {
  //DUDA SOBRE EL ARRAY POSTS, AUN NO SABE DE LA MODIFICACION O SI?
  //POR EL METODO PUT?
  let { id, title, contents } = req.body;
  if (!id || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }
  const toModify = posts.filter((p) => p.id === parseInt(id));
  if (toModify.length === 1) {
    toModify[0].title = title;
    toModify[0].contents = contents;
    res.json(toModify[0]);
    /*OTRA MANERA DE HACERLO Y NO MANEJARME CON ARRAY:
    const toModify= posts.find(p=> p.id=== paseInt(id))
    if(toModify) {
      toModify.title=title;
      toModify.contents=contents;
      res.json(toModify)
    }
    */
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "No se encontro ningun post con el id enviado" });
  }
});

server.delete(PATH, function (req, res) {
  let { id } = req.body;
  const post = posts.find((p) => p.id === parseInt(id));
  if (!id || !post) {
    return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
  if (post) {
    posts = posts.filter((p) => p.id !== parseInt(id));
    return res.json({ success: true });
  }
});

server.delete("/author", function (req, res) {
  let { author } = req.body;
  const newAuthor = posts.filter((p) => p.author === author);
  if (!author || newAuthor.length===0) {
    return res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"});
  } 
  if(newAuthor.length>0) {
    posts=posts.filter(p=> p.author!==author)
    res.json(newAuthor)
  }
});

module.exports = { posts, server };
