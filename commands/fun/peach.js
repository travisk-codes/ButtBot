const { SlashCommandBuilder } = require('discord.js')

const emojis = [
	'🍑',
	'🍆',
	'<:peach_tone0:1148439074596720710>',
	'<:peach_tone1:1148446587442442301>',
	'<:peach_tone2:1148440546252181634>',
	'<:peach_tone3:1148440548055724154>',
	'<:peach_tone4:1148440549444034651>',
	'<:peach_tone5:1148440552073859172>',
	'<:peach_tonemetal:1148440553881616476>',
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