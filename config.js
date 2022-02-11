const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  app: {
    px: "+",
    token: process.env.TOKEN,
    playing: "by Filipe",
  },

  opt: {
    DJ: {
      enabled: false,
      roleName: "DJ",
      commands: ["volume", "olhaeleae"],
    },
    maxVol: 100,
    loopMessage: false,
    discordPlayer: {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    },
  },
};
