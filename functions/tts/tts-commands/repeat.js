module.exports = {
    name: 'repeat',
    description: `Repeat the last TTS message`,
    emoji: ':repeat:',
    execute(message) {
        const { channel } = message.member.voice;
        const { ttsPlayer, name: guildName, voice } = message.guild;
        const { lastMessage } = ttsPlayer.config;
        const connection = voice ? voice.connection : null;

        if(lastMessage===[]){
            message.reply('Last message is empty.');
            return;
        }

        if (!channel) {
            message.reply('you need to be in a voice channel first.');
            return;
        }

        if (!channel.joinable) {
            message.reply('I cannot join your voice channel.');
            return;
        }

        if (connection) {
            ttsPlayer.say(lastMessage.join(' '));
        } else {
            channel.join()
                .then(() => {
                    console.log(`Joined ${channel.name} in ${guildName}.`);
                    message.channel.send(`Joined ${channel}.`);
                    ttsPlayer.say(lastMessage.join(' '));
                })
                .catch((error) => {
                    console.error(error);
                    throw error;
                });
        }

    }
}