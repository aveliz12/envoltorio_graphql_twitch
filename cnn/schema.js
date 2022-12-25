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

  type VideosByGame {
    id: String
    stream_id: String
    user_id: String
    user_login: String
    user_name: String
    title: String
    description: String
    created_at: String
    published_at: String
    url: String
    thumbnail_url: String
    viewable: String
    view_count: Double
    language: String
    type: String
    duration: String
    muted_segments: String
  }

  type ChannelInformation {
    broadcaster_id: String
    broadcaster_login: String
    broadcaster_name: String
    broadcaster_language: String
    game_id: String
    game_name: String
    title: Stirng
    delay: Int
    tags: [String]
  }

  type ClipsByUserId {
    id: String
    url: String
    embed_url: String
    broadcaster_id: String
    broadcaster_name: String
    creator_id: String
    creator_name: String
    video_id: String
    game_id: String
    language: String
    title: String
    view_count: Int
    created_at: String
    thumbnail_url: String
    duration: Double
    vod_offset: String
  }

  type InformationGameById {
    id: String
    name: String
    box_art_url: String
    igdb_id: String
  }

  type Query {
    getToken: Token
    getLiveStreams: [LiveStreams]
    getVideosByGame: [VideosByGame]
    getChannelInformation: [ChannelInformation]
    getClipsByUserId: [ClipsByUserId]
    getInformationGameById: [InformationGameById]
  }
`;

module.exports = typeDefs;
