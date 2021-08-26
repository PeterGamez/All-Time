module.exports = {
	config: {
		name: "reload",
		aliases: ['re'],
		category: "owner",
		userPerms: "OWNER",
		cooldown: 2
	},
	run: async (client, message, args) => {
		if (!args[0]) return message.lineReplyNoMention(`โปรดระบุคำสั่งเพื่อ \`reload\``)
		const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]))
		if (!command) return message.lineReplyNoMention(`ไม่พบคำสั่ง \`${args[0]}\``);
		try {
			delete require.cache[require.resolve(`../${command.config.category}/${command.config.name}.js`)]
			const pull = require(`../${command.config.category}/${command.config.name}.js`)
			client.commands.set(pull.config.name, pull)
			if (pull.config.aliases) pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name))
			return message.lineReplyNoMention(`คำสั่ง: \`${command.config.name}\` ได้รับการ \`reload\` แล้วครับ`)
		} catch (error) {
			console.error(error)
			return message.lineReplyNoMention(`เกิดข้อผิดพลาดขณะรีโหลดคำสั่ง \`${command.config.name}\`\n${error.message}`);
		}
	}
}
