const fetch = require("node-fetch");
require("dotenv").config();
const Storage = require("node-storage");
const store = new Storage("./store");
const {
  getDataLiveStreams,
  getDataVideos,
  getDataClipsByUser,
  getDataInformationChannel,
  getDataInformationGame,
} = require("./service");
/*----------------------------------CONSULTA GRAPHQL----------------------------------------*/
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
    getCasosPruebasLiveStreams: async (_, { limitNivel1 = 50 }) => {
      try {
        // console.log(limitNivel1,limitNivel2)
        // if (limitNivel2 === undefined) {
        //  console.log("SOLO NIVEL 1")
        const data = await getDataLiveStreams(limitNivel1);
        return data;
        // } else {
        //   console.log("YA CON NIVEL 2 ", limitNivel2)
        //   let dataVideosForCaso2 = [];
        //   let totalDataVideos = 0;
        //   let response;
        //   do {
        //     const data = await getDataLiveStreams(limitNivel1);
        //     const idGame = data.filter((resp) => resp.game_id);
        //     for (const iDs of idGame) {
        //       if (iDs !== null) {
        //         response = await getDataVideos(iDs.game_id, limitNivel2);
        //       }
        //       if (response?.length >= limitNivel2 && response?.length > 0) {
        //         dataVideosForCaso2.push(iDs);
        //         totalDataVideos++;
        //       }
        //       if (totalDataVideos >= limitNivel1) {
        //         break;
        //       }
        //     }
        //     if (totalDataVideos > limitNivel1) {
        //se utiliza el método slice para reducir la longitud del arreglo dataVideosForCaso2 a first elementos
        //       dataVideosForCaso2 = dataVideosForCaso2.slice(0, limitNivel1);
        //       totalDataVideos = limitNivel1;
        //       break;
        //     }
        //   } while (totalDataVideos === limitNivel1);
        //   return dataVideosForCaso2;
        // }
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
    async videosByGame(video, { limitNivel2 = 50 }) {
      try {
        let dataVideosCaso2 = [];
        let totalDataVideos = 0;
        do {
          const response = await getDataVideos(video.game_id, limitNivel2);
          if (response.length >= limitNivel2 && response.length > 0) {
            for (const data of response) {
              dataVideosCaso2.push(data);
              totalDataVideos++;
            }
          }
          if (totalDataVideos > limitNivel2) {
            dataVideosCaso2 = dataVideosCaso2.slice(0, limitNivel2);
            totalDataVideos = limitNivel2;
            break;
          }
        } while (totalDataVideos < limitNivel2);
        return dataVideosCaso2;
      } catch (error) {
        console.log(error);
      }
    },
  },
  VideosByGame: {
    async clipsByUser(clips, { limitNivel3 = 50 }) {
      let dataVideosCaso3 = [];
      let totalDataClips = 0;
      do {
        const response = await getDataClipsByUser(clips.user_id, limitNivel3);
        if (response.length > 0 && response.length >= limitNivel3) {
          for (const dataClips of response) {
            dataVideosCaso3.push(dataClips);
            totalDataClips += response.length;
          }
        }
        if (totalDataClips > limitNivel3) {
          //se utiliza el método slice para reducir la longitud del arreglo dataVideosForCaso2 a first elementos
          dataVideosCaso3 = dataVideosCaso3.slice(0, limitNivel3);
          totalDataClips = limitNivel3;
          break;
        }
      } while (totalDataClips < limitNivel3);
      return dataVideosCaso3;
      // const idUser = dataVideos.filter((resp) => resp.user_id);
      // for (const iDs of idUser) {
      //   response = await getDataClipsByUser(iDs.user_id, limitNivel2);
      //   if (response?.length >= limitNivel2 && response?.length > 0) {
      //     dataVideosForCaso3.push(iDs);
      //     totalDataVideos++;
      //   }

      //   if (totalDataVideos >= limitNivel2) {
      //     break;
      //   }
      // }
      // if (totalDataVideos > limitNivel2) {
      //   //se utiliza el método slice para reducir la longitud del arreglo dataVideosForCaso2 a first elementos
      //   dataVideosForCaso3 = dataVideosForCaso3.slice(0, limitNivel2);
      //   totalDataVideos = limitNivel2;
      //   break;
      // }
      //} while (totalDataVideos === limitNivel2);
      //return dataVideosForCaso3;
      //const dataClips = await getDataClipsByUser(clips.user_id, limitNivel3);
      //return dataClips;
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
