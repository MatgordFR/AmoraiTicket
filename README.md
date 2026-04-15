<div align="center">

# 🎫 AmoraiTicket

### 🎟️ Un bot Discord de gestion de tickets avec transcription automatique

<div align="center">
    <a href="https://discord.com/users/689890476811354242">
        <img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white"/>
    </a>
    <a href="https://x.com/matgordfr">
        <img src="https://img.shields.io/badge/X-%23000000.svg?style=for-the-badge&logo=X&logoColor=white"/>
    </a>
    <a href="https://github.com/MatgordFR">
        <img src="https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/>
    </a>
</div>

</div>

---

## 🌟 Présentation

**AmoraiTicket** est un bot Discord de gestion de tickets. Il permet aux membres d'ouvrir un ticket par catégorie, génère une transcription HTML complète à la fermeture et envoie les logs dans un salon dédié.

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🎟️ **Panneau de ticket** | Embed avec bouton d'ouverture dans un salon dédié |
| 📜 **Sélection de catégorie** | Menu déroulant dans un canal temporaire privé |
| 📁 **4 types de tickets** | Rapport & plainte, Partenariat, Question, Récompense Giveaway |
| 🔒 **Permissions automatiques** | Chaque ticket configure ses propres droits d'accès |
| 📋 **Transcription HTML** | Générée et hébergée sur le CDN Discord à la fermeture |
| 📩 **Logs de fermeture** | Embed avec propriétaire, staff et lien direct vers la transcription |
| 🔁 **Nettoyage au redémarrage** | Supprime l'ancien panneau et en envoie un nouveau |
| 🎭 **Statut rotatif** | Alterne entre les types d'activité Discord toutes les 20 secondes |
| 📡 **Embed de démarrage** | Notifie le salon de logs lors de chaque redémarrage |

---

## 🗂️ Structure du projet

```
📁 AmoraiTicket/
├── 📄 index.js                  ← Point d'entrée, chargement des events
├── 🔧 config.json               ← Token, IDs Discord et configuration
├── 📦 package.json              ← Dépendances et script de démarrage
├── 📖 README.md                 ← Ce fichier
├── 📁 events/
│   ├── ✅ ready.js              ← Embed de démarrage + statut + panneau ticket
│   └── 💬 messageCreate.js     ← Réponse aux mentions du bot
├── 📁 utils/
│   ├── 🎫 TicketMessage.js     ← Envoi du panneau de ticket
│   ├── 📜 SelectTicket.js      ← Création du canal de sélection
│   ├── 🎟️ OpenTicket.js        ← Création du canal de ticket
│   ├── 🗑️ DeleteTicket.js      ← Fermeture, transcription et suppression
│   └── 🔒 perms.js             ← Permissions Discord partagées
└── 📁 image/
    └── 🖼️ discord.png          ← Bannière du panneau de ticket
```

---

## 📦 Installation

### 1️⃣ Prérequis

Avant de commencer, assure-toi d'avoir :

- ✅ [Node.js v18+](https://nodejs.org/) installé
- ✅ Un bot Discord créé sur le [Discord Developer Portal](https://discord.com/developers/applications)
- ✅ Les **Privileged Gateway Intents** activés : `Message Content Intent`

> 💡 **Permissions Discord requises pour le bot** — `View Channels`, `Send Messages`, `Manage Channels`, `Manage Messages`, `Read Message History`, `Embed Links`, `Attach Files`, `Use External Emojis`

---

### 2️⃣ Installer les dépendances

```bash
npm install
```

Cela installe automatiquement :

| Package | Rôle |
|---|---|
| `discord.js` | Librairie principale pour interagir avec l'API Discord |
| `discord-html-transcripts` | Génération de transcriptions HTML des salons |

---

## 🔧 Configuration

Modifie le fichier `config.json` avec tes propres valeurs :

```json
{
    "token": "TON_TOKEN_ICI",

    "color_principal": "72223d",

    "ticket_channel": "ID_DU_SALON_TICKET",
    "ticket_category": "ID_DE_LA_CATEGORIE",
    "Salon_ticket_logs": "ID_DU_SALON_LOGS_TICKETS",
    "logs_redémarrer_bot": "ID_DU_SALON_LOGS_BOT",

    "Role_proprietaire": "ID_DU_ROLE_PROPRIO",
    "Role_staff": "ID_DU_ROLE_STAFF",
    "Role_responsable_giveaway": "ID_DU_ROLE_GIVEAWAY",
    "Role_responsable_partner": "ID_DU_ROLE_PARTENARIAT",

    "ticket_report": "🚨",
    "ticket_partenariat": "🤝",
    "ticket_question": "❓",
    "ticket_giveaway": "🎁",

    "emoji_Bot": "🤖",
    "emoji_Soon_actif": "✅",
    "emoji_Soon_attente": "⏳"
}
```

> ⚠️ **Ne partage jamais ton `token` publiquement !** Ajoute `config.json` dans ton `.gitignore`.

| Clé | Description |
|---|---|
| `token` | Token de ton bot Discord |
| `color_principal` | Couleur principale des embeds (hex sans `#`) |
| `ticket_channel` | Salon où le panneau d'ouverture est envoyé |
| `ticket_category` | Catégorie où les canaux de ticket sont créés |
| `Salon_ticket_logs` | Salon où les logs de fermeture sont envoyés |
| `logs_redémarrer_bot` | Salon où l'embed de redémarrage est envoyé |
| `Role_proprietaire` | Rôle avec accès complet à tous les tickets |
| `Role_staff` | Rôle staff avec accès aux tickets standards |
| `Role_responsable_giveaway` | Rôle accédant aux tickets giveaway |
| `Role_responsable_partner` | Rôle accédant aux tickets partenariat |

---

## ▶️ Lancer le bot

```bash
npm start
```

Au démarrage, le bot va :
1. 🔗 Se connecter à Discord
2. 📩 Envoyer un embed de démarrage dans le salon de logs
3. 🎭 Activer le statut rotatif
4. 🎫 Supprimer l'ancien panneau de ticket et en envoyer un nouveau

---

## 🎟️ Fonctionnement des tickets

```
Membre clique "Ouvrir un ticket"
        ↓
Canal de sélection créé (privé, menu déroulant)
        ↓
Membre choisit une catégorie
        ↓
Canal de ticket créé → Canal de sélection supprimé
        ↓
Staff clique "Fermer"
        ↓
Confirmation : Oui (avec transcription) / Non (annulation)
        ↓
[Oui] → Transcription HTML générée → Envoyée dans les logs → Canal supprimé
```

### 📁 Types de tickets

| Type | Emoji | Accès staff |
|---|---|---|
| Rapport & plainte | 🚨 | `Role_staff` |
| Partenariat & échange de pub | 🤝 | `Role_responsable_partner` |
| Question | ❓ | `Role_staff` |
| Récompense Giveaway | 🎁 | `Role_responsable_giveaway` |

---

## ⚠️ Dépannage

| Problème | Solution |
|---|---|
| `Cannot find module` | Relance `npm install` |
| Panneau de ticket non envoyé | Vérifie `ticket_channel` dans `config.json` |
| Le bot ne répond pas aux mentions | Vérifie que l'intent `Message Content` est activé |
| Transcription non envoyée | Vérifie les permissions du bot dans `Salon_ticket_logs` |
| Canaux de ticket non créés | Vérifie que `ticket_category` est correct et que le bot a `Manage Channels` |
| Embed de démarrage absent | Vérifie `logs_redémarrer_bot` dans `config.json` |

---

<div align="center">

Fait avec ❤️ By: MatgordFR © 2026

</div>
