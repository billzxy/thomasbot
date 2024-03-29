const utils = require('./utils');
const R6ROUGE = process.env.R6ROUGE;
const R6BLEU = process.env.R6BLEU;
const R6CARRYROLENAME = process.env.R6CARRYROLENAME;

let playerList = [];
let memberMap = new Map();
let teamR = [];
let teamB = [];
let inProgress = false;

const fiveVFive = (msg) => {
	// const voiceChannelID = msg.member.voice.channelID; newer API 
	const voiceChannelID = msg.member.voice.channelID;
	if(!voiceChannelID){
		utils.sendAndLog("Summon your crowd first, then you shall find me!", msg);
		return ;
	}
	memberMap = msg.guild.channels.resolve(voiceChannelID).members;
	// msg.guild.channels.fetch(voiceChannelID)
	// .then(channel => {
	// 	console.log(`The channel name is: ${channel.name}`);
	// 	memberMap = channel.members;
	// })
	// .catch(console.error);
	
	utils.sendAndLog("Current players drafted: "+mentionMapOrList(memberMap),msg);
}

const excludePlayer = (msg) => {
	if(memberMap.size===0){
		utils.sendAndLog("Players are not drafted yet!", msg);
		return ;
	}
	const mentionedMemberMap = msg.mentions.members;
	console.log(mentionedMemberMap);
	console.log(memberMap);
	if(!mentionedMemberMap || mentionedMemberMap.size===0){
		utils.sendAndLog("You have to mention @whoeverYouWantToExclude!", msg);
		return ;
	}
	mentionedMemberMap.forEach((member, id) => {
		memberMap.delete(id);
	});
	if(memberMap.size===0){
		utils.sendAndLog("Player pool is purged, and no one's playing anymore!", msg);
	}else{
		utils.sendAndLog("Current players drafted: "+mentionMapOrList(memberMap), msg);
	}
}

const assignTeam = (msg) => {
	if(memberMap.size===0){
		utils.sendAndLog("Drafting first, assigning next!", msg);
		return ;
	}
	teamB = [];
	teamR = [];
	const carryPlayerArr = [], casualPlayerArr = [];
	memberMap.forEach((member, id) => {
		let isCarryPlayer = false;
		member.roles.cache.forEach(role => {
			if(role.name===R6CARRYROLENAME){
				isCarryPlayer = true;
			}
		});
		if(isCarryPlayer){
			carryPlayerArr.push(id);
		}else{
			casualPlayerArr.push(id);
		}
	}) 
	const shuffledArr = [...FisherYeet(carryPlayerArr), ...FisherYeet(casualPlayerArr)];
	for(let i in shuffledArr){
		if(i%2===0){
			teamB.push(shuffledArr[i]);
		}else{
			teamR.push(shuffledArr[i]);
		}
	}
	utils.sendAndLog("Team assignment:\nTeam Blue: "+mentionMapOrList(teamB)+"\nTeam Red: "+mentionMapOrList(teamR), msg);
}

const moveIntoVC = (msg) => {
	if(memberMap.size===0 || teamB.length===0 || teamR.length===0){
		utils.sendAndLog("Teams have not been assigned yet!", msg);
		return ;
	}
	const promiseB = [], promiseR = [];
	teamB.forEach(id =>{
		msg.guild.members.fetch(id).then(member => {
			promiseB.push(member.voice.setChannel(R6BLEU));
		});
	});
	teamR.forEach(id =>{
		msg.guild.members.fetch(id).then(member => {
			promiseR.push(member.voice.setChannel(R6ROUGE));
		});
		// await msg.guild.members.get(id).setVoiceChannel(R6ROUGE);
	})
	Promise.all([promiseB,promiseR]).then(()=>{
		inProgress = true;
		utils.sendAndLog("YEET! GLHF...", msg);
	});
}

const gatherUp = (msg) => {
	if(!inProgress){
		utils.sendAndLog("Teams are not divided yet!", msg);
		return ;
	}
	const promiseAll = [];
	teamR.forEach( id => {
		msg.guild.members.fetch(id).then(member => {
			promiseAll.push(member.voice.setChannel(R6BLEU));
		});
	});
	Promise.all(promiseAll).then(()=>{
		inProgress = false;
		utils.sendAndLog("GGWP!", msg);
	});
}

const clearList = (msg) => {
	playerList = [];
	teamR = [];
	teamB = [];
	memberMap.clear();
	utils.sendAndLog("Everything is back to normal!", msg);
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

module.exports = {
    fiveVFive,
	excludePlayer,
    assignTeam,
    moveIntoVC,
    gatherUp,
    clearList,
}