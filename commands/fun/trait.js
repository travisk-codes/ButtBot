const { SlashCommandBuilder } = require('discord.js')
const OpenAI = require('openai')
const { openAIApiKey } = require('../../config.json')

const openai = new OpenAI({
	apiKey: openAIApiKey
})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trait')
		.setDescription('Which user is the most whatever!')
		.addStringOption(option => {
			return option.setName('trait')
				.setDescription('Who is the most...')
				.setRequired(true)
		}),
	async execute(interaction) {
		await interaction.deferReply()
		const trait = interaction.options.get('trait').value
		let msgs = []
		let msg = await interaction.channel.messages
			.fetch({ limit: 1 })
			.then(msgPage => (msgPage.size === 1 ? msgPage.at(0) : null))
		while (msg) {
			await interaction.channel.messages
				.fetch({ limit: 100, before: msg.id })
				.then(msgPage => {
					msgPage.forEach(m => msgs.push(m))
					msg = 0 < msgPage.size ? msgPage.at(msgPage.size - 1) : null
				})
		}
		let convo = ''
		for (msg of msgs) {
			convo += msg.author.username + ': ' + msg.content + '\n'
		}
		const prompt = `
			You are a bot who attempts to guess amount of ${trait} based on personality.
			You will analyze the following chat history. Who has been the most ${trait} user in chat?:
			${convo}
		`
		const chatCompletion = await openai.chat.completions.create({
			messages: [{
				role: 'user',
				content: prompt.substring(0, 4097),
			}],
			model: 'gpt-3.5-turbo',
			temperature: 1,
		})
		let summary = chatCompletion.choices[0].message.content
		await interaction.editReply(summary)
	}
}
