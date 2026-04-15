const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, MessageFlags } = require('discord.js');
const transcript = require('discord-html-transcripts');
const config = require('../config');
const { userPerms, staffPerms, everyoneDeny } = require('./perms');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if (!interaction.isButton()) return;
        if (!['fermer', 'oui', 'non'].includes(interaction.customId)) return;

        const channel = interaction.channel ?? await client.channels.fetch(interaction.channelId).catch(() => null);
        if (!channel) return;

        // Vérifier que c'est bien un canal de ticket pour éviter les conflits de customId globaux
        if (!channel.topic?.match(/\(ID: \d+\)/)) return;

        const avatarURL = client.user.displayAvatarURL();

        if (interaction.customId === 'fermer') {
            try {
                // Répondre en premier pour respecter le délai de 3 secondes de Discord
                await interaction.reply({
                    content: `**${config.emoji_Soon_attente} | Êtes-vous sûr de vouloir supprimer le ticket ?**`,
                    flags: MessageFlags.Ephemeral
                });

                await channel.edit({
                    permissionOverwrites: [
                        {
                            id: config.Role_proprietaire,
                            allow: staffPerms,
                            deny: [PermissionFlagsBits.MentionEveryone]
                        },
                        {
                            id: interaction.guild.id,
                            deny: everyoneDeny
                        }
                    ]
                }).catch(err => console.error(`[ERREUR] Modification permissions fermeture: ${err.message}`));

                await channel.send({
                    embeds: [{
                        color: 0x992d22,
                        thumbnail: { url: avatarURL },
                        author: {
                            name: `・Système de ticket.`,
                            icon_url: avatarURL
                        },
                        description: '**Le ticket sera clôturé.\nSouhaitez-vous la transcription de celui-ci ?**',
                        timestamp: new Date(),
                        footer: {
                            text: 'By: MatgordFR ©',
                            icon_url: avatarURL,
                        }
                    }],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('oui').setLabel('Oui').setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId('non').setLabel('Non').setStyle(ButtonStyle.Danger)
                        )
                    ]
                }).catch(err => console.error(`[ERREUR] Envoi boutons clôture: ${err.message}`));
            } catch (err) {
                console.error(`[ERREUR] Fermeture du ticket: ${err.message}`);
            }
        }

        else if (interaction.customId === 'oui') {
            await interaction.deferUpdate();
            const ticket_logs = client.channels.cache.get(config.Salon_ticket_logs);
            if (!ticket_logs) return console.error(`[ERREUR] Salon de logs introuvable (ID: ${config.Salon_ticket_logs})`);

            try {
                const topicText = channel.topic ?? '';
                const userIdMatch = topicText.match(/\(ID: (\d+)\)/);
                const ticketOwnerId = userIdMatch?.[1];
                const ownerValue = ticketOwnerId ? `<@${ticketOwnerId}>` : 'Inconnu';

                const transcriptFile = await transcript.createTranscript(channel);

                const logMsg = await ticket_logs.send({
                    embeds: [{
                        color: 0x992d22,
                        thumbnail: { url: avatarURL },
                        author: {
                            name: `・Logs de ticket.`,
                            icon_url: avatarURL
                        },
                        description: `**Nouveau ticket clôturé.**`,
                        fields: [
                            { name: '📌・Nom du ticket', value: channel.name },
                            { name: '🎫・Propriétaire', value: ownerValue, inline: true },
                            { name: '👤・Staff', value: `${interaction.user}`, inline: true }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: 'By: MatgordFR ©',
                            icon_url: avatarURL,
                        }
                    }]
                });

                try {
                    const thread = await logMsg.startThread({ name: `📋 ${channel.name}`, autoArchiveDuration: 60 });
                    const fileMsg = await thread.send({ files: [transcriptFile] });
                    const cdnUrl = fileMsg.attachments.first()?.url;
                    await thread.setArchived(true).catch(() => {});

                    if (cdnUrl) {
                        await logMsg.edit({
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder().setLabel('🔗 Direct Link').setURL(cdnUrl).setStyle(ButtonStyle.Link)
                                )
                            ]
                        });
                    }
                } catch (e) {
                    console.error(`[ERREUR] Thread transcript: ${e.message}`);
                    await ticket_logs.send({ files: [transcriptFile] }).catch(() => {});
                }

                await channel.delete();
            } catch (err) {
                console.error(`[ERREUR] Clôture du ticket: ${err.message}`);
            }
        }

        else if (interaction.customId === 'non') {
            await interaction.deferUpdate();

            try {
                const topicText = channel.topic ?? '';
                const userIdMatch = topicText.match(/\(ID: (\d+)\)/);
                const ticketOwnerId = userIdMatch?.[1];

                const overwrites = [
                    { id: interaction.guild.id, deny: everyoneDeny },
                    { id: config.Role_proprietaire, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] }
                ];

                if (topicText.includes('Partenariat')) {
                    overwrites.push({ id: config.Role_responsable_partner, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] });
                } else if (topicText.includes('Récompense Giveaway')) {
                    overwrites.push({ id: config.Role_responsable_giveaway, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] });
                } else {
                    overwrites.push({ id: config.Role_staff, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] });
                }

                if (ticketOwnerId) {
                    overwrites.push({
                        id: ticketOwnerId,
                        allow: userPerms,
                        deny: [PermissionFlagsBits.MentionEveryone]
                    });
                }

                await channel.edit({ permissionOverwrites: overwrites });

                await channel.send({
                    embeds: [{
                        color: 0x2ecc71,
                        author: {
                            name: `🔖・Système de ticket.`,
                            icon_url: avatarURL
                        },
                        description: `**La fermeture du ticket a été annulée par ${interaction.user}.**`,
                        timestamp: new Date(),
                        footer: {
                            text: 'By: MatgordFR ©',
                            icon_url: avatarURL,
                        }
                    }]
                });
            } catch (err) {
                console.error(`[ERREUR] Annulation fermeture ticket: ${err.message}`);
            }
        }
    }
};
