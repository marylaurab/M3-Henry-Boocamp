const commands = require("./commands/index"); //commands es un obj
//No importa el comando que pase el usuario, siempre
//sera lo mismo, se mostrara en pantalla el resultado
//que se ejecute de las funciones dentro de commands, y luego
//el prompt vuelve a esperar otro comando:
const cb = function (output) {
  process.stdout.write(output);
  process.stdout.write("\nprompt >");
};

//Quiero mostrar el prompt "que espera el comando":
process.stdout.write("prompt >");

/*Quiero que agarre lo que el usuario escribio, y segun el 
comando escrito, haga algo*/
process.stdin.on("data", function (data) {
  var args = data.toString().trim().split(" ");
  var cmd = args.shift();
  commands[cmd] ? commands[cmd](cb, args) : cb("Command not found");
});
