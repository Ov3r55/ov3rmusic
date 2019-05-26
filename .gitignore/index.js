const Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("ready", function() {
    bot.user.setGame("Ov3r'Music, En dev");
    console.log("Le Bot a bienn été connécté");
});

bot.login("NTgyMDEwMDYwNDIzNTYxMjE2.XOpMQQ.s4fRBoJXcSj6L6AVlUw1HCNdBbM");
