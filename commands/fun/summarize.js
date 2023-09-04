const { SlashCommandBuilder } = require('discord.js')
const OpenAI = require('openai')
const { openAIApiKey } = require('../../config.json')

const openai = new OpenAI({
	apiKey: openAIApiKey
})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summarize')
		.setDescription('Generate a summary of the chat conversation.')
		.addNumberOption(option => {
			return option.setName('messages')
				.setDescription('The number of messages to summarize.')
				.setRequired(true)
		}),
	async execute(interaction) {
		await interaction.deferReply()
		const count = interaction.options.get('messages').value
		const msgs = await interaction.channel.messages.fetch({ limit: count })
		let convo = ''
		for (msg of msgs.reverse()) {
			convo += msg[1].author.username + ': ' + msg[1].content + '\n'
		}
		const chatCompletion = await openai.chat.completions.create({
			messages: [{
				role: 'user',
				content: `summarize the following conversation:\n${convo}`,
			}],
			model: 'gpt-3.5-turbo',
			temperature: 1,
		})
		let summary = chatCompletion.choices[0].message.content
		await interaction.editReply(summary)
	}
}