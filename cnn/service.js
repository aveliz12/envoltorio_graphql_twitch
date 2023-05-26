const fetch = require("node-fetch");
require("dotenv").config();

const {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} = require("@apollo/client/core");
const {
  queryLiveStreams,
  queryVideosByGame,
  queryClipsByUser,
  queryChannelInfo,
  queryGameInfo,
} = require("../models/modelApolloRest");
const { RestLink } = require("apollo-link-rest");
const axios = require("axios");
const { buildAxiosFetch } = require("@lifeomic/axios-fetch");

const Storage = require("node-storage");
const store = new Storage("./store");
/* Configuración del tiempo de espera en apollo client */
const instanceAxios = axios.create({
  timeout: 7200000,
});
const uri = "https://api.twitch.tv/helix/";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch: buildAxiosFetch(instanceAxios) }),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

/*--------------------------------------------------Peticiones --------------------------------- */

//Funcion obtener LiveStreams
const getDataLiveStreams = async (first) => {
  try {
    let cursor = null;
    let dataStreams = [];
    const token = store.get("token");

    client.setLink(
      new RestLink({
        bodySerializer: (body) => JSON.stringify(body),
        uri: "https://api.twitch.tv/helix/",
        //customFetch: fetch,
        headers: {
          Authorization: "Bearer " + token,
          "Client-Id": process.env.CLIENTID,
        },
      })
    );
    //CONSULTA
    while (first > 0) {
      const response = await client.query({
        query: queryLiveStreams,
        variables: {
          limitNivel1: first > 50 ? 50 : first,
          cursor: cursor === null ? "" : `&after=${cursor}`,
        },
      });

      first = first - response.data.liveStreams.data.length;
      dataStreams = [...dataStreams, ...response.data.liveStreams.data];
      cursor = response.data.liveStreams.pagination.cursor;
    }
    return dataStreams;
  } catch (error) {
    console.log(error);
  }
};

//Funcion para extraer VideosByGame
const getDataVideosByGame = async (id, first) => {
  try {
    let cursor = null;
    let dataVideos = [];
    const token = store.get("token");
    console.log("METODO DE VIDEOS ");
    //CONSULTA
    client.setLink(
      new RestLink({
        bodySerializer: (body) => JSON.stringify(body),
        uri: "https://api.twitch.tv/helix/",
        headers: {
          Authorization: "Bearer " + token,
          "Client-Id": process.env.CLIENTID,
        },
      })
    );

    while (first > 0) {
      console.log("EMPEZANDO EL CONSUMO");
      const response = await client.query({
        query: queryVideosByGame,
        variables: {
          id,
          limitNivel2: first > 50 ? 50 : first,
          cursor: cursor === null ? "" : `&after=${cursor}`,
        },
      });
      const dataVideosByGame = response.data.videosByGame;
      // if (
      //   dataClipsByUser?.data?.length > 0 ||
      //   dataClipsByUser?.pagination?.length > 0
      // ) {
      console.log(dataVideosByGame);
      first = first - dataVideosByGame.data.length;
      dataVideos = [...dataVideos, ...dataVideosByGame.data];
      if (dataVideosByGame.pagination.cursor !== undefined) {
        cursor = dataVideosByGame.pagination.cursor;
      } else {
        console.log("NO HAY DATOS");
        break;
      }
      // } else {
      //   break;
      // }
    }

    return dataVideos;
  } catch (error) {
    console.log(error);
  }
};

//Funcion para extraer clips por usuario
const getDataClipsByUser = async (id, first) => {
  try {
    let cursor = null;
    let dataClips = [];
    const token = store.get("token");

    //CONSULTA
    client.setLink(
      new RestLink({
        bodySerializer: (body) => JSON.stringify(body),
        uri: "https://api.twitch.tv/helix/",
        headers: {
          Authorization: "Bearer " + token,
          "Client-Id": process.env.CLIENTID,
        },
      })
    );

    while (first > 0) {
      const response = await client.query({
        query: queryClipsByUser,
        variables: {
          id,
          limitNivel3: first > 50 ? 50 : first,
          cursor: cursor === null ? "" : `&after=${cursor}`,
        },
      });
      const dataClipsByUser = response.data.clipsUser;
      // if (
      //   dataClipsByUser?.data?.length > 0 ||
      //   dataClipsByUser?.pagination?.length > 0
      // ) {
      first = first - dataClipsByUser.data.length;
      dataClips = [...dataClips, ...dataClipsByUser.data];
      //if (dataClipsByUser.pagination.cursor !== undefined) {
      cursor = dataClipsByUser.pagination.cursor;
      //}
      // } else {
      //   break;
      // }
    }

    return dataClips;
  } catch (error) {
    console.log(error);
  }
};

//Funcion para extraer Informacion del canal
const getDataInformationChannel = async (id) => {
  try {
    const token = store.get("token");
    // let cursor = null;
    let dataChannel = [];

    //CONSULTA
    client.setLink(
      new RestLink({
        bodySerializer: (body) => JSON.stringify(body),
        uri: "https://api.twitch.tv/helix/",
        headers: {
          Authorization: "Bearer " + token,
          "Client-Id": process.env.CLIENTID,
        },
      })
    );

    const response = await client.query({
      query: queryChannelInfo,
      variables: {
        id,
      },
    });
    const dataInformationChannel = response.data.channelInfo;

    //first = first - dataInformationChannel.data.length;
    dataChannel = [...dataChannel, ...dataInformationChannel.data];
    // cursor = dataInformationChannel.pagination.cursor;

    return dataChannel;
  } catch (error) {
    console.log(error);
  }
};

//Funcion para extraer la informacion del juego
const getDataInformationGame = async (id) => {
  try {
    const token = store.get("token");
    // let cursor = null;
    let dataGames = [];

    //CONSULTAS
    client.setLink(
      new RestLink({
        bodySerializer: (body) => JSON.stringify(body),
        uri: "https://api.twitch.tv/helix/",
        headers: {
          Authorization: "Bearer " + token,
          "Client-Id": process.env.CLIENTID,
        },
      })
    );
    const response = await client.query({
      query: queryGameInfo,
      variables: {
        id,
      },
    });
    const dataInformationGame = response.data.gameInfo;

    //first = first - dataInformationGame.data.length;
    dataGames = [...dataGames, ...dataInformationGame.data];
    // cursor = dataInformationGame.pagination.cursor;

    return dataGames;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getDataLiveStreams,
  getDataVideosByGame,
  getDataClipsByUser,
  getDataInformationChannel,
  getDataInformationGame,
};
