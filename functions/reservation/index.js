const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const { argv } = require('yargs');
const {MessageEmbed} = require("discord.js");
const utils = require("../utils");
const Emote = require("./emotes");

let resList = [];

const executeCommand = (args, origMsg) => {
    const parser = yargs()
        .scriptName("")
        .usage("Usage: thomas reserve <command> [options]")
        .command({ 
            command: "make [options]",
            aliases: ["make", "mk"],
            desc: ' - Make a gaming reservation/invitation',
            builder: (yargs) => {
                return yargs.option('time', {
                    alias: 't',
                    describe: " - Set the desired start time"
                }).option('game', {
                    alias: 'g',
                    describe: " - The game you wish to play"
                });
            },
            handler: argv => handleMake(argv, origMsg),
        })
        .command({ 
            command: "list [options]",
            aliases: ["list", "ls"],
            desc: ' - List all current reservations',
            handler: argv => handleList(argv, origMsg),
        })
        .command({ 
            command: "show [index]",
            aliases: ["show", "s", "info", "i"],
            desc: ' - Show info for a reservation',
            handler: argv => handleShow(argv, origMsg),
        })
        .command({ 
            command: "edit [options]",
            aliases: ["edit", "e"],
            desc: ' - Edit a reservation',
            handler: argv => handleEdit(argv, origMsg),
        })
        .command({ 
            command: "join [index]",
            aliases: ["join", "j"],
            desc: ' - Join a reservation',
            handler: argv => handleJoin(argv, origMsg),
        }).command({ 
            command: "leave [index]",
            aliases: ["leave", "l"],
            desc: ' - Leave a reservation',
            handler: argv => handleLeave(argv, origMsg),
        }).command({ 
            command: "remove [index]",
            aliases: ["remove", "rm"],
            desc: ' - Remove a reservation',
            handler: argv => handleRemove(argv, origMsg),
        })
        .example("thomas reserve make -h")
        .example("thomas reserve list -h")
        .example("thomas reserve mk --game=Siege --time=2100")
        .version(false)
        .help('h')
        .alias('h', 'help')
        .locale('en');
    
    parser.parse(hideBin(args), function (err, argv, output) {
        if (err) {console.error(err);}
        if (output){
            sendMessage(output, origMsg);
            console.log("output: ", output);
        }
    })
}

const handleMake = (argv, origMsg) => {
    const senderId = origMsg.author.id;
    const game = argv.game, time = argv.time;

    const reservation = {
        id: resList.length+1,
        game: argv.game,
        time: argv.time,
        players: []
    }
    resList.push(reservation);
    const embed = new MessageEmbed().addField(
        "New Gaming Reservation Invitation!", 
        ` <@${senderId}> would like to invite y'all to play ${game} at ${time} UTC!!\n`
        +`*This poll will be available for 1 min*\n`
        +`*if reaction is unavailable, try* thomas reserve ls, thomas reserve join [reservation index]`
        );
    sendEmbedMessageWithBinaryChoices(
        embed,
        origMsg,
        () => handleJoin({index: reservation.id}, origMsg),
        () => handleLeave({index: reservation.id}, origMsg),
        () => sendMessage(showPlayersInRes(reservation.id), origMsg)
    );
}

const handleList = (argv, origMsg) => {
    sendMessage(prettyPrint(resList), origMsg);
}

const handleShow = (argv, origMsg) => {
    const index = argv.index;
    let message;
    if(index)
        message = showPlayersInRes(index);
    else
        message = "Missing argument! You had ONE JOB, that was to specify an index!!";
    sendMessage(message, origMsg);
}

const handleEdit = (argv, origMsg) => {
    sendMessage("No one's told Thomas how to edit yet, maybe submit a pull request...", origMsg);
}

const handleRemove = (argv, origMsg) => {
    const index = argv.index;
    const res = resList[index!==0?index-1:0];
    if(!res){
        origMsg.channel.send(`Failed to remove! That reservation doesn't exist!!`);
        return;
    }
    const embed = new MessageEmbed().addField(
        "Warning!", 
        ` <@${origMsg.author.id}> you're about to remove reservation for ${res.game} at ${res.time} UTC!!\n`
        +`**ARE YOU SURE??**\n`);

    
    sendEmbedMessageWithBinaryChoices(
        embed,
        origMsg,
        () => { 
            const result = removeReservation(index);
            if(result)
                origMsg.channel.send(`Reservation ${res.game} at ${res.time} removed`);
            else
                origMsg.channel.send(`Unable to remove!`);
        },
        () => origMsg.channel.send(`Lemme know when you change your mind, later homie...`),
        () => {},
        // () => origMsg.channel.send(`Hello??? Jebait me once more, and you get banned :) `),
        10000
    );
}

const handleClear = (argv, origMsg) => {
    sendMessage("Function WIP, come back l8r..", origMsg);
} 

const handleJoin = (argv, origMsg) => {
    const userId = origMsg.author.id;
    const resIndex = argv.index!==0?argv.index-1:0;
    console.log(resIndex);
    try{
        const joinRes = joinReservation(resIndex, userId);
        if(joinRes)  
            origMsg.channel.send(`Yay! <@${userId}> is now onboard for ${resList[resIndex].game} at ${resList[resIndex].time} UTC!!`);
        else
            origMsg.channel.send(`<@${userId}> has already joined!`);
    }catch(error){
        console.log(error);
        origMsg.channel.send(`The reservation doesn't exist! Why you always make mistakes??`);
    }
}

const handleLeave = (argv, origMsg) => {
    const userId = origMsg.author.id;
    const resIndex = argv.index!==0?argv.index-1:0;
    try{
        const desertRes = desertReservation(resIndex, userId);
        if(desertRes)  
            origMsg.channel.send(`Sadge... <@${userId}> deserted ${resList[resIndex].game} at ${resList[resIndex].time} ... <:sadge:731739056811147275>`);
        else
            origMsg.channel.send(`Okay buddy, maybe next time...`);
    }catch(error){
        origMsg.channel.send(`The reservation you requested doesn't exist!`);
    }
}

const sendEmbedMessageWithBinaryChoices = (embed, origMsg, doYea, doNay, onEnd, expire=60000) => {
    origMsg.channel.send(embed).then( message => {
        message.react(Emote.getEmoteStr('yea'))
            .then(()=>message.react(Emote.getEmoteStr('nay')))
            .catch(error=>console.log("Some emojis failed to react:", error));
        
        const reactionFilter = (reaction, user) => {
            return user.id !== message.author.id && Emote.includes(reaction.emoji.id);
        };
        const collector = message.createReactionCollector(reactionFilter, { time: expire });
        collector.on('collect', (reaction, user) => {
            console.log(`${user.username} reacted with ${reaction.emoji.identifier}`);
            if(Emote.equalsEmoteId("yea", reaction.emoji.id))
                doYea();
            else
                doNay();
        });
        collector.on('end', collected => onEnd());
    });
}

const joinReservation = (index, userId) => {
    let playerList;
    try{
        playerList = resList[index].players;
    }catch(error){
        throw error;
    }
    if(playerList.includes(userId))
        return false;
    else{
        playerList.push(userId);
        return true;
    }
}

const desertReservation = (index, userId) => {
    let playerList;
    try{
        playerList = resList[index].players;
    }catch(error){
        throw error;
    }
    let i = playerList.indexOf(userId);
    if(i>-1){
        playerList.splice(i, 1);
        return true;
    }
    else
        return false;
}

const removeReservation = (index) => {
    if(index>-1){
        resList.splice(index-1, 1);
        return true;
    }else{
        return false;
    }
}

const showPlayersInRes = (index) => {
    let playerList, reservation = resList[index!==0?index-1:0];
    try{
        playerList = reservation.players;
    }catch(error){
        return `The reservation you requested doesn't exist!`;
    }
    let message = `${reservation.game} at ${reservation.time} \n`;
    if(playerList===[] || playerList.length===0){
        message += ` No players yet \n type *thomas reserve join ${reservation.id}* to join`;
        return message;
    }   
    message += `Current players: \n`;
    playerList.forEach(playerId => 
        message += `<@${playerId}>`
    );
    return message;
}


const prettyPrint = list => {
    if(list.length===0 || list===[])
        return "No reservations currently... Get some help:\n *thomas reserve make -h*";
    let stri = "All current reservations: \n";
    let counter = 1;
    // for(let res of list){
    //     stri += ` ${counter++}.  ${res.game}  -  ${res.time} [${res.players.length} joined] \n`;
    // }
    list.forEach(res => stri += ` ${counter++}.  ${res.game}  -  ${res.time} [${res.players.length} joined] \n`);
    return stri;
}

const sendMessage = (output, origMsg) => {
    const message = output ? output : "There's a problem with your command, try adding -h";
    const embed = new MessageEmbed()
        .addField("THOMAS Reservation Menu:",message);
    utils.sendAndLog(embed, origMsg);
}

module.exports = (args, origMsg) => { executeCommand(args, origMsg); }