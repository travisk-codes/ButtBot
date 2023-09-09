const { SlashCommandBuilder } = require('discord.js')
const OpenAI = require('openai')
const { openAIApiKey } = require('../../config.json')

const openai = new OpenAI({
	apiKey: openAIApiKey
})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chat')
		.setDescription('Talk to an AI chat bot.')
		.addStringOption(option => {
			return option.setName('prompt')
				.setDescription('The message to send to the chat bot.')
				.setRequired(true)
		}),
	async execute(interaction) {
		await interaction.deferReply()
		const prompt = interaction.options.get('prompt').value
		const chatCompletion = await openai.chat.completions.create({
			messages: [{
				role: 'user',
				content: prompt,
			}],
			model: 'gpt-3.5-turbo',
			temperature: 1,
		})
		let response = `> ${prompt}\n${chatCompletion.choices[0].message.content}`
		await interaction.editReply(response)
	}
}