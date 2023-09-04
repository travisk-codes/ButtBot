const { SlashCommandBuilder } = require('discord.js')

const emojis = [
	'🍑',
	'🍆',
	'<:peachtone0:1147912515104288839>',
	'<:peachtone1:1147912516752638015>',
	'<:peachtone2:1147912518933696564>',
	'<:peachtone3:1147912520099713124>',
	'<:peachtone4:1147912521265725603>',
	'<:peachtone5:1147912522893111416>',
	'<:peachtonemetal:1148058685520756756>',
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('peach')
		.setDescription('Sends a random peach emoji.'),
	async execute(interaction) {
		const random = Math.floor(Math.random() * emojis.length)
		const emoji = emojis[random]
		await interaction.reply(emoji)
	}
}