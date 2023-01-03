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

/*Métodos

getLiveStreams: async () => {
  try {
    const response = await getJsonTokenData("streams");
    return response.data;
  } catch (error) {
    console.log(error);
  }
},
getVideosByGame: async () => {
  const responseStreams = await getJsonTokenData("streams");
  const game_id = responseStreams.data.map((id) => {
    return id.game_id;
  });
  const params = new URLSearchParams();
  params.append("game_id", game_id[0]);

  try {
    const resp = await getJsonTokenData(`videos?${params}`);
    return resp.data;
  } catch (error) {
    console.log(error);
  }
},
getChannelInformation: async () => {
  const responseStreams = await getJsonTokenData("streams");
  const game_id = responseStreams.data.map((id) => {
    return id.game_id;
  });

  const resp = await getJsonTokenData(`videos?game_id=${game_id[0]}`);
  const idChannel = resp.data.map((idCha) => {
    return idCha.user_id;
  });

  console.log(idChannel)

  const params = new URLSearchParams();
  params.append("broadcaster_id", idChannel[0]);

  try {
    const channelInformation = await getJsonTokenData(`channels?${params}`);
    return channelInformation.data;
  } catch (error) {
    console.log(error);
  }
},
*/
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
    // getVideosByGame: async (_, { id }) => {
    //   const response = await getJsonTokenData(`videos?game_id=${id}`);
    //   return response.data;
    // },
    // getChannelInformation: async (_, { id }) => {
    //   const response = await getJsonTokenData(`channels?broadcaster_id=${id}`);
    //   return response.data;
    // },
    // getClipsByUserId: async (_, { id }) => {
    //   const response = await getJsonTokenData(`clips?broadcaster_id=${id}`);
    //   return response.data;
    // },
    // getInformationGameById: async (_, { id }) => {
    //   const response = await getJsonTokenData(`games?id=${id}`);
    //   return response.data;
    // },
  },
  LiveStreams: {
    async videosByGame(video) {
      const response = await getJsonTokenData(`videos?game_id=${video.game_id}`);
      console.log(response.data)
      return response.data;
    },
  },
};

module.exports = resolvers;
