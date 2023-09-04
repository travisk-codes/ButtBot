const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('butts')
		.setDescription('Replies with "butts!"'),
	async execute(interaction) {
		await interaction.reply('butts!')
	}
}