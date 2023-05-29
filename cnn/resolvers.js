const fetch = require("node-fetch");
require("dotenv").config();
const Storage = require("node-storage");
const store = new Storage("./store");
const {
  getDataLiveStreams,
  getDataClipsByUser,
  getDataInformationChannel,
  getDataInformationGame,
} = require("./service");
/*----------------------------------CONSULTA----------------------------------------*/
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

const getDataVideos = async (id, first) => {
  try {
    let dataVideos = [];
    let cursor = null;
    while (first > 0) {
      const response = await getJsonTokenData(
        `videos?game_id=${id}&first=${first > 50 ? 50 : first}${
          cursor === null ? "" : `&after=${cursor}`
        }`
      );
      if (response?.data?.length > 0 || response?.pagination?.length > 0) {
        first = first - response.data.length;
        dataVideos = [...dataVideos, ...response.data];
        cursor = response.pagination.cursor;
      } else {
        break;
      }
    }

    return dataVideos;
  } catch (error) {
    console.log(error);
  }
};

/*------------------------------------------------------------------------------------*/
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
    getCasosPruebasLiveStreams: async (_, { first }) => {
      try {
        let dataVideosForCaso2 = [];
        let totalDataVideos = 0;
        let response;
        do {
          const data = await getDataLiveStreams(first);
          const idGame = data.filter((resp) => resp.game_id);
          for (const iDs of idGame) {
            response = await getDataVideos(iDs.game_id, first);
            if (response?.length >= first && response?.length > 0) {
              dataVideosForCaso2.push(iDs);
              totalDataVideos++;
            }

            if (totalDataVideos >= first) {
              break;
            }
          }
          if (totalDataVideos > first) {
            //se utiliza el método slice para reducir la longitud del arreglo dataVideosForCaso2 a first elementos
            dataVideosForCaso2 = dataVideosForCaso2.slice(0, first);
            totalDataVideos = first;
            break;
          }
        } while (totalDataVideos === first);
        return dataVideosForCaso2;
      } catch (error) {
        console.log(error);
      }
    },
    getLiveStreams: async (_, { first = 20 }) => {
      try {
        const dataStreams = await getDataLiveStreams(first);
        return dataStreams;
        // let dataStreams = [];
        // let cursor = null;
        // while (first > 0) {
        //   const response = await getJsonTokenData(
        //     `streams?first=${first > 100 ? 100 : first}${
        //       cursor === null ? "" : `&after=${cursor}`
        //     }`
        //   );
        //   first = first - response.data.length;
        //   dataStreams = [...dataStreams, ...response.data];
        //   cursor = response.pagination.cursor;
        // }
        // console.log(dataStreams.length);
        // return dataStreams;
      } catch (error) {
        console.log(error);
      }
    },
    getVideosByGame: async (_, { id, first }) => {
      try {
        const dataVideos = await getDataVideos(id, first);
        return dataVideos;
        // let dataVideos = [];
        // let cursor = null;
        // while (first > 0) {
        //   const response = await getJsonTokenData(
        //     `videos?game_id=${id}&first=${first > 50 ? 50 : first}${
        //       cursor === null ? "" : `&after=${cursor}`
        //     }`
        //   );
        //   first = first - response.data.length;
        //   dataVideos = [...dataVideos, ...response.data];
        //   cursor = response.pagination.cursor;
        // }

        // return dataVideos;
      } catch (error) {
        console.log(error);
      }
    },
    getClipsByUserId: async (_, { id, first }) => {
      try {
        const dataClips = await getDataClipsByUser(id, first);
        return dataClips;
      } catch (error) {
        console.log(error);
      }
    },
    getChannelInformation: async (_, { id }) => {
      try {
        const dataChannel = await getDataInformationChannel(id);
        return dataChannel;
      } catch (error) {
        console.log(error);
      }
    },
    getInformationGameById: async (_, { id }) => {
      try {
        const dataGame = await getDataInformationGame(id);
        return dataGame;
      } catch (error) {
        console.log(error);
      }
    },
  },
  LiveStreams: {
    async videosByGame(video, { first = 50 }) {
      try {
        let dataVideosForCaso3 = [];
        let totalDataVideos = 0;
        let response;
        do {
          const dataVideos = await getDataVideos(video.game_id, first);
          const idUser = dataVideos.filter((resp) => resp.user_id);
          for (const iDs of idUser) {
            response = await getDataClipsByUser(iDs.user_id, first);
            if (response?.length >= first && response?.length > 0) {
              dataVideosForCaso3.push(iDs);
              totalDataVideos++;
            }

            if (totalDataVideos >= first) {
              break;
            }
          }
          if (totalDataVideos > first) {
            //se utiliza el método slice para reducir la longitud del arreglo dataVideosForCaso2 a first elementos
            dataVideosForCaso3 = dataVideosForCaso3.slice(0, first);
            totalDataVideos = first;
            break;
          }
        } while (totalDataVideos === first);
        return dataVideosForCaso3;
      } catch (error) {
        console.log(error);
      }
    },
  },
  VideosByGame: {
    async clipsByUser(clips, { first = 50 }) {
      const dataClips = await getDataClipsByUser(clips.user_id, first);
      return dataClips;
      // let cursor = null;
      // while (first > 0) {
      //   const response = await getJsonTokenData(
      //     `clips?broadcaster_id=${clips.user_id}&first=${
      //       first > 50 ? 50 : first
      //     }${cursor === null ? "" : `&after=${cursor}`}`
      //   );
      //   first = first - response.data.length;
      //   dataClips = [...dataClips, ...response.data];
      //   cursor = response.pagination.cursor;
      // }
    },
  },
  ClipsByUserId: {
    async channelInformation(channel) {
      const dataChannel = await getDataInformationChannel(
        channel.broadcaster_id
      );
      return dataChannel;
      // while (first > 0) {
      //   const response = await getJsonTokenData(
      //     `channels?broadcaster_id=${channel.broadcaster_id}&first=${
      //       first > 50 ? 50 : first
      //     }`
      //   );
      //   first = first - response.data.length;
      //   dataChannel = [...dataChannel, ...response.data];
      // }
    },
  },
  ChannelInformation: {
    async informationGame(game) {
      const dataGame = await getDataInformationGame(game.game_id);
      return dataGame;
      // while (first > 0) {
      //   const response = await getJsonTokenData(
      //     `games?id=${game.game_id}&first=${first > 50 ? 50 : first}`
      //   );
      //   first = first - response.data.length;
      //   dataGame = [...dataGame, ...response.data];
      // }
    },
  },
};

module.exports = resolvers;
