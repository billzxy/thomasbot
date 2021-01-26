module.exports = {
    name: 'hide',
    description: `Toggle if any *say* command should be removed after being read`,
    emoji: ':secret:',
    execute(message) {
        let { autoDelete, setAutoDelete } = message.guild.ttsPlayer.config;
        setAutoDelete(!autoDelete);
        const msg = "Message hiding is now toggled "+( !autoDelete ? "on": "off");
        message.reply(msg);
    }
}     