const Discord = require("discord.js")

var bot = new Discord.Client();

bot.on("ready", function() {
	bot.user.setGame("Test");
	console.log("Le bot a bien été connecté")
});

bot.login("NjkwMTQ0NDM4Njg0NzQ1ODA3.Xnil5A.Hl3wfdx3m9Vl9pElMIGfE32IfnI")
