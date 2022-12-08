const { ApolloServer } = require("apollo-server");
const typeDefs = require("./cnn/schema");
const resolvers = require("./cnn/resolvers");
require("dotenv").config({ path: "../variables.env" });

//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//run server

server.listen().then(({ url }) => {
  console.log(`🚀 Run server in the URL: ${url}`);
});
