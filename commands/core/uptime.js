const Discord = require('discord.js')

module.exports = {
	config: {
		name: "uptime",
		aliases: [],
		category: "core"
	},
	run: async (client, message, args) => {
		let uptime = ``;
		let totalSeconds = (client.uptime / 1000);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let days = Math.floor(hours / 24)

		if (hours > 23) {
			hours = 0;
		}
		if (minutes > 60) {
			minutes = 0;
		}
		
		uptime += `\`${days}\` วัน \`${hours}\` ชัวโมง \`${minutes}\` นาที`;
		const embed = new Discord.MessageEmbed()
			.setAuthor('ระยะเวลาที่บอทออนไลน์', message.guild.iconURL())
			.setColor(client.config.color)
			.setDescription('📢 ' + uptime + ' 🕔')
			.setTimestamp()
			.setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
		return message.channel.send(embed);
	}
}