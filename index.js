const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const TTSPlayer = require('./functions/tts/classes/TTSPlayer');
const TTS_CONF = require('./functions/tts/classes/TTSConfig');
require('dotenv').config();

const r6shuffle = require('./functions/r6shuffle');
const utils = require("./functions/utils");
const reserve = require("./functions/reservation");
const fs = require('fs');
const path = require('path');
const { execute } = require("./functions/tts/tts-commands/say");

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = "thomas";
const TTS_PREFIX = "t";

const THOMAS_ID = "229701039144697858";
const EXCLUSIVE_MILLIS = process.env.EXCLUSIVE_MILLIS;

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
		guild.ttsPlayer = new TTSPlayer(guild, new TTS_CONF());
	});
	bot.user.setActivity("cmds: thomas help/info",{type:"LISTENING"});
});

bot.on("error", (error) =>console.log(error));

//main loop
bot.on("message", function(message){
	let toWhomID = message.author.id;
	const { isExclusive, bindId} = message.guild.ttsPlayer.config;

	if(message.author.equals(bot.user))
		return;

	if(!message.content.startsWith(PREFIX) && !message.content.startsWith(TTS_PREFIX) && !(isExclusive && toWhomID===bindId))
		return;

	if(message.content === PREFIX){
		message.channel.send("Meww!").then(utils.consoleLog(message)).catch(console.error);
		return;
	}

	if(message.content.substring(0,7) === "thomas "){
		let args = message.content.substring(7,).split(" ");
		switch(args[0]){
			case "help":
				sendHelp(message);
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

			case "release":
				releaseExclusiveControl(message);
				break;

			case "reserve":
				reservationDriver(message);
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
		const args = message.content.slice(TTS_PREFIX.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		const options = {
			args,
			commands: bot.commands,
		};

		executeCommand(message, options, command);
	} else if (isExclusive && toWhomID===bindId){
		const args = message.content.trim().split(/ +/);
		const options = {
			args,
			commands: bot.commands,
		};
		executeCommand(message, options, "say");
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

const sendHelp= (msg) => {
	const THOMAS_GH = "https://github.com/billzxy/thomasbot";
	const TTS_GH = "https://github.com/moonstar-x/discord-tts-bot";
	const embed = new MessageEmbed()
	.setTitle('THOMAS Commands:')
	.addField("THOMAS native commands:",
	  `
	  	thomas info
	  	thomas hello
	  	thomas bless
		thomas 5v5\\divide\\move\\gather\\reset
		thomas exclusive - gain exclusive control over TTS
		thomas release - release exclusive control
		thomas reserve (-h) - see detailed usage
		thomas snd - send and delete original message

		[**THOMAS**](${THOMAS_GH}) is constantly learning!!!
	  `
	).addField("TTS Commands",
	`
		thelp to show commands for Text-to-speech

		TTS is powered by [**discord-tts-bot**](${TTS_GH})
	`
	);
	utils.sendAndLog(embed, msg);
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
			const index = Math.floor(Math.random() * Math.floor(2));
			const source = `./resources/meow${index}.mp3`;
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
	const {isExclusive, bindId, exclusiveClock,
		setExclusive, setBindId, setExclusiveClock} = msg.guild.ttsPlayer.config;

	if(bindId && id!==bindId){
		utils.sendAndLog("<@"+id+"> you can't control me!", msg);
		return;
	}
	if(!isExclusive){
		setExclusive(setTimeout(releaseExclusiveControl, EXCLUSIVE_MILLIS, msg));
		setBindId(id);
		const length = EXCLUSIVE_MILLIS/1000
		utils.sendAndLog("Thomas now speaks exclusively for <@"+id+"> for "+ length.toString() +" seconds!",msg);
	
	}else{
		if(exclusiveClock)
			clearTimeout(msg.guild.ttsPlayer.config.exclusiveClock);
		setExclusiveClock(null);
		setBindId(null);
		utils.sendAndLog("Now Thomas speaks for everyone!", msg);
	}
	setExclusive(!isExclusive);
}

const releaseExclusiveControl = (msg) => {
	const {isExclusive, setExclusive, setExclusiveClock, setBindId} = msg.guild.ttsPlayer.config;
	if(!isExclusive)
		return;
	setExclusive(false);
	setBindId(null);
	utils.sendAndLog("Exclusive control is released, now Thomas speaks for everyone!",msg);
	setExclusiveClock(null);
}

const reservationDriver = (msg) => {
	reserve(msg.content.split(" "), output => {
		const message = output ? output : "There's a problem with your command, try adding -h";
		const embed = new MessageEmbed()
		.addField("THOMAS Reservation Menu:",message);
		utils.sendAndLog(embed, msg);
	});
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