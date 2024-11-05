const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const Users = require("../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Affiche les informations d'un joueur")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Nom du joueur")
        .setRequired(true)
    ),
  async execute(interaction) {
    const username = interaction.options.getString("username");
    const [name, tag] = username.split("#");

    let users;
    if (tag) {
      users = await Users.findAll({
        where: {
          name,
          tag,
        },
      });
    } else {
      users = await Users.findAll({
        where: {
          name,
        },
      });
    }

    if (users.length === 0) {
      await interaction.reply("Aucun utilisateur trouvé.");
    } else if (users.length === 1) {
      const user = users[0];
      const exampleEmbed = new EmbedBuilder()
        .setTitle(`${user.name}#${user.tag} - Niveau ${user.level}`)
        .setDescription(`**PUUID** \n${user.puuid}`)
        .setThumbnail(
          `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${user.iconId}.png`
        )
        .setColor("#0099ff")
        .addFields(
          {
            name: "Solo/Duo",
            value: `${user.solo_duo_rank} ${user.solo_duo_rank_lp} LP`,
          },
          {
            name: "Flex",
            value: `${user.flex_rank} ${user.flex_rank_lp} LP`,
          }
        )
        .setTimestamp();
      await interaction.reply({
        content: "Utilisateur trouvé:",
        embeds: [exampleEmbed],
      });
    } else {
      const options = users.map((user) => ({
        label: `${user.name}#${user.tag}`,
        value: user.id,
      }));

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("select")
          .setPlaceholder("Sélectionnez un utilisateur")
          .addOptions(
            options.map((option) => ({
              label: String(option.label),
              value: String(option.value),
            }))
          )
      );

      await interaction.reply({
        content: "Plusieurs utilisateurs trouvés, veuillez en sélectionner un:",
        components: [row],
      });

      const filter = (i) =>
        i.customId === "select" && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (i) => {
        const selectedUserId = i.values[0];
        const selectedUser = await Users.findByPk(selectedUserId);

        if (selectedUser) {
          const exampleEmbed = new EmbedBuilder()
            .setTitle(
              `${selectedUser.name}#${selectedUser.tag} - Niveau ${selectedUser.level}`
            )
            .setDescription(`PUUID: ${selectedUser.puuid}`)
            .setThumbnail(
              `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${selectedUser.iconId}.png`
            )
            .setColor("#0099ff")
            .addFields(
              {
                name: "Solo/Duo",
                value: `${selectedUser.solo_duo_rank} ${selectedUser.solo_duo_rank_lp} LP`,
              },
              {
                name: "Flex",
                value: `${selectedUser.flex_rank} ${selectedUser.flex_rank_lp} LP`,
              }
            )
            .setTimestamp();
          await i.update({
            content: "Utilisateur trouvé:",
            components: [],
            embeds: [exampleEmbed],
          });
        } else {
          const exampleEmbed = new EmbedBuilder()
            .setTitle(
              `${selectedUser.name}#${selectedUser.tag} - Niveau ${selectedUser.level}`
            )
            .setDescription(`PUUID: ${selectedUser.puuid}`)
            .setThumbnail(
              `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${selectedUser.iconId}.png`
            )
            .setColor("#0099ff")
            .addFields(
              {
                name: "Solo/Duo",
                value: `${selectedUser.solo_duo_rank} ${selectedUser.solo_duo_rank_lp} LP`,
              },
              {
                name: "Flex",
                value: `${selectedUser.flex_rank} ${selectedUser.flex_rank_lp} LP`,
              }
            )
            .setTimestamp();
          await i.update({
            content: "Utilisateur trouvé:",
            components: [],
            embeds: [exampleEmbed],
          });
        }
      });

      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          await interaction.editReply({
            content: "Aucune sélection effectuée.",
            components: [],
          });
        }
      });
    }
  },
};
