const Discord = require("discord.js");
const TTSPlayer = require('./functions/tts/classes/TTSPlayer');
require('dotenv').config();

const r6shuffle = require('./functions/r6shuffle');
const utils = require("./functions/utils");
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = "thomas";
const TTS_PREFIX = process.env.TTS_PREFIX;

console.log(`Using TTS_PREFIX ${TTS_PREFIX}`)

const THOMAS_ID = "229701039144697858";
let exclusive = false;
const EXCLUSIVE_MILLIS = 10000;
let exclusiveClock = null;
let bindID = THOMAS_ID;

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, 'functions/tts/tts-commands');
const commandFiles = fs.readdirSync(commandsPath);
commandFiles.forEach((file) => {
	const command = require(path.join(commandsPath, file));
	bot.commands.set(command.name, command);
});

bot.on("ready",function(){
	console.log("Thomas is ready for commands!");
	bot.guilds.cache.each((guild) => {
		guild.ttsPlayer = new TTSPlayer(guild);
	});
	bot.user.setActivity("cmds: thomas help/info",{type:"LISTENING"});
});

bot.on("error", (error) =>console.log(error));

//main loop
bot.on("message", function(message){
	let toWhomID = message.author.id;

	if(message.author.equals(bot.user))
		return;

	console.log(`Received message ${message}`);

	if(!message.content.startsWith(PREFIX) && !message.content.startsWith(TTS_PREFIX) && !(exclusive && toWhomID===bindID))
		return;

	if(message.content === PREFIX){
		message.channel.send("Meww!").then(utils.consoleLog(message)).catch(console.error);
		return;
	}

	if(message.content.substring(0,7) === "thomas "){
		let args = message.content.substring(7,).split(" ");
		switch(args[0]){
			case "help":
				message.channel.send('Commands:\n'+
					"----------------------------\n"+
					'thomas info\n'+
					'thomas hello\n'+
					'thomas bless\n'+
					'thomas 5v5\\divide\\move\\gather\\reset\n'+
					'thelp for TTS commands\n'+
					"----------------------------\n"+
					"Miao is still learning moar!").then(utils.consoleLog(message))
				.catch(console.error);
				break;

			case "hello":
				hello(toWhomID, message);
				break;

			case "info":
				sendInfo(message);
				break;

			case "meow":
				meow(message);
				break;
			
			case "5v5":
				r6shuffle.fiveVFive(message);
				break;

			case "divide":
				r6shuffle.assignTeam(message);
				break;

			case "move":
				r6shuffle.moveIntoVC(message);
				break;

			case "gather":
				r6shuffle.gatherUp(message);
				break;

			case "reset":
				r6shuffle.clearList(message);
				break;

			case "bless":
				bless(toWhomID, message);
				break;

			case "exclusive":
				switchExclusiveMode(toWhomID, message);
				break;

			case "snd":
				sendAndDelete(toWhomID, args.slice(1).join(" "), message);
				break;

			default:
				message.channel.send("That command, miao doesn't understand.")
				.then(utils.consoleLog(message)).catch(console.error);
		}
	} else if (message.content.startsWith(TTS_PREFIX)) {
		console.log("tts command: "+message.content);
		if (!message.guild) {
			return;
		}
		const args = message.content.slice(1).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		const options = {
			args,
			commands: bot.commands,
			exclusiveControl:{
				isExclusive: exclusive,
				id: bindID
			}
		};

		executeCommand(message, options, command);
	} else if (exclusive && toWhomID===bindID){
		sendAndDelete(toWhomID, message.content, message);
	}
});

bot.login(TOKEN);


//base functions

const hello = (toWhomID, msg) => {
	utils.sendAndLog("Miao, ciao, <@"+toWhomID+">, Thomas greets thee!", msg);
}

const bless = (toWhomID, msg) => {
	utils.sendAndLog("Meow, <@"+toWhomID+">, thou shall prevail over thy enemies!", msg);
}

const sendInfo = (msg) => {
	utils.sendAndLog(
		{
		  embed: {
			  description: "Thomas the cat communicates with the RNG, meeww!",
			image: {
				url: 'attachment://thomas.jpg'
			}
		   },
		   files: [{
			attachment: './imgs/thomas.jpg',
			name: 'thomas.jpg'
		  }]
		}, msg
	)
}

const meow = (msg) => {
	const { channel } = msg.member.voice;
	if(!channel){
		utils.sendAndLog("You have to be in a voice channel!", msg)
		return;
	}

	channel.join()
        .then(() => {
          	console.log(`Joined ${channel.name} in ${msg.guild.name}.`);
			const { connection } = msg.guild.voice;
			const source = "./resources/meow.mp3";
			const dispatcher = connection.play(source);
			dispatcher.on('start', () => {
				console.log(source+' is now playing!');
			});
			
			dispatcher.on('finish', () => {
				console.log(source+' has finished playing!');
			});
			
			// Always remember to handle errors appropriately!
			dispatcher.on('error', console.error);
			// console.log(broadcast);
		}).catch((exception)=>{
			console.error(exception);
		});
}

const switchExclusiveMode = (id, msg) => {
	// if(bindID!==""){ //binded
	// 	if(bindID===id){
	// 		exclusive = !exclusive;
	// 		exclusive ? bindID=id : bindID="";
	// 		utils.sendAndLog( exclusive? "Thomas now speaks exclusively for <@"+toWhomID+">!" : "Now Thomas speaks for everyone!",msg);
	// 	}else{
	// 		utils.sendAndLog("Thomas speaks for <@"+toWhomID+"> only!", msg);
	// 	}
	// }else{ //unbinded
	// 	bindID = id;
	// 	exclusive = true;
	// 	utils.sendAndLog("Thomas now speaks exclusively for <@"+toWhomID+">!", msg);
	// }
	if(id!==THOMAS_ID){
		utils.sendAndLog("<@"+id+"> you can't control me!", msg);
		return;
	}
	if(!exclusive){
		exclusiveClock = setTimeout(releaseExclusiveControl, EXCLUSIVE_MILLIS, msg);
		const length = EXCLUSIVE_MILLIS/1000
		utils.sendAndLog("Thomas now speaks exclusively for <@"+id+"> for "+ length.toString() +" seconds!",msg);
	
	}else{
		if(exclusiveClock)
			clearTimeout(exclusiveClock);
		exclusiveClock=null;
		utils.sendAndLog("Now Thomas speaks for everyone!", msg);
	}
	exclusive = !exclusive;
}

const releaseExclusiveControl = (msg) => {
	if(!exclusive)
		return;
	exclusive = false;
	utils.sendAndLog("Exclusive control is released, now Thomas speaks for everyone!",msg);
	exclusiveClock = null;
}

const sendAndDelete = (id, content, msg) => {
	utils.sendAndLog("<@"+id+"> just said: "+content, msg);
	msg.delete();
}

const executeCommand = (message, options, commandName) => {
    const author = message.guild ? message.member.displayName : message.author.username;
    const origin = message.guild ? message.guild.name : `DM with ${author}`;

    const command = bot.commands.get(commandName);

    if (!command) {
      return;
    }

    try {
      console.log(`User ${author} issued command ${commandName} in ${origin}.`);
      command.execute(message, options);
    } catch (error) {
      console.log(error);
      message.reply("there's been a problem executing your command.");
    }
}