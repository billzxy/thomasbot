

const sendAndLog = (msg, origMsg) => {
	origMsg.channel.send(msg).then(consoleLog(origMsg)).catch(console.error);
}

const consoleLog = (msg) => {
	console.log(msg.author.username+"@"+msg.guild.name+": "+msg.content);
}

module.exports ={
    sendAndLog,
    consoleLog
}