const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");
const { Client, GatewayIntentBits } = require("discord.js");

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  allowedMentions: { parse: ["users", "roles"] },
});

client.config = require("./config");
client.olhaeleaeWatchers = new Map();

global.player = new Player(client, client.config.opt.discordPlayer);

require("./src/loader");
require("./src/events");

(async () => {
  await player.extractors.loadMulti(DefaultExtractors);
  await client.login(client.config.app.token);
})();
