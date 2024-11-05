const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/User");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("adduser")
    .setDescription("Ajouter un joueur à la base de données")
    .addStringOption((option) =>
      option.setName("name").setDescription("Nom du joueur").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("tag").setDescription("Tag du joueur").setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const tag = interaction.options.getString("tag");

    let existingUser = await User.findOne({
      where: {
        name: name,
        tag: tag,
      },
    });

    if (existingUser) {
      await interaction.reply("Ce joueur est déjà dans la base de données !");
      return;
    }

    try {
      let user = {};
      user.name = name;
      user.tag = tag;
      let account = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${process.env.RIOT_API_KEY}`
      );

      account = await account.json();

      user.puuid = account.puuid;

      let summoner = await fetch(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${user.puuid}?api_key=${process.env.RIOT_API_KEY}`
      );

      summoner = await summoner.json();

      user.secretId = summoner.id;
      user.level = summoner.summonerLevel;
      user.iconId = summoner.profileIconId;

      let summonerInfos = await fetch(
        `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${user.secretId}?api_key=${process.env.RIOT_API_KEY}`
      );

      summonerInfos = await summonerInfos.json();

      for (let i = 0; i < summonerInfos.length; i++) {
        if (summonerInfos[i].queueType === "RANKED_SOLO_5x5") {
          user.solo_duo_rank =
            summonerInfos[i].tier + " " + summonerInfos[i].rank;
          user.solo_duo_rank_lp = summonerInfos[i].leaguePoints;
        } else if (summonerInfos[i].queueType === "RANKED_FLEX_SR") {
          user.flex_rank = summonerInfos[i].tier + " " + summonerInfos[i].rank;
          user.flex_rank_lp = summonerInfos[i].leaguePoints;
        }
      }

      await User.create(user);

      interaction.reply(
        "Joueur ajouté à la base de données ! Voici son PUUID : " +
          user.puuid +
          ". Executez la commande /trackuser pour suivre l'évolution de ses ranks."
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Erreur lors de la récupération des données du joueur !"
      );
      return;
    }
  },
};
