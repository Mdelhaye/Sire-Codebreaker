// Import des dépendances nécessaires
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } 										= require('./config.json');
const fs 												= require('node:fs');
const path 												= require('node:path');

// Création d'une instance du client Discord.js avec les intents spécifiées
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers
	]
})

client.commands = new Collection();

// Chargement des commandes à partir des fichiers dans le dossier "commands"
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders)
{
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles)
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		
		// Vérification si la commande a les propriétés requises : "data" et "execute"
        if ('data' in command && 'execute' in command)
		{
			client.commands.set(command.data.name, command);
		} 
		else
		{
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Chargement des événements à partir des fichiers dans le dossier "events"
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) 
{
	const filePath = path.join(eventsPath, file);
	const event    = require(filePath);
	
	// Liaison des événements au client Discord
    if (event.once) 
    {
		client.once(event.name, (...args) => event.execute(...args));
	} 
    else 
    {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Connexion du bot à l'API de Discord en utilisant le token d'authentification
client.login(token);

// console.log(client.cooldowns);
// exports.clientCooldowns = client.cooldowns;
