// Import JS Library
const { SlashCommandBuilder, EmbedBuilder, escapeMarkdown } = require('discord.js');
const { Client, Util }										= require('clashofclans.js');

// Import Const Data
const { clashOfClans }										= require('./../../../config.json');
const { ClanDescription, WarStats }							= require('./../../../utils/customEmojis.js');

// Import Utils functions
const { getNbDaysSinceCreation, getMembersTownHallLevel, getMembersWarOptedIn, getCapitalAndDistrictsLevel, getMembersDonations } = require('./../../../utils/clanUtils.js');

const clashOfClient = new Client({ keys: [clashOfClans.apiToken]});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clan')
		.setDescription('Affiche le résumé et la vue d\'ensemble du clan.')
		.addStringOption(option =>
		    option.setName('tag')
				.setDescription('identifiant de clan.')
		),
	async execute(interaction) {
		console.log(interaction);

		const clanTag 			= interaction.options.getString('tag');
		const clanData			= await clashOfClient.getClan(Util.formatTag(`${clanTag}`));

		const members	= await clanData.fetchMembers()
        	.then((players) => {return players;});

		const clanEmbed = new EmbedBuilder()
			.setColor('#196EA9')
			.setTitle(`${escapeMarkdown(clanData.name)}`)
			.setURL(`https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(clanData.tag)}`)
			.setThumbnail(clanData.badge.url)
			.setDescription(
			   `${ClanDescription.LW_Etiquette}  |  Identifiant : \`${clanData.tag}\`\n${ClanDescription.LW_Anniversaire}  |  Création du clan : \`Il y a ${getNbDaysSinceCreation()} jours\`\n${ClanDescription.LW_Niveau}  |  Niveau : \`${clanData.level}\`\n${ClanDescription.LW_Membres}  |  Membres : \`${clanData.memberCount}\`\n${ClanDescription.LW_Attaque}  |  Ligue : \`${clanData.warLeague ?  clanData.warLeague.name : 'Aucune'}\``
			)
			.addFields(
				{ name: 'Joueurs :', value: getMembersTownHallLevel(members, 'townHallLevel')},
				{ name: 'Guerre de clans :', value: getMembersWarOptedIn(members, 'warOptedIn')},
				{ name: ' ', value: `${WarStats.LW_Up} | Victoires : \`${clanData.warWins}\`\n${WarStats.LW_Minus} | Égalités : \`${clanData.warTies}\`\n${WarStats.LW_Down} | Défaites : \`${clanData.warLosses}\`\n${WarStats.LW_Stars} | Différences : \`${clanData.warWins - clanData.warLosses > 0 ? `+${clanData.warWins - clanData.warLosses}` : `-${clanData.warWins - clanData.warLosses}`}\`\n${WarStats.LW_Streak} | Série de victoires : \`${clanData.warWinStreak}\``},
				{ name: 'Capitale :', value: `${ClanDescription.LW_Niveau} | Niveau : ${getCapitalAndDistrictsLevel(clanData.clanCapital)}\n${ClanDescription.LW_Attaque}  |  Ligue : \`${clanData.capitalLeague ?  clanData.capitalLeague.name : 'Aucune'}\``},
				{ name : 'Donations :', value: `${getMembersDonations(members)}`}
			)
			.setTimestamp()
			
		interaction.reply({ embeds: [clanEmbed] });		
			
	}
}