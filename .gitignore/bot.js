const Util = require('discord.js');

const getYoutubeID = require('get-youtube-id');

const fetchVideoInfo = require('youtube-info');

const YouTube = require('simple-youtube-api');

const youtube = new YouTube("AIzaSyD8xW9RyEw11ShobCjdXEYYAcrgMjKmpc8");

const queue = new Map();

const ytdl = require('ytdl-core');

const fs = require('fs');

const gif = require("gif-search");

const client = new Discord.Client({disableEveryone: true});

const prefix = "*";
/////////////////////////
////////////////////////

client.on('message', async msg => {
	if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(prefix)) return undefined;
    
    let args = msg.content.split(' ');

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)

    if(command === `ping`) {
    let embed = new Discord.RichEmbed()
	.setColor('#e22828')
	.setThumbnail(client.user.avatarURL)
    .setTitle("Voici ma vitesse de ma connection")
    .setDescription(`${client.ping} ms,`)
    .setFooter('Copyright © 2019 Ov3r')
    msg.delete().catch(O_o=>{})
    msg.channel.send(embed);
    }
});
/////////////////////////
////////////////////////
//////////////////////
client.on('message', async msg =>{
	if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(prefix)) return undefined;
    
    let args = msg.content.split(' ');

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)

    if(command === `avatar`){
msg.delete()
	if(msg.channel.type === 'dm') return msg.channel.send("Non Non!! vous ne pouvez pas utiliser la commande d'avatar dans les DM (:")
        let mentions = msg.mentions.members.first()
        if(!mentions) {
          let sicon = msg.author.avatarURL
          let embed = new Discord.RichEmbed()
          .setImage(msg.author.avatarURL)
          .setColor("#e22828")
          msg.channel.send({embed})
        } else {
          let sicon = mentions.user.avatarURL
          let embed = new Discord.RichEmbed()
          .setColor("#e22828")
          .setImage(sicon)
          msg.channel.send({embed})
        }
    };
});
/////////////////////////
////////////////////////
//////////////////////
/////////////////////////
////////////////////////
//////////////////////

/////////////////////////
////////////////////////
//////////////////////
/////////////////////////
////////////////////////
//////////////////////
client.on('message', async msg => { 
	if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(prefix)) return undefined;
    
    const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
    
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)

	if (command === `play`) {
msg.delete()
		const voiceChannel = msg.member.voiceChannel;
        
        if (!voiceChannel) return msg.channel.send("Pour executé cette commande il faut etre dans un canal vocal!");
        
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        
        if (!permissions.has('CONNECT')) {

			return msg.channel.send("Je n'ai pas assez d'autorisations pour rejoindre votre canal vocal!");
        }
        
		if (!permissions.has('SPEAK')) {

			return msg.channel.send("Je n'ai pas assez d'autorisations pour parler dans votre canal vocal!");
		}

		if (!permissions.has('EMBED_LINKS')) {

			return msg.channel.sendMessage("Je n'ai pas assez d'autorisations pour insérer une URL!")
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

			const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            

			for (const video of Object.values(videos)) {
                
                const video2 = await youtube.getVideoByID(video.id); 
                await handleVideo(video2, msg, voiceChannel, true); 
            }
			return msg.channel.send(`**${playlist.title}**, Juste ajouté à la file d'attente!`);
		} else {

			try {

                var video = await youtube.getVideo(url);
                
			} catch (error) {
		
				try {

					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
                    const embed1 = new Discord.RichEmbed()
					.setTitle(":mag_right:  Résultats de recherche YouTube :")
					.setThumbnail(client.user.avatarURL)
                    .setDescription(`
                    ${videos.map(video2 => `${++index}. **${video2.title}**`).join('\n')}`)
                    
					.setColor("#e22828")
					.setFooter('Copyright © Ov3r')
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
/////////////////					
					try {

						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 15000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						msg.delete()
						return msg.channel.send('Tu n\'a pas donner de chiffre la commande est annulé!!');
                    }
                    msg.delete()
					const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    
				} catch (err) {

					console.error(err);
					msg.delete()
					return msg.channel.send("Je n'ai trouvé aucun résultat!");
				}
			}

            return handleVideo(video, msg, voiceChannel);
            
        }
        
	} else if (command === `skip`) {
msg.delete()
		if (!msg.member.voiceChannel) return msg.channel.send("Vous devez être dans un canal vocal pour exécuter les commandes de musique!");
        if (!serverQueue) return msg.channel.send("Il n'y a pas de file d'attente à arrêter!!");

		serverQueue.connection.dispatcher.end('Ok, skipped!');
        return undefined;
        
	} else if (command === `stop`) {
msg.delete()
		if (!msg.member.voiceChannel) return msg.channel.send("Vous devez être dans un canal vocal pour exécuter les commandes de musique!");
        if (!serverQueue) return msg.channel.send("Il n'y a pas de file d'attente à arrêter!!");
        
		serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Ok, stoppée et déconnecté de votre canal vocal');
        msg.channel.send('Ok, stoppé et déconnecté de votre canal vocal');
        return undefined;
        
	} else if (command === `vol`) {
msg.delete()
		if (!msg.member.voiceChannel) return msg.channel.send("Vous ne pouvez utiliser cette commande que pendant la lecture de musique!");
		if (!serverQueue) return msg.channel.send('You only can use this command while music is playing!');
        if (!args[1]) return msg.channel.send(`Le volume du bot est **${serverQueue.volume}**`);
        
		serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        
        return msg.channel.send(`Le volume vien d'être set à : **${args[1]}**`);

	} else if (command === `np`) {
msg.delete()
		if (!serverQueue) return msg.channel.send('Il n\'y a pas de file d\'attente!');
		const embedNP = new Discord.RichEmbed()
		.setDescription(`Lecture en cours :\n**${serverQueue.songs[0].title}**\n**${serverQueue.songs[0].url}**`)
		.setColor('#e22828')
		.setFooter('Copyright © 2019 Ov3r')
		.setThumbnail(client.user.avatarURL)
        return msg.channel.sendEmbed(embedNP);
        
	} else if (command === `queue`) {
		msg.delete()
		if (!serverQueue) return msg.channel.send('il n\'y a pas de fille d\'attente!!');
		let index = 0;
//	//	//
		const embedqu = new Discord.RichEmbed()
		.setTitle("Les Song en Attentes :")
		.setThumbnail(client.user.avatarURL)
		.setFooter('Copyright © Ov3r')
        .setDescription(`
        ${serverQueue.songs.map(song => `${++index}. **${song.title}**`).join('\n')}
**Lecture en cours :** **${serverQueue.songs[0].title}**`)
		.setColor("#e22828")
		
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
msg.delete()
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('Ok, music en pause.');
		}
		return msg.channel.send('Il n\'y a pas de file d\'attente pour faire une pause!');
	} else if (command === "resume") {
msg.delete()
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
            return msg.channel.send('Ok, music reprise!');
            
		}
		return msg.channel.send('La file d\'attente est vide!');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	

	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`,
		duration: video.duration
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}!`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`je ne peut pas rejoindre ce channel: ${error}!`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`**${song.title}**, a été ajouter a la queue! `);
	} 
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
var ssh = new Discord.RichEmbed()
.setAuthor('Youtube Music', client.user.displayAvatarURL)
.addField('🏷️Titre :', `**${song.title}**`, true)
.addField(':link: Lien de la vidéo :', `**${song.url}**`, true)
.setColor('#e22828')
	serverQueue.textChannel.send(ssh);
}


client.on('ready',() => {
    var memberCount = client.users.size;
var servercount = client.guilds.size;
    let statuses = [
      "*help | "+ servercount +" serveurs",
      "*invite | "+ memberCount +" membres",
      "*help| Bot by 0v3r"
  ]

  setInterval(function() {

      let status = statuses[Math.floor(Math.random()*statuses.length)];

      client.user.setPresence({
          game: {
              name: status,
              type: "STREAMING",
              url: "https://twitch.tv/twitch"
          }
      })

  }, 3000)
var servers = client.guilds.array().map(g => g.name).join(',');
    console.log("--------------------------------------");
console.log("[!]Connexion en cours... \n[!]Veuillez Patienté! \n[!]Les évenement sont après ! :)  \n[!]Les préfix actuelle: ! \n[!]Mentions = <@449261986975449097> \n[!]Nombre de membres: " + memberCount + "\n[!]Nombre de serveurs: " + servercount);
  client.guilds.forEach(guild => {
    var invite = client.guilds.find("id", guild.id).channels.find("id", guild.channels.random().id);
    invite.createInvite().then(invite => console.log(`Connecté sur : ${guild.name} ${invite}`));
    })
});

client.on('message', message => {
	if (message.content === '*invite') {
       let invite = new Discord.RichEmbed()
       .setAuthor('Youtube Music', client.user.displayAvatarURL)
       .addField('**Liens utiles pour le bot**', ':link: [Lien D\'invitation](https://discordapp.com/api/oauth2/authorize?client_id=551135214248787988&permissions=8&scope=bot)\n<:badgeverif:571795705748914206> [Serveur Support](https://discord.gg/759Kpcz)')
      .setFooter('Copyright © 2019 Ov3r')
	  .setColor('#e22828')
       message.channel.send(invite)
       }
    if (message.content === '*help') {
message.delete()
        let helpEmbed = new Discord.RichEmbed()
        .setTitle('**Liste des commandes du Youtube Music :**')
        .addField('Music (7)', '``play``|``skip``|``pause``|``resume``|``queue``|``vol``|``np``')
        .addField('Général (4)', '``avatar``|``ping``|``recherche``|``invite``')
		.setFooter('Copyright © 2019 Ov3r ')
		.setColor('#e22828')
		.setThumbnail(client.user.avatarURL)
      message.channel.send(helpEmbed);
    }
if (message.content.startsWith('*recherche')) {
    if (message.deletable) message.delete()
    let args = message.content.split(' ')
    args.shift()
if (!args) return message.channel.send('Merci de me donner quelque chose a rechercher sur youtube');
    message.reply('Voici les résultats de ma recherche pour ``' +args.join(" ")+ '`` : https://www.youtube.com/results?search_query=' + args.join("%20"))

  }
});

client.login("sSAeAicWDa76sLzBVlEr2ZgBW64tllDK");

