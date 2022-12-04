const { ApolloServer } = require("apollo-server");
const typeDefs = require("./cnn/schema");
const resolvers = require("./cnn/resolvers");
require("dotenv").config({ path: "../variables.env" });

//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["Authorization"] || "";
    if (token) {
      try {
        const ususarioToken = jwt.verify(token, process.env.SECRETWORD);
        return {
          ususarioToken,
        };
      } catch (error) {
        console.log("Hubo un error");
        console.log(error);
      }
    }
  },
});

//run server

server.listen().then(({ url }) => {
  console.log(`🚀 Run server in the URL: ${url}`);
});
