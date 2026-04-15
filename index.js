const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { readdirSync } = require('fs');
const path = require('path');
const config = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message]
});

module.exports = client;

const loadEvents = (...dirs) => {
    for (const dir of dirs) {
        readdirSync(dir).filter(file => file.endsWith(".js")).forEach(file => {
            try {
                const event = require(path.join(dir, file));
                if (typeof event.execute !== 'function') return;
                const method = event.once ? 'once' : 'on';
                client[method](event.name, (...args) => event.execute(...args, client));
            } catch (err) {
                console.error(`[ERREUR] Chargement de ${file}: ${err.message}`);
            }
        });
    }
};

loadEvents(path.join(__dirname, 'events'), path.join(__dirname, 'utils'));
client.login(config.token);

process.on("unhandledRejection", (error) => {
    if (error.code === 10062 || error.code === 10008) return;
    console.error(`[ERREUR] ${error}`);
});
