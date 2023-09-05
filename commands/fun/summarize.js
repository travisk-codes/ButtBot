const { SlashCommandBuilder } = require('discord.js')
const OpenAI = require('openai')
const moment = require('moment')
const { openAIApiKey } = require('../../config.json')

const openai = new OpenAI({
	apiKey: openAIApiKey
})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summarize')
		.setDescription('Generate a summary of the chat conversation.')
		.addStringOption(option => {
			return option.setName('units')
				.setDescription('Either number of messages or minutes passed.')
				.setRequired(true)
				.addChoices(
					{ name: 'messages', value: 'messages' },
					{ name: 'minutes', value: 'minutes' },
				)
		})
		.addNumberOption(option => {
			return option.setName('count')
				.setDescription('The number of messages or minutes to summarize.')
				.setRequired(true)
		}),
	async execute(interaction) {
		await interaction.deferReply()
		const count = interaction.options.get('count').value
		const units = interaction.options.get('units').value
		let msgFetchLimit = count
		if (units === 'minutes') {
			msgFetchLimit = 100
		}
		let allMsgs = await interaction.channel.messages.fetch({ limit: msgFetchLimit })
		let msgs = []
		let convo = ''
		if (units === 'minutes') {
			for (msg of allMsgs) {
				const now = moment()
				const msgTime = moment(msg[1].createdTimestamp)
				if (now.diff(msgTime, 'minutes') < count) {
					msgs.push(msg)
				}
			}
		} else {
			msgs = allMsgs
		}
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