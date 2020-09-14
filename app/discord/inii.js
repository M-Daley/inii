// Dependencies
const discord = require("discord.js")
const { MongooseDocument } = require("mongoose")
const mongo = require("../db/server")
const commandParse = require("../parsers/commands")
const db = new mongo()
const client = new discord.Client()

// Configuration Options
const config = require("./config.json")

class inii {
    // Message Handling
    listen() {
        // Verify the message sent to Inii was a Direct Message by the client.
        client.on("message", msg => {
            if (msg.channel.type === "dm" && msg.author.id === config.client) {
                this.getCommand(msg.content)
                    .then(rep => {
                        msg.reply(rep)
                    })
                    .catch(e => {
                        msg.reply(e)
                    })
                
            }
        })
    }

    // Start up
    awaken() {
        // Ready status check
        client.on("ready", () => console.log(`Logged on as ${client.user.tag}`))

        // Log bot into Discord
        client.login(config.login)

        // Connect to Mongo Database
        db.connect(config.dbHost)
    }

    // Determine command
    getCommand(s) {
        let [command, target, args] = commandParse.commandBreakdown(s)

        switch(command) {
            case "new":
                return this.new(target, args)
                break
            case "edit":
                this.edit(target, args)
                break
            case "del":
                this.del(target, args)
                break
            case "show":
                return this.show(target, args)
                break
            default:
                Error("No clue what that command is")
        }
    }

    new(target, args) {
        let msg

        (target == "assign")
        ? msg = db.addAssignment(args)
        : msg = db.addCourse(args) // Server side needs to be completed

        return msg
    }

    edit(target, args) {
        let msg

        (target == "assign")
        ? msg = db.editAssignment(args)
        : msg = db.editCourse(args) // Server side needs to be completed

        return msg
    }

    del(target, args) {}

    show(target, args) {
        let msg

        (target == "assign")
        ? msg = db.showAssignment(args)
        : msg = db.showCourse(args) // Server side needs to be completed

        return msg
    }


}

module.exports = inii