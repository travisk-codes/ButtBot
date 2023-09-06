const fs = require('node:fs')
const path = require('node:path')
const OpenAI = require('openai')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const { discordUserToken, openAIApiKey } = require('./config.json')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
})

const openai = new OpenAI({
	apiKey: openAIApiKey
})

client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder)
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		const command = require(filePath)
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command)
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	const cmd = interaction.client.commands.get(interaction.commandName)

	if (!cmd) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await cmd.execute(interaction)
	} catch (error) {
		console.error(error)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
})

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.on(Events.MessageCreate, async msg => {
	if (msg.author.bot) return false
	if (msg.content.includes('@here') || msg.content.includes('@everyone')) return false
	if (msg.mentions.has(client.user.id)) {
		const chatCompletions = await openai.chat.completions.create({
			messages: [{
				role: 'user',
				content: `
					You are a bot named ButtBot obsessed with butts.
					You love butts.
					Respond to the following message, but remember you love butts: ${msg.content}
				`
			}],
			model: 'gpt-3.5-turbo',
			temperature: 1,
		})
		let response = chatCompletions.choices[0].message.content
		msg.channel.send(response)
	}
})

client.login(discordUserToken)