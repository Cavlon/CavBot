const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create a poll and send it to a certain channel")
        .addStringOption((option) => option.setName("title").setDescription("The poll's title").setRequired(true))
        .addStringOption((option) => option.setName("data").setDescription(`The poll's data, express each option as "option1" "option2"`).setRequired(true)),
    run: async ({ client, interaction }) => {
        let embed = new MessageEmbed();

        const markers = ['1️⃣','2️⃣','3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

        let data = interaction.options.getString('data');
        const myRegexp = /[^\s"]+|"([^"]*)"/gi;
        let options = [];

        while (true) {
            const match = myRegexp.exec(data);
            if (match != null)
            {
                options.push(match[1] ? match[1] : match[0]);
            } else {
                break;
            }
        }

        if (options.length > 10){
            return await interaction.editReply('Too many options');
        }

        let str = '';
        for (let i = 0; i < options.length; i++){
            str += markers[i] + ': **' + options[i] + `**\n\n`;
        }

        embed
            .setTitle('📋 ' + '**' + interaction.options.getString('title') + '**')
            .setColor(15844367)
            .setDescription(str)
            
        const m = await interaction.editReply({
            embeds: [embed]
        });
        for (let i = 0; i < options.length; i++){
            await m.react(markers[i]);
        }
	},
}