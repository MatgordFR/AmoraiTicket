const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const bannerImage = new AttachmentBuilder(path.join(__dirname, '../image/discord.png'));
const config = require('../config');

module.exports = async (client) => {
    const channel = client.channels.cache.get(config.ticket_channel);
    if (!channel) return console.warn(`[ATTENTION] Canal ticket introuvable (ID: ${config.ticket_channel})`);

    // Supprimer les anciens messages du bot pour éviter le spam au redémarrage
    try {
        const messages = await channel.messages.fetch({ limit: 50 });
        const botMessages = messages.filter(m => m.author.id === client.user.id);
        if (botMessages.size > 0) {
            await channel.bulkDelete(botMessages).catch(() => {
                botMessages.forEach(m => m.delete().catch(() => {}));
            });
        }
    } catch (err) {
        console.error(`[ERREUR] Nettoyage canal ticket: ${err.message}`);
    }

    const avatarURL = client.user.displayAvatarURL();

    channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(config.color_principal)
                .setAuthor({ name: `・Contacter le support du serveur.`, iconURL: avatarURL })
                .setDescription(`**Pour créer un ticket, il vous suffit de __cliquer sur le bouton__.\n\n\`Veillez à ouvrir le bon ticket, s'il vous plaît.\`**`)
                .setImage('attachment://discord.png')
                .setFooter({ text: `By: MatgordFR ©`, iconURL: avatarURL })
        ],
        files: [bannerImage],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('ticket').setLabel('🎟️ Ouvrir un ticket').setStyle(ButtonStyle.Primary)
            )
        ]
    }).catch(err => console.error(`[ERREUR] TicketMessage: ${err}`));
};
