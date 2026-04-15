const { EmbedBuilder, ActivityType, PresenceUpdateStatus } = require('discord.js');
const config = require('../config');
const sendTicketMessage = require('../utils/TicketMessage');

module.exports = {
    name: 'clientReady',
    once: true,
    execute: async (client) => {
        console.log(`
                               #     #                                          ####### ######
                               ##   ##   ##   #####  ####   ####  #####  #####  #       #     #
                               # # # #  #  #    #   #    # #    # #    # #    # #       #     #
                               #  #  # #    #   #   #      #    # #    # #    # #####   ######
                               #     # ######   #   #  ### #    # #####  #    # #       #   #
                               #     # #    #   #   #    # #    # #   #  #    # #       #    #
                               #     # #    #   #    ####   ####  #    # #####  #       #     #

                                                   Crée par MatgordFR!
                                                     © 2026 Matgord, Inc.

                                             Github: https://github.com/MatgordFR
                                               X : https://x.com/matgordfr
        `);

        console.log(`Connecté: ${client.user.username} (${client.user.id})`);

        const avatarURL = client.user.displayAvatarURL();

        const demarrerEmbed = new EmbedBuilder()
            .setColor(config.color_principal)
            .setThumbnail(avatarURL)
            .setAuthor({ name: `${client.user.username} vient de redémarrer`, iconURL: avatarURL })
            .addFields(
                { name: '👥 Utilisateurs', value: `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`, inline: true }
            )
            .setFooter({ text: `By: MatgordFR ©`, iconURL: avatarURL })
            .setTimestamp();

        const salon = client.channels.cache.get(config.logs_redémarrer_bot);
        if (salon) {
            salon.send({ embeds: [demarrerEmbed] }).catch(err => console.error(`[ERREUR] Salon de logs: ${err.message}`));
        } else {
            console.warn(`[ATTENTION] Salon de logs introuvable (ID: ${config.logs_redémarrer_bot})`);
        }

        const status = [
            { name: `By: MatgordFR ©`, type: ActivityType.Watching },
            { name: `By: MatgordFR ©`, type: ActivityType.Listening },
            { name: `By: MatgordFR ©`, type: ActivityType.Competing },
            { name: `By: MatgordFR ©`, type: ActivityType.Playing },
        ];

        let statusIndex = 0;
        client.user.setStatus(PresenceUpdateStatus.Idle);
        client.user.setActivity(status[statusIndex]);

        setInterval(() => {
            statusIndex = (statusIndex + 1) % status.length;
            client.user.setActivity(status[statusIndex]);
        }, 20000);

        await sendTicketMessage(client);
    }
};
