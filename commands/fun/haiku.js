const { SlashCommandBuilder } = require('discord.js')
const OpenAI = require('openai')
const { openAIApiKey } = require('../../config.json')

const openai = new OpenAI({
	apiKey: openAIApiKey
})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('haiku')
		.setDescription('Generate a haiku about butts.'),
	async execute(interaction) {
		const chatCompletion = await openai.chat.completions.create({
			messages: [{
				role: 'user',
				content: 'compose a haiku about butts',
			}],
			model: 'gpt-3.5-turbo',
			temperature: 1,
		})
		await interaction.reply(chatCompletion.choices[0].message.content)
	}
}