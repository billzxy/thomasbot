const { splitToPlayable } = require('../utils');
const allowOver200 = process.env.ALLOW_OVER_200;
module.exports = {
  name: 'say',
  description: `Send a TTS message in your voice channel${allowOver200 ? '.' : ' (Up to 200 characters).'}`,
  emoji: ':speaking_head:',
  execute(message, options) {
    const { channel } = message.member.voice;
    const { ttsPlayer, name: guildName, voice } = message.guild;
    const connection = voice ? voice.connection : null;
    const [atLeastOneWord] = options.args;
    const {isExclusive, id} = options.exclusiveControl;

    if(isExclusive && message.author.id!==id){
      message.reply("Only <@"+id+"> can make me speak!");
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

    if (!atLeastOneWord) {
      message.reply('you need to specify a message.');
      return;
    }

    if (connection) {
      ttsPlayer.say(options.args.join(' '));
    } else {
      channel.join()
        .then(() => {
          console.log(`Joined ${channel.name} in ${guildName}.`);
          message.channel.send(`Joined ${channel}.`);
          ttsPlayer.say(options.args.join(' '));
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    }
  }
}