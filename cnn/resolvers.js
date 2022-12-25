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
    getLiveStreams: async () => {
      try {
        const response = await getJsonTokenData("streams");
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    getVideosByGame: async () => {
      const response = await getJsonTokenData("streams");
      const game_id = response.data.game_id;
      console.log(game_id);
      // const params = new URLSearchParams();
      // params.append("game_id", game_id);
      try {
        // const resp = await getJsonTokenData("videos", {
        //   body: params,
        // });
        // const _data = await resp.json();
        // console.log(_data);
      } catch (error) {
        console.log(error);
      }
    },
    // getChannelInformation: async () => {},
    // getClipsByUserId: async () => {},
    // getInformationGameById: async () => {},
  },
};

module.exports = resolvers;
