const fs = require("fs")

module.exports = (client) => {
    const load = dirs => {
        const event = fs.readdirSync(`./events/${dirs}/`).filter(d => d.endsWith('.js'))
        for (file of event) {
            let pull = require(`../events/${dirs}/${file}`)
            client.on(pull.config.name, (...args) => pull.run(...args, client));
        }
    };
    ["client", "guild"].forEach(x => load(x))
}