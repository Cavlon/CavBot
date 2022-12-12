const { SlashCommandBuilder } = require("@discordjs/builders")
const {insult} = require('../functions');

module.exports = {
	data: new SlashCommandBuilder().setName("insult")
    .setDescription("Makes CavBot insult people")
    .addUserOption((option) => option.setName("user").setDescription("User to insult")),
	run: async ({ client, interaction }) => {

		if (interaction.options.getUser('user')){
            if (!interaction.guild.members.fetch(interaction.options.getUser('user').id)){
                return await interaction.editReply("That user doesn't exist");
            }
            return await interaction.editReply({
                content: insult(interaction.options.getUser('user').id)
            });
        }

        if (process.env.reply != '1'){
            process.env.reply = '1';
            return await interaction.editReply("Now turning into a dickhead");
        } else {
            process.env.reply = '0';
            return await interaction.editReply("Now un-turning into a dickhead");
        }
	},
}
