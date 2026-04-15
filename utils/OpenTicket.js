const { ActionRowBuilder, ChannelType, ButtonBuilder, ButtonStyle, PermissionFlagsBits, MessageFlags } = require('discord.js');
const config = require('../config');
const { userPerms, staffPerms, everyoneDeny } = require('./perms');

const closeButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('fermer').setLabel('Fermer').setStyle(ButtonStyle.Danger)
);

const TICKET_TYPES = {
    report: {
        topic: (user) => `${config.ticket_report}🎫・Ticket Rapport & plainte de ${user.username} - (ID: ${user.id})`,
        color: 0x992d22,
        description: (user) => `**Bienvenue sur votre ticket \`Rapport & plainte\` ${user}.\nUn membre du personnel sera disponible pour vous aider dès que possible.**`,
        ping: `|| <@&${config.Role_proprietaire}> ||`,
        extraPerms: [{ id: config.Role_staff, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] }]
    },
    Partenariat: {
        topic: (user) => `${config.ticket_partenariat}🎫・Ticket Partenariat & échange de pub de ${user.username} - (ID: ${user.id})`,
        color: 0x71368a,
        description: (user) => `**Bienvenue sur votre ticket \`Partenariat & échange de pub\` ${user}.\nUn membre du personnel sera disponible pour vous aider dès que possible.**\n\n\`Afin de consulter nos conditions de partenariat\``,
        ping: `|| <@&${config.Role_responsable_partner}> ||`,
        extraPerms: [
            { id: config.Role_proprietaire, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] },
            { id: config.Role_responsable_partner, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] }
        ]
    },
    question: {
        topic: (user) => `${config.ticket_question}🎫・Ticket Question de ${user.username} - (ID: ${user.id})`,
        color: 0xfee75c,
        description: (user) => `**Bienvenue sur votre ticket \`Question\` ${user}.\nUn membre du personnel sera disponible pour vous aider dès que possible.**\n\n\`Veuillez formuler votre question s'il vous plaît.\``,
        ping: `|| <@&${config.Role_proprietaire}> ||`,
        extraPerms: [{ id: config.Role_staff, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] }]
    },
    giveaway: {
        topic: (user) => `${config.ticket_giveaway}🎫・Ticket Récompense Giveaway de ${user.username} - (ID: ${user.id})`,
        color: 0x1f8b4c,
        description: (user) => `**Bienvenue sur votre ticket \`Récompense Giveaway\` ${user}.\nUn membre du personnel sera disponible pour vous aider dès que possible.**\n\n\`Veuillez formuler votre message avec vos récompenses s'il vous plaît\``,
        ping: `|| <@&${config.Role_responsable_giveaway}> ||`,
        extraPerms: [{ id: config.Role_responsable_giveaway, allow: staffPerms, deny: [PermissionFlagsBits.MentionEveryone] }]
    }
};

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if (!interaction.isStringSelectMenu() || interaction.customId !== 'category') return;

        const alreadyOpen = interaction.guild.channels.cache.find(
            c => c.topic?.includes(interaction.user.id) && !c.topic?.startsWith('selection-')
        );
        if (alreadyOpen) {
            return interaction.reply({
                content: `**${config.emoji_Soon_attente} | Vous avez déjà un ticket ouvert.**`,
                flags: MessageFlags.Ephemeral
            });
        }

        const type = TICKET_TYPES[interaction.values[0]];
        if (!type) return;

        await interaction.deferUpdate();

        const selectionChannel = interaction.channel;

        try {
            const c = await interaction.guild.channels.create({
                name: `🎫・Ticket de ${interaction.user.username}`,
                topic: type.topic(interaction.user),
                type: ChannelType.GuildText,
                parent: config.ticket_category,
                permissionOverwrites: [
                    { id: interaction.user.id, allow: userPerms, deny: [PermissionFlagsBits.MentionEveryone] },
                    ...type.extraPerms,
                    { id: interaction.guild.id, deny: everyoneDeny }
                ]
            });

            const avatarURL = client.user.displayAvatarURL();
            await selectionChannel.delete();

            await c.send({
                embeds: [{
                    color: type.color,
                    author: {
                        name: `・Système de ticket.`,
                        icon_url: avatarURL
                    },
                    description: type.description(interaction.user),
                    timestamp: new Date(),
                    footer: {
                        text: 'By: MatgordFR ©',
                        icon_url: avatarURL,
                    }
                }],
                content: type.ping,
                components: [closeButton]
            });

            c.send({ content: `${interaction.user}` })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 1000))
                .catch(() => {});
        } catch (err) {
            console.error(`[ERREUR] Création du ticket: ${err}`);
        }
    }
};
