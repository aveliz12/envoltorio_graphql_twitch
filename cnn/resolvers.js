const streams = [
  {
    name: "JavaScript",
  },
  {
    name: "GraphQL",
  },
];

const resolvers = {
  Query: {
    getLiveStreams: () => {
      return streams;
    },
  },
};

module.exports = resolvers;
