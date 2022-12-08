const fetch = require("node-fetch");
require("dotenv").config({ path: "../variables.env" });
const Storage = require("node-storage");
const store = new Storage("./store");

const getJsonTokenData = async (path,params) => {
  const token = store.get("token");
  console.log(token);
  console.log("Bearer " + token)
  const response = await fetch(`https://api.twitch.tv/helix/${path}`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "Client-Id": "a2bf4j1rhkytvzoc4ortzn7m4yxg33",
    },
    body:params
  });
  return await response.json();
};

const resolvers = {
  Query: {
    getToken: async () => {
      const params = new URLSearchParams();
      params.append("client_id", "a2bf4j1rhkytvzoc4ortzn7m4yxg33");
      params.append("client_secret", "ri98723b3c639ub3zgltykc2znqicu");
      params.append("grant_type", "client_credentials");

      try {
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
          method: "POST",
          body: params,
        });
        const data = await response.json();

        console.log(data);
        store.put("token", data.access_token);
      } catch (error) {
        console.log(error);
      }
    },
    getLiveStreams: async () => {
      const response = await getJsonTokenData("streams");
      console.log(response);
    },
  },
};

module.exports = resolvers;
