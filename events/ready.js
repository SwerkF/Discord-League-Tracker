const { Events } = require("discord.js");
const Users = require("../models/User");
const Champion = require("../models/Champion");
const TrackedUser = require("../models/TrackedUser");
const Channel = require("../models/Channel");
require("dotenv").config();

const cron = require("node-cron");
const Item = require("../models/Items");
const Match = require("../models/Match");
const ItemsParticipants = require("../models/ItemsParticipants");
const RankHistory = require("../models/RankHistory");
const Participant = require("../models/Participants");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    Users.sync();
    Champion.sync();
    TrackedUser.sync();
    Channel.sync();
    Item.sync();
    Match.sync();
    Participant.sync();
    ItemsParticipants.sync();
    RankHistory.sync();

    client.user.setActivity("League of Legends", { type: "PLAYING" });

    setInterval(async () => {
      const channels = await Channel.findAll();

      for (let channel of channels) {
        const guild = await client.guilds.fetch(channel.guild_id);
        const channelToSend = await guild.channels.fetch(channel.channel_id);

        const trackedUsers = await TrackedUser.findAll({
          where: {
            guild: channel.id,
          },
        });

        for (let trackedUser of trackedUsers) {
          const user = await Users.findOne({
            where: {
              id: trackedUser.user_id,
            },
          });

          const puuid = user.puuid;

          // https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/HgW_PsND6vBUJADfxPCKjP4dahGZ8y5X2OhuzFBc34dc22J5utDv7R4GI0CrOgr0qxYe-c5U16ucEQ/ids?start=0&count=10&api_key=RGAPI-e34e2fc2-1143-4411-847e-7292b264e099
          let matchList = await fetch(
            `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1&api_key=${process.env.RIOT_API_KEY}`
          );

          matchList = await matchList.json();

          for (let matchId of matchList) {
            let existingMatch = await Match.findOne({
              where: {
                match_id: matchId,
              },
            });

            if (existingMatch) {
              continue;
            }

            // https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_7155009912?api_key=RGAPI-e34e2fc2-1143-4411-847e-7292b264e099
            let matchData = await fetch(
              `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_API_KEY}`
            );

            matchData = await matchData.json();

            let match = {};
            match.match_id = matchData.metadata.matchId;
            match.game_duration = matchData.info.gameDuration;
            match.game_mode = matchData.info.gameMode;
            match.game_type = matchData.info.gameType;
            match.game_start = new Date(matchData.info.gameStartTimestamp);
            match.game_end = new Date(matchData.info.gameEndTimestamp);

            match = await Match.create(match);

            const participants = matchData.info.participants;

            for (let participant of participants) {
              participantPuuid = participant.puuid;

              let existingUser = await Users.findOne({
                where: {
                  puuid: participantPuuid,
                },
              });

              if (!existingUser) {
                let account = await fetch(
                  `https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${participant.puuid}?api_key=${process.env.RIOT_API_KEY}`
                );

                account = await account.json();

                let summoner = await fetch(
                  `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${participant.puuid}?api_key=${process.env.RIOT_API_KEY}`
                );

                summoner = await summoner.json();

                let summonerInfos = await fetch(
                  `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${user.secretId}?api_key=${process.env.RIOT_API_KEY}`
                );

                summonerInfos = await summonerInfos.json();

                let newUser = {};
                newUser.name = account.gameName;
                newUser.tag = account.tagLine;
                newUser.puuid = participant.puuid;
                newUser.secretId = summoner.id;
                newUser.level = summoner.summonerLevel;
                newUser.iconId = summoner.profileIconId;

                for (let i = 0; i < summonerInfos.length; i++) {
                  if (summonerInfos[i].queueType === "RANKED_SOLO_5x5") {
                    user.solo_duo_rank =
                      summonerInfos[i].tier + " " + summonerInfos[i].rank;
                    user.solo_duo_rank_lp = summonerInfos[i].leaguePoints;
                  } else if (summonerInfos[i].queueType === "RANKED_FLEX_SR") {
                    user.flex_rank =
                      summonerInfos[i].tier + " " + summonerInfos[i].rank;
                    user.flex_rank_lp = summonerInfos[i].leaguePoints;
                  }
                }

                existingUser = await Users.create(newUser);
              }

              console.log(existingUser);
              console.log(match);

              let existingParticipant = await Participant.findOne({
                where: {
                  user_id: existingUser.id,
                  match_id: match.id,
                },
              });

              if (existingParticipant) {
                continue;
              }

              let participantData = {};

              participantData.user_id = existingUser.id;
              participantData.match_id = match.id;
              participantData.champion_id = participant.championId;
              participantData.kills = participant.kills;
              participantData.lane = participant.lane;
              participantData.deaths = participant.deaths;
              participantData.assists = participant.assists;
              participantData.win = participant.win;
              participantData.magicDamageDealtToChampions =
                participant.magicDamageDealtToChampions;
              participantData.physicalDamageDealtToChampions =
                participant.physicalDamageDealtToChampions;
              participantData.trueDamageDealtToChampions =
                participant.trueDamageDealtToChampions;
              participantData.magicDamageTaken = participant.magicDamageTaken;
              participantData.physicalDamageTaken =
                participant.physicalDamageTaken;
              participantData.trueDamageTaken = participant.trueDamageTaken;
              participantData.totalHeal = participant.totalHeal;
              participantData.visionScore = participant.visionScore;
              participantData.goldEarned = participant.goldEarned;
              participantData.totalMinionsKilled =
                participant.totalMinionsKilled;

              existingParticipant = await Participant.create(participantData);

              let items = [
                participant.item0,
                participant.item1,
                participant.item2,
                participant.item3,
                participant.item4,
                participant.item5,
                participant.item6,
              ];

              for (let item of items) {
                if (item == 0) {
                  continue;
                }

                console.log(item);

                let existingItem = await Item.findOne({
                  where: {
                    id: item,
                  },
                });

                let existingItemParticipant = await ItemsParticipants.findOne({
                  where: {
                    participant_id: existingParticipant.id,
                    item_id: item,
                  },
                });

                if (existingItemParticipant) {
                  continue;
                }

                let itemParticipant = {};
                itemParticipant.participant_id = existingParticipant.id;
                itemParticipant.item_id = item;
                itemParticipant.timestamp = 0;

                await ItemsParticipants.create(itemParticipant);
              }

              let rankHistory = {};
              rankHistory.user_id = existingUser.id;
              rankHistory.match_id = match.id;
              rankHistory.solo_duo_rank = existingUser.solo_duo_rank;
              rankHistory.solo_duo_rank_lp = existingUser.solo_duo_rank_lp;
              rankHistory.flex_rank = existingUser.flex_rank;
              rankHistory.flex_rank_lp = existingUser.flex_rank_lp;

              await RankHistory.create(rankHistory);

              await match.save();

              await channelToSend.send(`Partie de ${user.name} enregistrée !`);
            }
          }
        }
      }
    }, 10000);

    cron.schedule("0 0 * * *", async () => {
      let champions = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/14.20.1/data/fr_FR/champion.json"
      );
      champions = await champions.json();
      champions = champions.data;

      for (let champion in champions) {
        let existingChampion = await Champion.findOne({
          where: {
            name: champions[champion].id,
          },
        });

        if (existingChampion) {
          if (
            existingChampion.title != champions[champion].title ||
            existingChampion.lore != champions[champion].blurb ||
            existingChampion.id != champions[champion].key
          ) {
            existingChampion.title = champions[champion].title;
            existingChampion.lore = champions[champion].blurb;
            existingChampion.id = champions[champion].key;
            await existingChampion.save();
          }
        } else {
          // create new champion.
          await Champion.create({
            name: champions[champion].id,
            title: champions[champion].title,
            lore: champions[champion].blurb,
            id: champions[champion].key,
          });
        }
      }

      const items = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/14.20.1/data/fr_FR/item.json"
      );

      let itemsJson = await items.json();

      itemsJson = itemsJson.data;

      for (let item in itemsJson) {
        let existingItem = await Item.findOne({
          where: {
            name: itemsJson[item].name,
          },
        });

        if (existingItem) {
          let description = itemsJson[item].description;
          description = description.replace(/<[^>]*>/g, "");
          if (
            existingItem.name != itemsJson[item].name ||
            existingItem.description != description ||
            existingItem.gold != itemsJson[item].gold.base ||
            existingItem.iconId != item
          ) {
            existingItem.name = itemsJson[item].name;
            existingItem.description = description;
            existingItem.gold = itemsJson[item].gold.base;
            existingItem.iconId = item;
            await existingItem.save();
          }
        } else {
          let description = itemsJson[item].description;
          description = description.replace(/<[^>]*>/g, "");
          await Item.create({
            id: item,
            name: itemsJson[item].name,
            description: description,
            gold: itemsJson[item].gold.base,
            iconId: item,
          });
        }
      }
    });
  },
};
