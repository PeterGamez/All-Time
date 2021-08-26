const BigEval = require('bigeval')

module.exports = {
    config: {
        name: "calculator",
        aliases: ["cal"],
        category: "fun",
    },
    run: async (client, message, args) => {
        const Obj = new BigEval();
        const result = Obj.exec(args.join(' '))
        if (String(result).split('.')[1]) return message.lineReplyNoMention(`${args.join(' ')} = ${result.toFixed(5)}`)
        message.lineReplyNoMention(`${args.join(' ')} = ${result}`)
    }
}
