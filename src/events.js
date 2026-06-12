const { GuildQueueEvent } = require("discord-player");

player.events.on(GuildQueueEvent.Error, (queue, error) => {
  console.log(`Error emitted from the queue ${error.message}`);
});

player.events.on(GuildQueueEvent.PlayerError, (queue, error) => {
  console.log(`Error emitted from the connection ${error.message}`);
});

player.events.on(GuildQueueEvent.PlayerStart, (queue, track) => {
  if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
});

player.events.on(GuildQueueEvent.AudioTrackAdd, (queue, track) => {
});

player.events.on(GuildQueueEvent.Disconnect, (queue) => {
  client.olhaeleaeWatchers.delete(queue.guild.id);
  queue.metadata?.channel?.send("Fui desconectado do chat de voz, limpando a fila... ❌");
});

player.events.on(GuildQueueEvent.EmptyChannel, (queue) => {
  client.olhaeleaeWatchers.delete(queue.guild.id);
  queue.metadata?.channel?.send("Ninguém no chat de voz, saindo... ❌");
});

player.events.on(GuildQueueEvent.EmptyQueue, (queue) => {
});
