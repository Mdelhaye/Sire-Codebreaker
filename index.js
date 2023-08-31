// Import des dépendances nécessaires
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { discord }								= require('./config.json');
const fs										= require('node:fs');
const path										= require('node:path');

// ------------------------------------------------- Discord Part ------------------------------------------------- //

// Création d'une instance du client Discord.js avec les intents spécifiées
const discordClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers
	]
})

discordClient.commands = new Collection();

// Chargement des commandes à partir des fichiers dans le dossier "discord/commands"
const discordCommandsFoldersPath 	= path.join(__dirname, 'discord/commands');
const discordCommandsFolders 		= fs.readdirSync(discordCommandsFoldersPath);

for (const folder of discordCommandsFolders)
{
	const commandsPath = path.join(discordCommandsFoldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles)
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		
		// Vérification si la commande a les propriétés requises : "data" et "execute"
        if ('data' in command && 'execute' in command)
		{
			discordClient.commands.set(command.data.name, command);
		} 
		else
		{
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Chargement des événements à partir des fichiers dans le dossier "discord/events"
const discordEventsPath = path.join(__dirname, 'discord/events');
const discordEventFiles = fs.readdirSync(discordEventsPath).filter(file => file.endsWith('.js'));

for (const file of discordEventFiles) 
{
	const filePath = path.join(discordEventsPath, file);
	const event    = require(filePath);
	
	// Liaison des événements au client Discord
    if (event.once) 
    {
		discordClient.once(event.name, (...args) => event.execute(...args));
	} 
    else 
    {
		discordClient.on(event.name, (...args) => event.execute(...args));
	}
}

// Connexion du bot à l'API de Discord en utilisant le token d'authentification
discordClient.login(discord.token);