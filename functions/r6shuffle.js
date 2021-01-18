const utils = require('../index');
const R6ROUGE = "435634221277773844";
const R6BLEU = '438091004566962177';

const VCTEST1 = "449019484766732291";
const VCTEST2 = "697523734474391573";

let playerList = [];
let memberMap = new Map();
let teamR = [];
let teamB = [];
let inProgress = false;

const fiveVFive = (msg) => {
	const voiceChannelID = msg.member.voiceChannelID;
	if(!voiceChannelID){
		utils.sendAndLog("Summon your crowd first, then you shall find me!", msg);
		return ;
	}
	memberMap = msg.guild.channels.get(voiceChannelID).members;
	
	utils.sendAndLog("Current players drafted: "+mentionMapOrList(memberMap),msg);
}

const assignTeam = (msg) => {
	if(memberMap.size===0){
		utils.sendAndLog("Drafting first, assigning next!", msg);
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
	utils.sendAndLog("Team assignment:\nTeam Blue: "+mentionMapOrList(teamB)+"\nTeam Red: "+mentionMapOrList(teamR), msg);
}

const moveIntoVC = async(msg) => {
	if(memberMap.size===0 || teamB.length===0 || teamR.length===0){
		utils.sendAndLog("Teams have not been assigned yet!", msg);
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
		utils.sendAndLog("YEET! GLHF...", msg);
	});
}

const gatherUp = async(msg) => {
	if(!inProgress){
		utils.sendAndLog("Teams are not divided yet!", msg);
		return ;
	}
	Promise.all(teamR.map( async id =>{
		await msg.guild.members.get(id).setVoiceChannel(R6BLEU);
	})).then(()=>{
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
    assignTeam,
    moveIntoVC,
    gatherUp,
    clearList,
}