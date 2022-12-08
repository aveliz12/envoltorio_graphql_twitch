const { gql } = require("apollo-server");

//Schema
const typeDefs = gql`
  type Token {
    access_token: String
    expires_in: Int
    token_type: String
  }

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
    language: String
    thumbnail_url: String
    tag_ids: [String]
    is_mature: Boolean
  }

  type Token {
    access_token: String
    expires_in: Int
    token_type: String
  }

  type Query {
    getLiveStreams: [LiveStreams]
    getToken: Token
  }
`;

module.exports = typeDefs;
