module.exports = {
  app: {
    px: "+",
    token: "OTQxNDY4MTQ5MzczNjI4NDY4.YgWYig.t-Z_ZiUwtdh5aYqiMQ4MryqvoJs",
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
