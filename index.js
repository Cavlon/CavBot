const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v10")
const fs = require("fs")
const { Player } = require("discord-player")

const functions = require('./functions');
const bot = require("../DiscordBot/main")
const cums = ['cum', 'come', 'coming', 'crumb', 'krumb'];

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "1051222957646680104"
const GUILD_ID = "486227789725302797"

const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MEMBERS',
        'GUILD_VOICE_STATES'
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.on('messageCreate', (message) => {
        if (process.env.reply == '1'){
            switch (message.author.id){
                case '407607844334993419':
                    const balls = ["Your balls sag so low you leave a constant trail in the ground behind you.", "Your balls are saggier than my grandma's tits.", "My balls itch.", "Oh my god get your tiny, saggy balls out of here."]
                    rVal = Math.round(Math.random() * balls.length);
                    message.channel.send(`<@${message.author.id}> ` + balls[rVal]);
                    break;
                
                case '516599950344192005':
                    message.channel.send(`<@${message.author.id}> Shut up, you actually hate women`);
                    break;
                
                default:
                    if (message.author.id != CLIENT_ID){
                        message.channel.send(functions.insult(message.author.id));
                    }
                    break;
            }
        }

        if (message.author.id != '1051222957646680104'){
            let cum = false;
            let str = message.content;
            cums.forEach(element => {
                if (message.content.includes(element)){
                    let val = parseInt(process.env.cums);
                    let count = str.split(element).length - 1;
                    val += count;
                    process.env.cums = String(val);
                    cum = true;
                    for (let i = 0; i < count; i++){
                        str = str.replace(element, 'what~');
                    }
                }
            });
            if (cum){
                message.reply(str);
                message.channel.send(`lol cum. Cum has been said ${process.env.cums} times`);
            }
        }
    })
    client.login(TOKEN)
}
