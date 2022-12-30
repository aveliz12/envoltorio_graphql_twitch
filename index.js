const { ApolloServer } = require("apollo-server");
const { fileLoader, mergeTypes } = require("merge-graphql-schemas");
const typeDefs = mergeTypes(fileLoader(`${__dirname}/**/*.graphql`));
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
