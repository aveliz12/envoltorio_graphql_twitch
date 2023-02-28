const fetch = require("node-fetch");
require("dotenv").config();
const Storage = require("node-storage");
const store = new Storage("./store");

const getJsonTokenData = async (path, params) => {
  const token = store.get("token");
  const response = await fetch(`https://api.twitch.tv/helix/${path}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Client-Id": "a2bf4j1rhkytvzoc4ortzn7m4yxg33",
    },
    body: params,
  });
  return await response.json();
};

const resolvers = {
  Query: {
    getToken: async () => {
      const params = new URLSearchParams();
      params.append("client_id", process.env.CLIENTID);
      params.append("client_secret", process.env.CLIENTSECRET);
      params.append("grant_type", process.env.GRANTTYPE);

      try {
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
          method: "POST",
          body: params,
        });
        const data = await response.json();
        store.put("token", data.access_token);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    getCasosPruebasLiveStreams: async (_, { first = 20 }) => {
      try {
        let dataStreams = [];
        let cursor = null;
        while (first > 0) {
          const response = await getJsonTokenData(
            `streams?first=${first > 100 ? 100 : first}${
              cursor === null ? "" : `&after=${cursor}`
            }`
          );

          first = first - response.data.length;
          dataStreams = [...dataStreams, ...response.data];
          cursor = response.pagination.cursor;
        }
        console.log(dataStreams.length);
        //return dataStreams;
      } catch (error) {
        console.log(error);
      }
    },
    getLiveStreams: async (_, { first = 20 }) => {
      try {
        let dataStreams = [];
        let cursor = null;

        while (first > 0) {
          const response = await getJsonTokenData(
            `streams?first=${first > 100 ? 100 : first}${
              cursor === null ? "" : `&after=${cursor}`
            }`
          );

          first = first - response.data.length;
          dataStreams = [...dataStreams, ...response.data];
          cursor = response.pagination.cursor;
        }
        console.log(dataStreams.length);
        return dataStreams;
      } catch (error) {
        console.log(error);
      }
    },
    getVideosByGame: async (_, { id }) => {
      try {
        const response = await getJsonTokenData(`videos?game_id=${id}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    getChannelInformation: async (_, { id }) => {
      try {
        const response = await getJsonTokenData(
          `channels?broadcaster_id=${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    getClipsByUserId: async (_, { id }) => {
      try {
        const response = await getJsonTokenData(`clips?broadcaster_id=${id}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    getInformationGameById: async (_, { id }) => {
      try {
        const response = await getJsonTokenData(`games?id=${id}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  LiveStreams: {
    async videosByGame(video) {
      const response = await getJsonTokenData(
        `videos?game_id=${video.game_id}`
      );
      return response.data;
    },
  },
  VideosByGame: {
    async channelInformation(channel) {
      const response = await getJsonTokenData(
        `channels?broadcaster_id=${channel.user_id}`
      );
      return response.data;
    },
  },
  ChannelInformation: {
    async clipsByUser(clips) {
      const response = await getJsonTokenData(
        `clips?broadcaster_id=${clips.broadcaster_id}`
      );
      return response.data;
    },
  },
  ClipsByUserId: {
    async informationGame(game) {
      const response = await getJsonTokenData(`games?id=${game.game_id}`);
      return response.data;
    },
  },
};

module.exports = resolvers;
