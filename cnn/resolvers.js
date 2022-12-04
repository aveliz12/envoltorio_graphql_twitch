const fetch = require("node-fetch");

const resolvers = {
  Query: {
    getLiveStreams: () => {
      fetch("https://api.twitch.tv/helix/streams")
        .then((resp) => {
          return resp.json();
        })
        .then((respuesta) => {
          console.log(respuesta);
        });
    },
  },
};

module.exports = resolvers;
