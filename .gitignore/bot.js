const Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("ready", function() {
    bot.user.setGame("Ov3r'Music, *help");
    console.log("Le Bot a bien est connécté");
});

bot.login("NTgyMDEwMDYwNDIzNTYxMjE2.XOpMQQ.s4fRBoJXcSj6L6AVlUw1HCNdBbM");
bot.on("message", message => {
if (message.content === "*invite"){
    message.author.send("https://discordapp.com/oauth2/authorize?client_id=582010060423561216&scope=bot&permissions=8")
}
if (message.content === "*help"){
    message.channel.send("Ce bot est en dev")
}
})
