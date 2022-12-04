const { gql } = require("apollo-server");

//Schema
const typeDefs = gql`
  type LiveStreams {
    id: String
    user_id: String
    user_login: String
    user_name: String
    game_id: String
    game_name: String
    type: String
    title: String
    viewer_count: Int
    started_at: String
    language:String
    thumbnail_url:String
    tag_ids:String
    is_mature:Boolean
  }

  type Query {
    getLiveStreams: [LiveStreams]
  }
`;

module.exports = typeDefs;
