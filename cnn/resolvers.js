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
      params.append("client_id", "jknt4r853wgvdy5sph9ld34dico3rh");
      params.append("client_secret", "5r8lg3ixe42rcl03tyjm6k8158smpy");
      params.append("grant_type", "client_credentials");

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
        const data = await getDataLiveStreams(limitNivel1);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    getLiveStreams: async (_, { first = 20 }) => {
      try {
        const dataStreams = await getDataLiveStreams(first);
        return dataStreams;
      } catch (error) {
        console.log(error);
      }
    },
    getVideosByGame: async (_, { id, first }) => {
      try {
        const dataVideos = await getDataVideos(id, first);
        return dataVideos;
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
          if (!video.game_id) {
            break; // Detener el bucle si gameId es vacío
          }
          console.log("SE CONSULTA CON EL ID: ", video.game_id);
          const response = await getDataVideos(video.game_id, limitNivel2);
          if (response.length >= limitNivel2 && response.length > 0) {
            for (const data of response) {
              dataVideosCaso2.push(data);
              totalDataVideos++;
            }
          }
          if (dataVideosCaso2.length < limitNivel2) {
            // Realizar una nueva consulta con un nuevo gameId
            console.log(
              "CONSULTA INCOMPLETA. SE REALIZARÁ UNA NUEVA CONSULTA."
            );
            break;
          }
        } while (totalDataVideos < limitNivel2);
        if (totalDataVideos > limitNivel2) {
          dataVideosCaso2 = dataVideosCaso2.slice(0, limitNivel2);
          totalDataVideos = limitNivel2;
        }
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
        console.log("SE CONSULTA CON EL ID DE USUARIO: ", clips.user_id);
        const response = await getDataClipsByUser(clips.user_id, limitNivel3);
        if (response.length > 0 && response.length >= limitNivel3) {
          for (const dataClips of response) {
            dataVideosCaso3.push(dataClips);
            totalDataClips += response.length;
          }
        }
        if (dataVideosCaso3.length < limitNivel3) {
          // Realizar una nueva consulta con un nuevo gameId
          console.log("CONSULTA INCOMPLETA. SE REALIZARÁ UNA NUEVA CONSULTA.");
          break;
        }
      } while (totalDataClips < limitNivel3);
      if (totalDataClips > limitNivel3) {
        //se utiliza el método slice para reducir la longitud del arreglo dataVideosForCaso2 a first elementos
        dataVideosCaso3 = dataVideosCaso3.slice(0, limitNivel3);
        totalDataClips = limitNivel3;
      }
      return dataVideosCaso3;
    },
  },
  ClipsByUserId: {
    async channelInformation(channel) {
      const dataChannel = await getDataInformationChannel(
        channel.broadcaster_id
      );
      return dataChannel;
    },
  },
  ChannelInformation: {
    async informationGame(game) {
      const dataGame = await getDataInformationGame(game.game_id);
      return dataGame;
    },
  },
};

module.exports = resolvers;
