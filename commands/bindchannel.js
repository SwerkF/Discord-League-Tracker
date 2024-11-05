const { SlashCommandBuilder } = require("discord.js");
const Channel = require("../models/Channel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bindchannel")
    .setDescription("Bind le channel dans lequel seront envoyés les messages."),
  async execute(interaction) {
    const channel = interaction.channel;
    const guild = interaction.guild;
    const channel_id = channel.id;
    const guild_id = guild.id;

    let existingChannel = await Channel.findOne({
      where: {
        guild_id: guild_id,
      },
    });

    if (existingChannel) {
      existingChannel.channel_id = channel_id;
      await existingChannel.save();
      await interaction.reply("Channel bindé !");
    } else {
      try {
        let channel = {};
        channel.channel_id = channel_id;
        channel.guild_id = guild_id;

        await Channel.create(channel);
        await interaction.reply("Channel bindé !");
      } catch (error) {
        console.error(error);
        await interaction.reply(
          "Une erreur est survenue lors du bind du channel."
        );
      }
    }
  },
};
