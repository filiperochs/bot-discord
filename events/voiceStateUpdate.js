const path = require("path");
const { QueryType } = require("discord-player");

const SOUND_PATH = path.join(__dirname, "..", "sounds", "olhaeleae.mp3");

module.exports = async (client, oldState, newState) => {
  const { channel: previousChannel } = oldState;
  const { channel: currentChannel, member } = newState;

  if (!member || member.user.bot) return;
  if (!currentChannel || previousChannel?.id === currentChannel.id) return;

  const watcher = client.olhaeleaeWatchers.get(newState.guild.id);
  if (!watcher || currentChannel.id !== watcher.channelId) return;

  await player.play(currentChannel, SOUND_PATH, {
    searchEngine: QueryType.FILE,
    nodeOptions: {
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 30000,
      leaveOnEnd: false,
      metadata: { channel: watcher.channel },
    },
  });
};
