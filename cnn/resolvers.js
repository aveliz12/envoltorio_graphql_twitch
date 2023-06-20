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
    getCasosPruebasLiveStreams: async (_, { limitNivel1 }) => {
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
        let response;
        const dataVideo = [];
        dataVideo.push(video);
        for (const idVideo of dataVideo) {
          if (idVideo.game_id.trim() === "") {
            //console.log("ID vacío encontrado. Saltando consulta de videos...");
            continue;
          }
          response = await getDataVideos(idVideo.game_id, limitNivel2);

          const eficiencia = ((response.length * 100) / limitNivel2).toFixed(2);

          console.log(
            `LA EFICIENCIA DE VIDEOS CON EL ID ${idVideo.game_id} ES: ${eficiencia}%.`
          );
        }

        return response;
      } catch (error) {
        console.log(error);
      }
    },
  },
  VideosByGame: {
    async clipsByUser(clips, { limitNivel3 = 50 }) {
      let dataVideosCaso3 = [];
      dataVideosCaso3.push(clips);
      for (const idClip of dataVideosCaso3) {
        if (idClip.user_id.trim() === "") {
          //console.log("ID vacío encontrado. Saltando consulta de videos...");
          continue;
        }
        response = await getDataClipsByUser(idClip.user_id, limitNivel3);

        const eficiencia = ((response.length * 100) / limitNivel3).toFixed(2);
        console.log(
          `LA EFICIENCIA DE CLIPS CON EL ID ${idClip.user_id} ES: ${eficiencia}%. Tiene ${response.length} datos.`
        );
      }

      return response;
    },
  },
  ClipsByUserId: {
    async channelInformation(channel) {
      const dataChannel = await getDataInformationChannel(
        channel.broadcaster_id
      );

      console.log(`LA EFICIENCIA DE INFORMACIÓN DE CANAL ES: 100%.`);
      return dataChannel;
    },
  },
  ChannelInformation: {
    async informationGame(game) {
      const dataGame = await getDataInformationGame(game.game_id);
      console.log(`LA EFICIENCIA DE INFORMACIÓN DE UN JUEGO ES: 100%.`);

      return dataGame;
    },
  },
};

module.exports = resolvers;
