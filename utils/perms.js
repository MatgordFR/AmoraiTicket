const { PermissionFlagsBits } = require('discord.js');

const userPerms = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.UseExternalEmojis
];

const staffPerms = [...userPerms, PermissionFlagsBits.ManageMessages];

const everyoneDeny = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.MentionEveryone
];

module.exports = { userPerms, staffPerms, everyoneDeny };
