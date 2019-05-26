const Discord = require("discord.js");

var PREFIX = "!";

var bot = new Discord.Client();

bot.on("ready", function() {
    bot.user.setGame("Ov3r'Music, +help");
    console.log("Le Bot a bienn été connécté");
});

bot.on("message", async function(message) {
    if (message.author.equals(bot.user)) return;

    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");
    
    switch(args[O].toLowerCase()) {
        case "invite":
            message.channel.send("", {
                embed: {
                    color: 0xFF0000
                    author: message.author.name
                    title: '',
                    fields [
                        name: "Lien d'invitation"
                        value: "https://discordapp.com/oauth2/authorize?client_id=582010060423561216&scope=bot&permissions=8"
                        inline: false
                }]
                footer: {
                    footer: "Patartager ce lien a vos potes c'est mon premier bot line : https://discordapp.com/oauth2/authorize?client_id=582010060423561216&scope=bot&permissions=8",
                  },
               }  
            });
        break;
    }

});

bot.login("NTgyMDEwMDYwNDIzNTYxMjE2.XOpMQQ.s4fRBoJXcSj6L6AVlUw1HCNdBbM");
