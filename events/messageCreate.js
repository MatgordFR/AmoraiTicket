const config = require('../config');

module.exports = {
    name: 'messageCreate',
    once: false,
    execute: (message, client) => {
        if (message.author.bot) return;
        if (!message.mentions.has(client.user)) return;

        message.reply(`**${config.emoji_Bot} Je suis un système de ticket. Rendez-vous dans <#${config.ticket_channel}> pour ouvrir un ticket.**`).catch(() => {});
    }
};
