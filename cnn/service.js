const fetch = require("node-fetch");
require("dotenv").config();

const {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} = require("@apollo/client/core");
const {
  queryLiveStreams,
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
const getJsonTokenData = async (path) => {
  const token = store.get("token");
  const response = await axios.get(`https://api.twitch.tv/helix/${path}`, {
    //method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Client-Id": "jknt4r853wgvdy5sph9ld34dico3rh",
    },
    timeout: 7200000,
  });
  return response.data;
};

//Funcion obtener LiveStreams
const getDataLiveStreams = async (first) => {
  try {
    let cursor = null;
    let dataStreams = [];
    const token = store.get("token");

    client.setLink(
      new RestLink({
        //bodySerializer: (body) => JSON.stringify(body),
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
          limitNivel2: first > 50 ? 50 : first,
          cursor: cursor === null ? "" : `&after=${cursor}`,
        },
      });

      first = first - response.data.liveStreams.data.length;
      dataStreams = [...dataStreams, ...response.data.liveStreams.data];
      if (response.data.liveStreams.pagination.cursor !== "") {
        cursor = response.data.liveStreams.pagination.cursor;
      } else {
        break;
      }
    }
    return dataStreams;
  } catch (error) {
    console.log(error);
  }
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
      if (response.data.length > 0) {
        first = first - response.data.length;
        dataVideos = [...dataVideos, ...response.data];
        if (
          response.pagination.length > 0 ||
          response.pagination.cursor !== undefined
        ) {
          cursor = response.pagination.cursor;
        } else {
          break;
        }
      } else {
        break;
      }
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
      if (dataClipsByUser.data.length > 0) {
        first = first - dataClipsByUser.data.length;
        dataClips = [...dataClips, ...dataClipsByUser.data];
        if (
          dataClipsByUser.pagination.length > 0 ||
          dataClipsByUser.pagination.cursor !== undefined
        ) {
          cursor = dataClipsByUser.pagination.cursor;
        } else {
          break;
        }
      } else {
        break;
      }
      if (first === 0) {
        break; // Se han obtenido todos los datos requeridos, salir del bucle
      }
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

    dataChannel = [...dataChannel, ...dataInformationChannel.data];

    return dataChannel;
  } catch (error) {
    console.log(error);
  }
};

//Funcion para extraer la informacion del juego
const getDataInformationGame = async (id) => {
  try {
    const token = store.get("token");
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

    dataGames = [...dataGames, ...dataInformationGame.data];

    return dataGames;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getDataLiveStreams,
  getDataVideos,
  getDataClipsByUser,
  getDataInformationChannel,
  getDataInformationGame,
};
