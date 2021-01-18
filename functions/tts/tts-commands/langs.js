const { embed } = require('../langsEmbed');

module.exports = {
  name: 'langs',
  description: 'Display a list of the supported languages.',
  emoji: ':page_facing_up:',
  execute(message, options) {
    message.channel.send(embed);
  }
}