const Discord = require("discord.js");

const TOKEN = "#";
var bot = new Discord.Client();

const PREFIX = "thomas";

const R6ROUGE = "435634221277773844";
const R6BLEU = '438091004566962177';

const VCTEST1 = "449019484766732291";
const VCTEST2 = "697523734474391573";

let playerList = [];
let memberMap = new Map();
let teamR = [];
let teamB = [];
let inProgress = false;

bot.on("ready",function(){
	console.log("Thomas is ready for commands!");
	bot.user.setActivity("cmds: thomas help/info",{type:"LISTENING"});
});

//main loop
bot.on("message", function(message){
	if(message.author.equals(bot.user))
		return;

	if(!message.content.startsWith(PREFIX))
		return;

	if(message.content === PREFIX){
		message.channel.send("Meww!").then(consoleLog(message)).catch(console.error);
		return;
	}

	if(message.content.substring(0,7) === "thomas "){
		let args = message.content.substring(7,).split(" ");
		let toWhomID = message.author.id;
		switch(args[0]){
			case "help":
				message.channel.send('Commands:\n'+
					"----------------------------\n"+
					'thomas info\n'+
					'thomas hello\n'+
					'thomas bless\n'+
					'thomas 5v5\\divide\\move\\gather\\reset\n'+
					"----------------------------\n"+
					"Miao is still learning moar!").then(consoleLog(message))
				.catch(console.error);
				break;

			case "hello":
				hello(toWhomID, message);
				break;

			case "info":
				sendInfo(message);
				break;
			
			case "5v5":
				fiveVFive(message);
				break;

			case "divide":
				assignTeam(message);
				break;

			case "move":
				moveIntoVC(message);
				break;

			case "gather":
				gatherUp(message);
				break;

			case "reset":
				clearList(message);
				break;

			case "bless":
				bless(toWhomID, message);
				break;

			default:
				message.channel.send("That command, miao doesn't understand.")
				.then(consoleLog(message)).catch(console.error);
		}
		
	}
});

bot.login(TOKEN);

//utils
function consoleLog(msg){
	console.log(msg.author.username+"@"+msg.guild.name+": "+msg.content);
}

function sendAndLog(msg, origMsg){
	origMsg.channel.send(msg).then(consoleLog(origMsg)).catch(console.error);;
}

const hello = (toWhomID, msg) => {
	sendAndLog("Miao, ciao, <@"+toWhomID+">, Thomas greets thee!", msg);
}

const bless = (toWhomID, msg) => {
	sendAndLog("Meow, <@"+toWhomID+">, thou shall prevail over thy enemies!", msg)
}

const sendInfo = (msg) => {
	sendAndLog(
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
		}, msg)
}

const fiveVFive = (msg) => {
	const voiceChannelID = msg.member.voiceChannelID;
	if(!voiceChannelID){
		sendAndLog("Summon your crowd first, then you shall find me!", msg);
		return ;
	}
	memberMap = msg.guild.channels.get(voiceChannelID).members;
	
	sendAndLog("Current players drafted: "+mentionMapOrList(memberMap),msg);
}

const assignTeam = (msg) => {
	if(memberMap.size===0){
		sendAndLog("Drafting first, assigning next!", msg);
		return ;
	}
	teamB = [];
	teamR = [];
	const shuffledArr = FisherYeet([...memberMap.keys()]);
	for(let i in shuffledArr){
		if(i%2===0){
			teamB.push(shuffledArr[i]);
		}else{
			teamR.push(shuffledArr[i]);
		}
	}
	sendAndLog("Team assignment:\nTeam Blue: "+mentionMapOrList(teamB)+"\nTeam Red: "+mentionMapOrList(teamR), msg);
}

const moveIntoVC = async(msg) => {
	if(memberMap.size===0 || teamB.length===0 || teamR.length===0){
		sendAndLog("Teams have not been assigned yet!", msg);
		return ;
	}
	const promiseB = teamB.map( async id =>{
		await msg.guild.members.get(id).setVoiceChannel(R6BLEU);
	});
	const promiseR = teamR.map( async id =>{
		await msg.guild.members.get(id).setVoiceChannel(R6ROUGE);
	})
	Promise.all([promiseB,promiseR]).then(()=>{
		inProgress = true;
		sendAndLog("YEET! GLHF...", msg);
	});
}

const gatherUp = async(msg) => {
	if(!inProgress){
		sendAndLog("Teams are not divided yet!", msg);
		return ;
	}
	Promise.all(teamR.map( async id =>{
		await msg.guild.members.get(id).setVoiceChannel(R6BLEU);
	})).then(()=>{
		inProgress = false;
		sendAndLog("GGWP!", msg);
	});
}

const clearList = (msg) => {
	playerList = [];
	teamR = [];
	teamB = [];
	memberMap.clear();
	sendAndLog("Everything is back to normal!", msg);
}

const mentionMapOrList = (mapOrList) => {
	let mentionString = "";
	if(mapOrList instanceof Map){
		mapOrList.forEach((value, key)=>{	
			mentionString += "<@"+key+"> ";
		})
	}else{
		mapOrList.forEach(element=>{
			mentionString += "<@"+element+"> ";
		})
	}
	return mentionString;
}

const FisherYeet = (origArr) => {
	const arr = origArr.slice();
	let i = arr.length, k, temp;
	while (--i > 0) {
		k = Math.floor(Math.random() * (i + 1));
		temp = arr[k];
		arr[k] = arr[i];
		arr[i] = temp;
	}
	return arr;
}