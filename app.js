const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const ytdl = require('ytdl-core');
var NOTIFY_CHANNEL;

let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));
const badRole = ("Sorry, you don't have the appropriate role for this command.");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`!commands`, {type: "WATCHING"});
  NOTIFY_CHANNEL = client.channels.find('id', '429386089560670219');
});

client.on("error", () => {
  console.error(`Botched m8.`); 
});

client.on("reconnecting", () => {
  console.log(`Bot has lost connection, attempting to re-establish.`); 
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

const TARGET_MINUTE = 0; // Minute of the hour when the chest will refresh, 30 means 1:30, 2:30, etc.
const OFFSET = 0; // Notification will be sent this many minutes before the target time, must be an integer
const NOTIFY_MINUTE = (TARGET_MINUTE < OFFSET ? 60 : 0) + TARGET_MINUTE - OFFSET;

setInterval(function() {
    var d = new Date();
    if(d.getMinutes() !== NOTIFY_MINUTE) return; // Return if current minute is not the notify minute
//    NOTIFY_CHANNEL.sendMessage('You will have to wait ' + OFFSET + ' minutes!');
    NOTIFY_CHANNEL.send('Bing bong, an hour has passed!');
	console.log('The bot has bing bonged.');
}, 60 * 1000); // Check every minute

client.on("message", async message => {
  let userPoints = points[message.author.id] ? points[message.author.id].points : 0;
  let curLevel = Math.floor(0.1 * Math.sqrt(userPoints));
  let userData = points[message.author.id];
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command == "give") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
		let member = message.mentions.members.first();
		let [name, pointstogive, ...other] = args;
				if(!points[member.id]) points[member.id] = {
			points: 0,
			level: 0
		};
		let memberData = points[member.id];
		memberData.points = Math.floor(memberData.points + parseInt(pointstogive));
		message.reply(`${pointstogive} has been given to ${member}.`);
		console.log(`${pointstogive} given by ${message.author.username}.`);
		fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err);
  });
      message.delete().catch(O_o=>{}); 
  }
  
  if(command === "say") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
    const sayMessage = args.join(" ");
	console.log(`${message.author.username} imitated and said "${sayMessage}".`); 
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
	}
	
	  if(command === "level") {
    message.reply(`You currently have ${userPoints} points.`);
	}
	
	    if(command === "commands") {
	message.channel.send({embed: {
    description: "**This is the current commands list.**\n\n",
    color: 12069074,
    timestamp: "2018-02-27T22:57:55.164Z",
    footer: {
      icon_url: "https://cdn.discordapp.com/avatars/267655839685410816/a_10546e25615617c84bb50e15a4d5a47f.gif",
      text: "Version 1.0.0.0"
    },
    author: {
      name: "Uncle Skeleton",
      url: "https://discord.gg/vUCv5TP",
	  icon_url: "https://cdn.discordapp.com/avatars/267655839685410816/a_10546e25615617c84bb50e15a4d5a47f.gif"
    },
    fields: [{
        name: "!set [value]",
        value: "You can set what the bot is playing/watching/streaming/listening to, or set it's online status."
      },
      {
        name: "!say [text]",
        value: "Lets you imitate the bot."
      },
	  {
        name: "!give [mention] [int]",
        value: "Give a user points.."
      },
	  {
        name: "!level",
        value: "Views your current points."
      },
	  {
        name: "!match [mention]",
        value: "Simulates a 1-on-1 Rocket League match for points."
      },
      {
        name: "!about [mention]",
        value: "Replies with details on the mentioned user."
      },
	  {
        name: "!danceattack",
        value: "Plays Dance Attack FM."
      },
	  {
        name: "!youtube [link]",
        value: "Plays audio from any YouTube video, work in progress."
      },
	  {
        name: "!leave",
        value: "Ends the audio stream."
      },
      {
        name: "!ping",
        value: "Sends a ping to the bot, and returns with a pong and latency results."
      },
      {
        name: "!purge [int]",
        value: "Purges a channel from 2-100 messages."
      },
      {
        name: "!league",
        value: "Invites the server owner to Rocket League."
      },
	  {
        name: "!dbd",
        value: "Invites the server owner to Dead by Daylight."
      },
      {
        name: "!kick [mention] [reason]",
        value: "Kicks a user.",
        inline: true
      },
      {
        name: "!ban [mention] [reason]",
        value: "Bans a user.",
        inline: true
      }
    ]
	}
  }
  )
}
  
  	    if(command === "about") {
	let member = message.mentions.users.first();
	let membertwo = message.mentions.members.first();
	message.delete().catch(O_o=>{}); 
	message.reply({
  embed: {
    description: `This is what I could tell about ${membertwo.displayName}.`,
    url: "https://discord.gg/vUCv5TP",
    color: 12069074,
    footer: {
      icon_url: `${member.avatarURL}`,
      text: `${membertwo.displayName}'s about me.`
    },
    image: {
      url: `${member.avatarURL}`
    },
    "author": {
      name: `${message.author.username}`,
      url: "https://discord.gg/vUCv5TP",
      icon_url: `${message.author.avatarURL}`
    },
    fields: [
      {
        name: "About them:",
	  value: `**User ID:** ${membertwo.id}
**Username:** ${membertwo.displayName}
**Role:** ${membertwo.highestRole}
**Image URL:** [View Here](${member.avatarURL})
**Voice Channel:** ${membertwo.voiceChannel}
**Date Joined:** ${membertwo.joinedAt}`
      }
  ]
  }
	}
	)
		}
  
  	if(command === "setonline") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	client.user.setStatus("online");
	console.log(`!setonline was initiated by ${message.author.username}.`); 
  }
  
    if(command === "setidle") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	client.user.setStatus("idle");
	console.log(`!setidle was initiated by ${message.author.username}.`); 
  }
  
    if(command === "setdnd") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	client.user.setStatus("dnd");
	console.log(`!setdnd was initiated by ${message.author.username}.`); 
  }
  
    if(command === "setoffline") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	client.user.setStatus("invisible");
	console.log(`!setoffline was initiated by ${message.author.username}.`); 
  }
  
	if(command === "setstreaming") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	const sayMessage = args.join(" ");
	message.channel.send(`Uncle Skeleton is now streaming ${sayMessage} at https://www.twitch.tv/uncle_skeleton`);
	client.user.setActivity(`${message.author.username} on Twitch`, {type: "WATCHING"});
  }
  
    if(command === "setplaying") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	const sayMessage = args.join(" ");
	message.channel.send(`${sayMessage} is now being played.`);
	client.user.setActivity(`${sayMessage}`, {type: "PLAYING"});
  }
  
  	if(command === "setwatching") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	const sayMessage = args.join(" ");
	message.channel.send(`${sayMessage} is now being watched.`);
	client.user.setActivity(`${sayMessage}`, {type: "WATCHING"});
  }
  
    if(command === "setlistening") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	const sayMessage = args.join(" ");
	message.channel.send(`${sayMessage} is now being listened to.`);
	client.user.setActivity(`${sayMessage}`, {type: "LISTENING"});
  }
  
  if(command === "kick") {
    if(!message.member.roles.has(config.modID) ){
    return message.reply(`${badRole}`);
	}
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    if(!message.member.roles.has(config.modID) ){
    return message.reply(`${badRole}`);
	}
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
    if(command === "leave") {
    // Only try to join the sender's voice channel if they are in one themselves
	console.log(`Attempted leave.`);
    if(message.member.voiceChannel) {
      message.member.voiceChannel.leave()
      message.delete().catch(O_o=>{}); 
    }
	else
	{
		message.reply('I am not in your voice channel!');
	}
  }
  
  if(command === "danceattack") {
    // Only try to join the sender's voice channel if they are in one themselves
	console.log(`Attempted join.`);
    if(message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
		const dispatcher = connection.playArbitraryInput('http://comet.shoutca.st:8563/1');
          message.reply('I have successfully connected to the channel! Now playing Dance Attack FM.');
		  dispatcher.resume()
		  console.log("Attempting to play audio.");
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
  
    if(command === "youtube") {
	console.log(`Attempted join.`);
	const youtubeRequest = args.join(" ");
    if(message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
		const dispatcher = connection.playStream(ytdl(
		`${youtubeRequest}`,
		{ filter: 'audioonly' }));
          message.reply('I have successfully connected to the channel! Now playing requested audio.');
		  dispatcher.resume()
		  console.log("Attempting to play audio.");
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
  
  if(command === "purge") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
	const fetched = await message.channel.fetchMessages({limit: deleteCount});
	console.log(`!purge was initiated by ${message.author.username} and removed ${deleteCount} messages.`); 
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  
    	    if(command === "match") {
	let member = message.mentions.users.first();
	let membertwo = message.mentions.members.first();
				if(!points[member.id]) points[member.id] = {
			points: 0,
			level: 0
		};
		let authorData = points[message.author.id];
		let memberData = points[member.id];
        var x = getRandomInt(0, 9);
		if (x < 6){
         if (x < 3){
			message.channel.send({
  "embed": {
    "title": "Rocket League - Solo Duel",
    "description": `This was a tense match between ${message.author.username} and ${membertwo.displayName}.\n\nThe result were these final scores:`,
    "color": 16711680,
    "image": {
      "url": "https://i.imgur.com/CL3pqmz.png"
    },
    "fields": [
      {
        "name": `${message.author.username}`,
        "value": "Place: 1st\nGoals: 3\nPoints: +15",
        "inline": true
      },
      {
        "name": `${membertwo.displayName}`,
        "value": "Place: 2nd\nGoals: 0\nPoints: -15",
        "inline": true
      }
    ]
  }
});
			authorData.points = Math.floor(authorData.points + parseInt(15));
			memberData.points = Math.floor(memberData.points + parseInt(-15));
					fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err);
  });
		}
		else{
               message.channel.send({
  "embed": {
    "title": "Rocket League - Solo Duel",
    "description": `This was a tense match between ${message.author.username} and ${membertwo.displayName}.\n\nThe result were these final scores:`,
    "color": 16711680,
    "image": {
      "url": "https://i.imgur.com/CL3pqmz.png"
    },
    "fields": [
      {
        "name": `${message.author.username}`,
        "value": "Place: 2nd\nGoals: 0\nPoints: -5",
        "inline": true
      },
      {
        "name": `${membertwo.displayName}`,
        "value": "Place: 1st\nGoals: 1\nPoints: 5",
        "inline": true
      }
    ]
  }
});
			   authorData.points = Math.floor(authorData.points + parseInt(-5));
			   memberData.points = Math.floor(memberData.points + parseInt(5));
						fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err);
  });
		}
		}
		else{ 
			message.channel.send({
  "embed": {
    "title": "Rocket League - Solo Duel",
    "description": `This was a tense match between ${message.author.username} and ${membertwo.displayName}.\n\nThe result were these final scores:`,
    "color": 16711680,
    "image": {
      "url": "https://i.imgur.com/CL3pqmz.png"
    },
    "fields": [
      {
        "name": `${message.author.username}`,
        "value": "Place: 2nd\nGoals: 0\nPoints: -15",
        "inline": true
      },
      {
        "name": `${membertwo.displayName}`,
        "value": "Place: 1st\nGoals: 3\nPoints: +15",
        "inline": true
      }
    ]
  }
});
			authorData.points = Math.floor(authorData.points + parseInt(-15));
			memberData.points = Math.floor(memberData.points + parseInt(15));
					fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err);
  });
		}
			}
  
    if(command === "league") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	message.channel.send(`Did someone say League? <@267655839685410816>`);
	
	}
	
	if(command === "dbd") {
    if(!message.member.roles.has(config.adminID) ){
    return message.reply(`${badRole}`);
	}
	message.channel.send(`Five generators need your help! <@267655839685410816>`);
	}
	
		if(command === "roll") {
	var replies = ["1","2","3","4","5","6"];
	var rand = Math.floor(Math.random() * replies.length);
	var randomReply = replies[rand];
	message.channel.send(`${message.author} rolled a ${randomReply}.`);
	}
	
			if(command === "rate") {
	var replies = ["0/10","1/10","2/10","3/10","4/10",,"5/10","6/10","7/10",,"8/10","9/10","10/10"];
	var rand = Math.floor(Math.random() * replies.length);
	var randomReply = replies[rand];
	message.channel.send(`I rate this: ${randomReply}!`);
	}
	
  })
  


client.login(process.env.BOT_TOKEN);