player.on("error", (queue, error) => {
  console.log(`Error emitted from the queue ${error.message}`);
});

player.on("connectionError", (queue, error) => {
  console.log(`Error emitted from the connection ${error.message}`);
});

player.on("trackStart", (queue, track) => {
  if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
});

player.on("trackAdd", (queue, track) => {
});

player.on("botDisconnect", (queue) => {
  queue.metadata.send("Fui descontado do chat de voz, limpando a fila... ❌");
});

player.on("channelEmpty", (queue) => {
  queue.metadata.send("Ninguém no chat de voz, saindo... ❌");
});

player.on("queueEnd", (queue) => {
});
