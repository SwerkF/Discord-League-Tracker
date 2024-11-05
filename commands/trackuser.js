const { SlashCommandBuilder } = require("discord.js");
const Users = require("../models/User");
const TrackedUser = require("../models/TrackedUser");
const Channel = require("../models/Channel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trackuser")
    .setDescription("Commence à tracker un utilisateur")
    .addStringOption((option) =>
      option
        .setName("puuid")
        .setDescription("PUUID de l'utilisateur")
        .setRequired(true)
    ),

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

    if (!existingChannel) {
      try {
        let channel = {};
        channel.channel_id = channel_id;
        channel.guild_id = guild_id;

        existingChannel = await Channel.create(channel);
      } catch (error) {
        console.error(error);
        await interaction.reply(
          "Une erreur est survenue lors du bind du channel."
        );
      }
    }

    const puuid = interaction.options.getString("puuid");

    let existingUser = await Users.findOne({
      where: {
        puuid: puuid,
      },
    });

    if (!existingUser) {
      await interaction.reply(
        "Cet utilisateur n'est pas dans la base de données ! Vérifiez que vous avez bien ajouté l'utilisateur avec la commande /adduser."
      );
      return;
    }

    let trackedUser = await TrackedUser.findOne({
      where: {
        user_id: existingUser.id,
        guild: existingChannel.id,
      },
    });

    if (trackedUser) {
      await interaction.reply("Cet utilisateur est déjà tracké !");
      return;
    }

    try {
      let user = {};
      user.user_id = existingUser.id;
      user.guild = existingChannel.id;

      await TrackedUser.create(user);
      await interaction.reply(
        "Utilisateur ajouté à la liste des utilisateurs trackés !"
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Une erreur est survenue lors de l'ajout de l'utilisateur à la liste des utilisateurs trackés."
      );
    }
  },
};
