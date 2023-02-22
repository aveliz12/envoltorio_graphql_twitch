//CACHE
const fetch = require("node-fetch");
const pkg = require("@apollo/client/core");
const { ApolloClient, InMemoryCache, HttpLink } = pkg;
const {
  DATA_LIVESTREAMS,
  DATA_VIDEOSBYGAME,
  DATA_INFORMATIONCHANNEL,
  DATA_CLIPSBYUSER,
  DATA_INFORMATIONGAME,
  DATA_CASOPRUEBACACHE,
} = require("../Cache/querys.js");

/*____________________CACHE______________________________*/

const uri = "http://localhost:4000/";

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
});

const casoPrueba1Cache = async () => {
  const response = await client.query({
    query: DATA_LIVESTREAMS,
  });

  console.log(response.data);
};

const casoPrueba2Cache = async () => {
  const response = await client.query({
    query: DATA_VIDEOSBYGAME,
    variables: {
      id: "id",
    },
  });

  console.log(response.data);
};

const casoPrueba3Cache = async () => {
  const response = await client.query({
    query: DATA_INFORMATIONCHANNEL,
    variables: {
      id: "id",
    },
  });

  console.log(response.data);
};

const casoPrueba4Cache = async () => {
  const response = await client.query({
    query: DATA_CLIPSBYUSER,
    variables: {
      id: "id",
    },
  });

  console.log(response.data);
};

const casoPrueba5Cache = async () => {
  const response = await client.query({
    query: DATA_INFORMATIONGAME,
    variables: {
      id: "id",
    },
  });

  console.log(response.data);
};

const casoPruebaCache = async () => {
  const response = await client.query({
    query: DATA_CASOPRUEBACACHE,
    variables: {
      first: "first",
    },
  });

  console.log(response.data);
};

module.exports = {
  casoPrueba1Cache,
  casoPrueba2Cache,
  casoPrueba3Cache,
  casoPrueba4Cache,
  casoPrueba5Cache,
  casoPruebaCache,
};
