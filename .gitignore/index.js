const Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("ready", function() {
    bot.user.setGame("Ov3r'Music, +help");
    console.log("Le Bot a bienn été connécté");
});

bot.on("message", async function(message))
