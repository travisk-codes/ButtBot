const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Repeat a message.')
		.addStringOption(option => {
			return option.setName('message')
				.setDescription('The message to repeat.')
				.setRequired(true)
		}),
	async execute(interaction) {
		const userMsg = interaction.options.get('message').value
		await interaction.reply(userMsg)
	}
}