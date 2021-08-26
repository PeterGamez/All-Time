const Discord = require('discord.js')
const formatter = new Intl.NumberFormat('en')

module.exports = {
	config: {
		name: "server-info",
		aliases: ["server", "serverinfo"],
		category: "info",
		cooldown: 10
	},
	run: async (client, message, args) => {

		let guild = message.guild
		if (Number(args[0])) {
			if (args[0].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)
			try {
				guild = client.guilds.cache.get(args[0])
			} catch {
				return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)
			}
		}

		function findEmoji(id) {
			return client.emojis.cache.get(id)
		}

		function checkonlineall(guild) {
			let onlineallCount = 0;
			guild.members.cache.forEach(member => {
				if (member.user.presence.status === "online")
					onlineallCount++;
				if (member.user.presence.status === "idle")
					onlineallCount++;
				if (member.user.presence.status === "dnd")
					onlineallCount++;
			});
			return onlineallCount;
		}
		function checkonline(guild) {
			let onlineCount = 0;
			guild.members.cache.forEach(member => {
				if (member.user.presence.status === "online")
					onlineCount++;
			});
			return onlineCount;
		}
		function checkidle(guild) {
			let idleCount = 0;
			guild.members.cache.forEach(member => {
				if (member.user.presence.status === "idle")
					idleCount++;
			});
			return idleCount;
		}
		function checkdnd(guild) {
			let dndCount = 0;
			guild.members.cache.forEach(member => {
				if (member.user.presence.status === "dnd")
					dndCount++;
			});
			return dndCount;
		}
		function voicecount(guild) {
			let voicecount = 0;
			for (const [id, voiceChannel] of guild.channels.cache.filter(c => c.type === 'voice')) voicecount += voiceChannel.members.size
			return voicecount
		}
		function security(level) {
			const verificationLevels = {
				NONE: 'ไม่มี',
				LOW: 'ต่ำ',
				MEDIUM: 'ปานกลาง',
				HIGH: 'สูง',
				VERY_HIGH: 'สูงมาก'
			};
			return verificationLevels[level]
		}

		function region(guild) {
			const flag = {
				"brazil": ":flag_br: Brazil",
				"europe": ":flag_eu: Europe",
				"hongkong": ":flag_hk: Hong Kong",
				"india": ":flag_in: India",
				"japan": ":flag_jp: Japan",
				"russia": ":flag_ru: Russia",
				"singapore": ":flag_sg: Singapore",
				"southafrica": ":flag_za: South Africa",
				"sydney": ":flag_au: Sydney",
				"us-central": ":flag_us: U.S. Central",
				"us-east": ":flag_us: U.S. East",
				"us-south": ":flag_us: U.S. South",
				"us-west": ":flag_us: U.S. West"
			}
			if (guild.region == undefined) return `ไม่พบภูมิภาคห้องเสียง`
			else return flag[guild.region]
		}

		function partner(guild) {
			if (guild.community == true) return 'เซิร์ฟเวอร์ชุมชน'
			else if (guild.splash) return 'เซิร์ฟเวอร์สาธารณะ'
			else return 'เซิร์ฟเวอร์ส่วนบุคคล'
		}

		function verify(guild) {
			if (guild.verified == true || guild.partnered == true) return 'ได้รับการยืนยันจากทางดิสคอร์ด'
			else return 'ไม่ได้รับการยืนยัน'
		}

		function invitetext(guild) {
			if (guild.vanityURLCode) return `[${guild.name}](https://discord.gg/${guild.vanityURLCode})`
			else return 'ไม่มี'
		}

		function checkmaxemoji(guild) {
			if (guild.premiumTier == 0) return '50'
			else if (guild.premiumTier == 1) return '100'
			else if (guild.premiumTier == 2) return '150'
			else if (guild.premiumTier == 3) return '250'
		}

		function description(guild) {
			if (guild.description) return guild.description
			else return 'ไม่มี'
		}
		//server พิเศษ
		/*if (message.guild.id === '706026008914165782'){//Minekie Shop
			partnered = 'เซิร์ฟเวอร์ซัพพอร์ต'
			invitetext = '[Minekie Shop](https://minekie.net/discord)'
			verifyed = 'ได้รับการยืนยันจากลูกค้าในร้าน'
		}*/

		function link(server) {
			let l1 = server.iconURL({ dynamic: true }).split('.')[3]
			if (l1 == 'webp') {
				let l2 = server.iconURL().split('webp')[0]
				return `${l2}png`
			}
			return server.iconURL({ dynamic: true })
		}

		const text = (`**ข้อมูลทั่วไป** 
**❯ 🏡 เซิร์ฟเวอร์:** ${guild.name} (${guild.id})
**❯ 📟 คำอธิบาย:** ${guild.description == null ? 'ไม่มี' : guild.description}
**❯ 👑 เจ้าของ:** ${guild.owner.user.username} (${guild.owner.user.id})
**❯ 🌏 ภูมิภาคห้องเสียง:** ${region(guild)}
**❯ ${findEmoji('820557779059474432')} ประเภทเซิร์ฟเวอร์:** ${partner(guild)}
**❯ ${findEmoji('820557778853822474')} การยืนยันเซิร์ฟเวอร์:** ${verify(guild)}
**❯ 🔗 โคดเชิญแบบกำหนดเอง:** ${invitetext(guild)}
**❯ ${findEmoji('830045524513390612')} บูสทั้งหมด:** ${guild.premiumSubscriptionCount} บูส Level ${guild.premiumTier}
**❯ 🛡️ ระดับความปลอดภัย:** ${security(guild.verificationLevel)}
**❯ ⏲️ เซิร์ฟเวอร์ถูกสร้างขึ้นเมื่อ:** <t:${String(guild.createdTimestamp).slice(0, 10)}:D>

**สถิติของเซิร์ฟเวอร์**
**❯ ${findEmoji('820556604792766515')} สมาชิกทั้งหมด:** ${formatter.format(guild.memberCount)}/${formatter.format(guild.maximumMembers)}
**❯ ${findEmoji('820556604792766515')} สมาชิกที่เป็นคน:** ${formatter.format(guild.memberCount - guild.members.cache.filter(member => member.user.bot).size)}
**❯ ${findEmoji('820556604792766515')} สมาชิกที่เป็นบอท:** ${formatter.format(guild.members.cache.filter(member => member.user.bot).size)}
**❯ ${findEmoji('820556604919382046')} ห้องพูดคุย:** ${guild.channels.cache.filter(channel => channel.type === 'text').size}
**❯ ${findEmoji('820556604919382046')} ห้องเสียง:** ${guild.channels.cache.filter(channel => channel.type === 'voice').size}
**❯ ${findEmoji('820556604943892481')} บทบาททั้งหมด:** ${guild.roles.cache.size}/250
**❯ ${findEmoji('820556604507815938')} อีโมจิทั้งหมด:** ${guild.emojis.cache.size}/${checkmaxemoji(guild) * 2}
**❯ ${findEmoji('820556604507815938')} อีโมจิแบบปกติ:** ${guild.emojis.cache.filter(emoji => !emoji.animated).size}/${checkmaxemoji(guild)}
**❯ ${findEmoji('820556604507815938')} อีโมจิแบบเคลื่อนไหว:** ${guild.emojis.cache.filter(emoji => emoji.animated).size}/${checkmaxemoji(guild)}

**สถานะของสมาชิกในเซิร์ฟเวอร์**
**❯ ${findEmoji('820556605144825875')} ออนไลน์ทั้งหมด:** ${formatter.format(checkonlineall(guild))}
**❯ ${findEmoji('820556605144825875')} สถานะออนไลน์:** ${formatter.format(checkonline(guild))}
**❯ ${findEmoji('820556604633251851')} สถานะไม่อยู่:** ${formatter.format(checkidle(guild))}
**❯ ${findEmoji('820556604868788224')} สถานะห้ามรบกวน:** ${formatter.format(checkdnd(guild))}
**❯ ${findEmoji('820556604785033237')} สถานะออฟไลน์:** ${formatter.format(guild.memberCount - checkonlineall(guild))}
**❯ 🎤 สมาชิกใช้งานห้องเสียง:** ${voicecount(guild)}`)

		const embed = new Discord.MessageEmbed()
			.setColor(client.config.color)
			.setAuthor(`ข้อมูล-เซิร์ฟเวอร์ 📊`, message.guild.iconURL())
			.setThumbnail(link(guild))
			.setDescription(text)
			.setTimestamp()
			.setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
		return message.channel.send(embed)
	}
}
