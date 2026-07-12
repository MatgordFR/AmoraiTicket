<div align="center">

# 🎫 discord-ticket-transcript

**Un bot Discord de tickets avec transcription HTML automatique à la fermeture — 4 types de tickets, permissions par rôle, panneau à bouton.**

[![License: ISC](https://img.shields.io/badge/Licence-ISC-blue?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A5%2018-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.js.org)
[![Transcripts](https://img.shields.io/badge/transcription-HTML-f59e0b?style=flat-square)](https://www.npmjs.com/package/discord-html-transcripts)
[![By MatgordFR](https://img.shields.io/badge/by-MatgordFR-111?style=flat-square&logo=github&logoColor=white)](https://github.com/MatgordFR)

</div>

---

## ✨ En deux mots

`discord-ticket-transcript` pose un **panneau à bouton** dans un salon. Un membre ouvre un ticket, choisit une catégorie, et un salon privé est créé avec les bonnes permissions. À la fermeture, le bot génère une **transcription HTML complète** et l'envoie dans un salon de logs.

- 🎟️ panneau à bouton + menu de catégorie ;
- 📁 **4 types** : rapport, partenariat, question, giveaway (chacun ping son rôle) ;
- 🔒 **permissions auto** par ticket (membre / staff / `@everyone` refusé) ;
- 📜 **transcription HTML** à la fermeture + logs ;
- 🛡️ **validation de la config** au lancement.

## 📑 Sommaire

- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#️-lancement)
- [Tickets](#-tickets--fonctionnement)
- [Dépannage](#️-dépannage)
- [Structure](#️-structure)
- [Licence](#-licence)

## 🧩 Prérequis

- [Node.js **18+**](https://nodejs.org)
- Un bot créé sur le [Discord Developer Portal](https://discord.com/developers/applications)
- L'intent privilégié **Message Content** activé
- Permissions du bot : **Gérer les salons**, **Gérer les messages**, Voir/Envoyer, Historique, Liens intégrés, Fichiers joints, Emojis externes

## 📦 Installation

```bash
git clone https://github.com/MatgordFR/discord-ticket-transcript.git
cd discord-ticket-transcript
npm install
cp config.example.json config.json   # puis remplis config.json
```

## 🔧 Configuration

`config.json` (ignoré par git — ton token ne partira jamais sur GitHub). Clés principales :

| Clé | Description |
|---|---|
| `token` | Token de ton bot Discord |
| `ticket_channel` | Salon où le **panneau** d'ouverture est posté |
| `ticket_category` | Catégorie où les **salons de ticket** sont créés |
| `Salon_ticket_logs` | Salon des **logs de fermeture** (transcription) |
| `logs_redémarrer_bot` | Salon de l'embed de démarrage |
| `Role_proprietaire` / `Role_staff` | Rôles avec accès aux tickets |
| `Role_responsable_giveaway` / `Role_responsable_partner` | Rôles des tickets giveaway / partenariat |
| `color_principal` | Couleur des embeds — `RRGGBB` **ou** `#RRGGBB` |
| `ticket_*` / `emoji_*` | Emojis d'affichage (cosmétique) |

> 💡 Au démarrage, le bot **vérifie ta config** : s'il manque `token`, `ticket_channel` ou `ticket_category`, il te le dit clairement et s'arrête.

## ▶️ Lancement

```bash
npm start
```

Au lancement, le bot se connecte, poste son embed de démarrage, puis (re)pose un panneau de ticket propre dans `ticket_channel`.

## 🎫 Tickets — fonctionnement

```
Membre clique « Ouvrir un ticket »
        ↓
Salon de sélection privé (menu de catégorie)
        ↓
Membre choisit une catégorie
        ↓
Salon de ticket créé (permissions auto) → salon de sélection supprimé
        ↓
Staff clique « Fermer » → confirmation
        ↓
Transcription HTML générée → envoyée dans les logs → salon supprimé
```

| Type | Emoji | Accès staff |
|---|---|---|
| Rapport & plainte | 🚨 | `Role_staff` |
| Partenariat & échange de pub | 🤝 | `Role_responsable_partner` |
| Question | ❓ | `Role_staff` |
| Récompense Giveaway | 🎁 | `Role_responsable_giveaway` |

## 🛠️ Dépannage

| Symptôme | Piste |
|---|---|
| `[CONFIG] config.json invalide…` | Une clé manque/est vide dans `config.json` (le message dit laquelle) |
| Panneau de ticket absent | `ticket_channel` correct + le bot peut écrire dedans ? |
| Salon de ticket non créé | `ticket_category` correct + le bot a **Gérer les salons** ? |
| Transcription non envoyée | Permissions du bot dans `Salon_ticket_logs` ? |
| `Cannot find module` | Relance `npm install` |

## 🗂️ Structure

```
discord-ticket-transcript/
├─ index.js               # point d'entrée + validation config + chargeur d'events
├─ config.example.json    # gabarit à copier vers config.json
├─ package.json
├─ LICENSE
├─ events/
│  ├─ ready.js            # embed de démarrage + statut + pose du panneau
│  └─ messageCreate.js    # réponse aux mentions du bot
├─ utils/
│  ├─ TicketMessage.js    # envoi du panneau de ticket
│  ├─ SelectTicket.js     # salon de sélection (menu de catégorie)
│  ├─ OpenTicket.js       # création du salon de ticket
│  ├─ DeleteTicket.js     # fermeture + transcription + suppression
│  └─ perms.js            # permissions Discord partagées
└─ image/
   └─ discord.png         # bannière du panneau
```

## 📄 Licence

ISC — © 2026 MatgordFR. Voir [LICENSE](LICENSE).

<div align="center">
<sub>Fait avec ❤️ par <a href="https://github.com/MatgordFR">MatgordFR</a> · <a href="https://x.com/matgordfr">@matgordfr</a></sub>
</div>
