const { QueryType } = require("discord-player");
const fs = require("fs");

module.exports = {
  name: "olhaeleae",
  aliases: ["oea"],
  utilisation: "{prefix}olhaeleae",
  voiceChannel: true,

  async execute(client, message, args) {
    const queue = await player.createQueue(message.guild, {
      metadata: message.channel,
      leaveOnEnd: false,
    });

    try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch {
      await player.deleteQueue(message.guild.id);
      return message.channel.send(
        `I can't join the voice channel ${message.author}... try again ? ❌`
      );
    }
    client.on("voiceStateUpdate", async (oldState, newState) => {
      const { channel: previousVoiceChannel } = oldState;
      const { channel: currentVoiceChannel, member } = newState;

      if (!member) return;
      if (!currentVoiceChannel || previousVoiceChannel === currentVoiceChannel)
        return;

      // const sounds = this.getSoundsFromSoundFolder();
      const sound = fs.readFileSync("sounds/olhaeleae.mp3");

      // this.queue.add(new QueueItem(sound, currentVoiceChannel));

      const res = await global.player.search(
        "https://www.youtube.com/watch?v=W8ab00LC-JQ",
        {
          requestedBy: member,
          searchEngine: QueryType.AUTO,
        }
      );

      // queue.connect(currentVoiceChannel);

      if (queue.tracks) queue.addTrack(res.tracks[0]);

      if (!queue.playing) await queue.play();
    });
  },
};
