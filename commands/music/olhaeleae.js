module.exports = {
  name: "olhaeleae",
  aliases: ["oea"],
  utilisation: "{prefix}olhaeleae",
  voiceChannel: true,

  async execute(client, message, args) {
    const voiceChannel = message.member.voice.channel;

    client.olhaeleaeWatchers.set(message.guild.id, {
      channelId: voiceChannel.id,
      channel: message.channel,
    });

    return message.channel.send(
      `Tô de olho! 👀 Quando alguém entrar em **${voiceChannel.name}**, eu toco o som.`
    );
  },
};
