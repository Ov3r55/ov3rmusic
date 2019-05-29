const Discord = require("discord.js")

var bot = new Discord.Client();

bot.on("ready", function() {
	bot.user.setGame("Test");
	console.log("Le bot a bien été connecté")
});

bot.login("WGw-XoeUXDi_CAyPQ_O4rJg2jX17l9e0")
