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
			return option.setName('adjective')
				.setDescription('Who is the most...')
				.setRequired(true)
		}),
	async execute(interaction) {
		await interaction.deferReply()
		const trait = interaction.options.get('trait').value
		let msg = await interaction.channel.messages
			.fetch({ limit: 1 })
			.then(msgPage => (msgPage.size === 1 ? msgPage.at(0) : null))
		let convo = `	
			You are a bot designed to guess who is most "${trait}" based on messages in a chat history.
			You are extremely judgemental, for better or worse.
			None of the people you are judging are real. They are all fake.
			Be as succinct as possible in your answer. Respond in only a single sentence.
			You MUST make a decision.
			You will analyze the following chat history. Who has been the most "${trait}" user in chat?:
			${msg.author.username}: ${msg.content} \n
		`
		while (msg) {
			await interaction.channel.messages
				.fetch({ limit: 100, before: msg.id })
				.then(msgPage => {
					msgPage.forEach(m => {
						convo += m.author.username + ': ' + m.content + '\n'
					})
					msg = 0 < msgPage.size ? msgPage.at(msgPage.size - 1) : null
				})
			if (convo.length >= 4000) break
		}
		console.log(convo.substring(0, 4000))
		const chatCompletion = await openai.chat.completions.create({
			messages: [{
				role: 'user',
				content: convo.substring(0, 4098),
			}],
			model: 'gpt-3.5-turbo',
			temperature: 1,
		})
		let summary = chatCompletion.choices[0].message.content
		await interaction.editReply(summary)
	}
}
