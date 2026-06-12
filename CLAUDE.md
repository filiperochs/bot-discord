# bot-discord-olhaeleae

Bot pessoal de Discord cuja função principal é tocar o meme de áudio
**"Olha ele aê"** (arquivo local `sounds/olhaeleae.mp3`) no canal de voz
sempre que um novo membro entra no mesmo canal de voz onde o bot foi "armado"
com o comando `+olhaeleae`.

Listado no top.gg: https://top.gg/bot/941468149373628468

## Stack

- **Node.js** (requer `>= 18`, instalado localmente: v22.17.0) + **CommonJS**
  (`require`/`module.exports`)
- **discord.js** `^14.26.4`
- **discord-player** `^7.2.0` + **`@discord-player/extractor`** `^7.2.0`
  (fornece `DefaultExtractors`/`AttachmentExtractor`, usado para tocar o mp3
  local via `QueryType.FILE`) + **`mediaplex`** `^1.0.0` (encoder/decoder
  Opus, vem no lugar do antigo `opusscript`)
- `dotenv`, `ffmpeg-static`
- Dev: `nodemon` (script `start`)
- Gerenciador de pacotes: **yarn** (existe `yarn.lock`)

## Como rodar

```sh
yarn install
yarn start   # roda `nodemon main.js`
```

Requer um arquivo `.env` na raiz com:
```
TOKEN=SEU_TOKEN_DO_BOT
```

**Importante**: no [Discord Developer Portal](https://discord.com/developers/applications),
aba "Bot" da aplicação, é preciso habilitar os intents privilegiados
**"Message Content Intent"** e **"Server Members Intent"**. Sem isso o login
falha com `Used disallowed intents` (o código já pede
`GatewayIntentBits.MessageContent` e `GatewayIntentBits.GuildMembers`).

## Estrutura do projeto

```
main.js                  # entrypoint
config.js                # config real (lida .env via dotenv)
src/
  loader.js              # carrega events/ e commands/ dinamicamente
  events.js              # listeners do Player (discord-player, GuildQueueEvent)
events/
  ready.js               # client "ready": loga info e seta o "playing" status
  messageCreate.js        # parser de comandos por prefixo
  voiceStateUpdate.js     # dispara o meme quando alguém entra no canal "armado"
commands/
  music/
    olhaeleae.js          # comando principal: "arma" o gatilho do meme
    volume.js              # comando de volume da fila
sounds/
  olhaeleae.mp3            # áudio tocado via AttachmentExtractor (QueryType.FILE)
```

## Fluxo de inicialização (`main.js`)

1. Cria `global.client` (discord.js `Client`) com intents: `Guilds`,
   `GuildMembers`, `GuildMessages`, `GuildVoiceStates`, `MessageContent`
   (os dois últimos são privilegiados, ver seção acima) e
   `allowedMentions: { parse: ["users", "roles"] }` (sem pings de
   @everyone/@here).
2. `client.config = require("./config")` (lê `config.js`, que usa `.env`).
3. `client.olhaeleaeWatchers = new Map()` — estado em memória
   (`guildId -> { channelId, channel }`) usado para saber em qual canal de
   voz, de qual servidor, o bot deve disparar o meme, e em qual canal de
   texto enviar avisos.
4. Cria `global.player = new Player(client, client.config.opt.discordPlayer)`.
5. `require("./src/loader")`:
   - Lê `events/*.js`, registra cada um como `client.on(<nomeDoArquivo>, handler)`
     (inclui o novo `voiceStateUpdate.js`).
   - Lê `commands/<categoria>/*.js`, registra cada comando em
     `client.commands` (chave = `command.name.toLowerCase()`).
6. `require("./src/events")`: registra listeners do `player.events`
   (`GuildQueueEvent`: `Error`, `PlayerError`, `PlayerStart`, `AudioTrackAdd`,
   `Disconnect`, `EmptyChannel`, `EmptyQueue`).
7. `await player.extractors.loadMulti(DefaultExtractors)` — carrega os
   extractors padrão do discord-player v7 (necessário para
   `AttachmentExtractor`/`QueryType.FILE`).
8. `client.login(token)`.

## Configuração (`config.js`)

```js
app: { px: "+", token: process.env.TOKEN, playing: "filiperochs.github.io" }
opt: {
  DJ: { enabled: false, roleName: "DJ", commands: ["volume", "olhaeleae"] },
  maxVol: 100,
  loopMessage: false,
  discordPlayer: {},
}
```

- Prefixo de comando atual: **`+`** (ex.: `+olhaeleae`, `+volume 50`).
- DJ role gating está **desabilitado** (`DJ.enabled: false`).

## Comandos (`commands/`)

Cada comando exporta `{ name, aliases?, utilisation, voiceChannel?, execute(client, message, args) }`.

- **`olhaeleae`** (alias `oea`) — `commands/music/olhaeleae.js`
  - Requer que o autor esteja em um canal de voz (`voiceChannel: true`).
  - Não conecta nem toca nada na hora: apenas grava em
    `client.olhaeleaeWatchers` o canal de voz do autor + o canal de texto
    onde o comando foi chamado, e confirma "Tô de olho! 👀".
  - A reprodução real acontece em `events/voiceStateUpdate.js`.
- **`volume`** (alias `vol`) — `commands/music/volume.js`
  - Requer fila tocando (`queue.node.isPlaying()`); valida número entre 1 e
    `maxVol` (100); ajusta com `queue.node.setVolume(vol)`
    (`queue = player.nodes.get(guildId)`).

## Eventos (`events/`)

- **`ready.js`**: loga quantidade de servidores/usuários e define o status
  "Jogando `client.config.app.playing`".
- **`messageCreate.js`**: parser de comandos
  - Ignora bots e DMs.
  - Exige prefixo `client.config.app.px`.
  - Resolve comando por nome ou alias em `client.commands`.
  - Se `DJ.enabled` e o comando estiver em `DJ.commands`, exige o cargo "DJ"
    (`message.member.roles.cache.has(roleDJ.id)`).
  - Se `cmd.voiceChannel`, exige que o autor esteja em um canal de voz (e, se
    o bot já estiver em um canal — `message.guild.members.me.voice.channel` —
    que seja o mesmo).
  - Executa `cmd.execute(client, message, args)`.
- **`voiceStateUpdate.js`** (novo): para cada mudança de estado de voz,
  ignora bots e quem não entrou de fato em um canal novo. Se
  `client.olhaeleaeWatchers` tiver um watcher para a guild cujo
  `channelId` bate com o canal que o membro acabou de entrar, chama
  `player.play(currentChannel, sounds/olhaeleae.mp3, { searchEngine: QueryType.FILE, nodeOptions: { leaveOnEmpty: true, leaveOnEnd: false, metadata: { channel: watcher.channel } } })`.

## `src/events.js` (eventos do Player/discord-player v7)

Usa `player.events.on(GuildQueueEvent.X, ...)`:
- `Error` / `PlayerError`: loga erros no console.
- `PlayerStart`: no-op relacionado a `loopMessage` (igual ao comportamento
  anterior).
- `AudioTrackAdd`: no-op.
- `Disconnect` / `EmptyChannel`: removem o watcher da guild em
  `client.olhaeleaeWatchers` e enviam "Fui desconectado..."/"Ninguém no chat
  de voz, saindo..." para `queue.metadata.channel`.
- `EmptyQueue`: no-op.

## Notas

- O áudio do meme é 100% local (`sounds/olhaeleae.mp3`), não depende mais de
  YouTube/streaming — discord-player v7 descontinuou oficialmente o playback
  via YouTube.
- `config.json` (arquivo legado, não usado, com token em texto plano) foi
  removido.
