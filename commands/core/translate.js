const translate = require('@iamtraction/google-translate')

module.exports = {
    config: {
        name: "translate",
        aliases: ["t"],
        category: "core",
		cooldown: 10
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.lineReplyNoMention('กรุณาระบุภาษาที่ต้องการแปล')
        if (!args[1]) return message.lineReplyNoMention('กรุณาระบุข้อความที่ต้องการแปล')
        translate(args.slice(1).join(' '), { to: args[0] }).then(res => {
            message.lineReplyNoMention(res.text)
        }).catch(error => {
            message.lineReplyNoMention(`เกิดข้อผิดพลาดขณะใช้งานคำสั่ง \`translate\`\n${error.message}`)
        });
    }
}