const { SlashCommandBuilder } = require('discord.js')
const OpenAI = require('openai')
const { openAIApiKey } = require('../../config.json')

const openai = new OpenAI({
	apiKey: openAIApiKey
})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poem')
		.setDescription('Generate a poem about butts.')
		.addNumberOption(option => {
			return option.setName('stanzas')
				.setDescription('The number of stanzas the poem should have.')
				.setRequired(false)
		}),
	async execute(interaction) {
		await interaction.deferReply()
		const stanzaCount = interaction.options.get('stanzas')?.value || 3
		const chatCompletion = await openai.chat.completions.create({
			messages: [{
				role: 'user',
				content: `compose a poem about butts that is ${stanzaCount} stanzas long`,
			}],
			model: 'gpt-3.5-turbo',
			temperature: 1,
		})
		let poem = chatCompletion.choices[0].message.content
		const matches = [...poem.matchAll(/\n\n/g)] //poem.match(/\n\n/g) || []
		const numberOfStanzas = matches.length + 1
		if (numberOfStanzas > stanzaCount) {
			poem = poem.slice(0, matches[stanzaCount].index)
		}
		await interaction.editReply(poem)
	}
}