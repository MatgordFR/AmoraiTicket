const { ActionRowBuilder, ChannelType, StringSelectMenuBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if (!interaction.isButton() || interaction.customId !== 'ticket') return;

        const alreadySelecting = interaction.guild.channels.cache.find(
            c => c.topic === `selection-${interaction.user.id}`
        );
        if (alreadySelecting) {
            return interaction.reply({
                content: `**${config.emoji_Soon_attente} | Vous avez déjà un canal de sélection ouvert : ${alreadySelecting}.**`,
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const c = await interaction.guild.channels.create({
                name: `📜・Ticket de sélection ${interaction.user.username}`,
                topic: `selection-${interaction.user.id}`,
                type: ChannelType.GuildText,
                parent: config.ticket_category,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
                        deny: [PermissionFlagsBits.MentionEveryone, PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.MentionEveryone]
                    }
                ]
            });

            const avatarURL = client.user.displayAvatarURL();
            await c.send({
                embeds: [{
                    color: 0x82000D,
                    thumbnail: { url: avatarURL },
                    author: {
                        name: `🔖・Système de sélection de ticket.`,
                        icon_url: avatarURL
                    },
                    description: `**Veuillez sélectionner une catégorie ${interaction.user} pour votre ticket !**\n\n\`Veuillez vous assurer d'ouvrir le ticket correct après avoir cliqué, s'il vous plaît.\``,
                    timestamp: new Date(),
                    footer: {
                        text: 'By: MatgordFR ©',
                        icon_url: avatarURL,
                    },
                }],
                components: [
                    new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('category')
                            .setPlaceholder('Choisir une catégorie')
                            .addOptions([
                                { label: '・Rapport & plainte', value: 'report', emoji: config.ticket_report },
                                { label: '・Partenariat & échange de pub', value: 'Partenariat', emoji: config.ticket_partenariat },
                                { label: '・Question', value: 'question', emoji: config.ticket_question },
                                { label: '・Récompense Giveaway', value: 'giveaway', emoji: config.ticket_giveaway },
                            ])
                    )
                ]
            });

            c.send({ content: `${interaction.user}` })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 1000))
                .catch(() => {});

            await interaction.editReply({
                content: `**${config.emoji_Soon_actif} | La création de votre ticket a été effectuée.**`
            });
        } catch (err) {
            console.error(`[ERREUR] Création du canal de sélection: ${err}`);
            await interaction.editReply({
                content: `**${config.emoji_Soon_attente} | Une erreur est survenue lors de la création du canal.**`
            }).catch(() => {});
        }
    }
};
