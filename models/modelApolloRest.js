const { gql } = require("@apollo/client/core");

const queryLiveStreams = gql`
  query getLiveStreams($limitNivel1: Int, $cursor: String) {
    liveStreams(first: $limitNivel1, after: $cursor)
      @rest(
        type: "liveStreams"
        path: "streams?first={args.first}{args.after}"
      ) {
      data
      pagination
    }
  }
`;

const queryVideosByGame = gql`
  query getVideosByGame($id: Int, $limitNivel2: Int, $cursor: String) {
    videosByGame(id: $id, first: $limitNivel2, after: $cursor) 
    @rest(
        type: "videosByGame"
        path: "videos?game_id={args.id}&first={args.first}{args.after}"
      ) {
      data
      pagination
    }
  }
`;

const queryClipsByUser = gql`
  query getClipsByUser($id: Int, $limitNivel3: Int, $cursor: String) {
    clipsUser(id: $id, first: $limitNivel3, after: $cursor)
      @rest(
        type: "clipsUser"
        path: "clips?broadcaster_id={args.id}&first={args.first}{args.after}"
      ) {
      data
      pagination
    }
  }
`;

const queryChannelInfo = gql`
  query getChannelInformation($id: Int) {
    channelInfo(id: $id)
      @rest(type: "channelInfo", path: "channels?broadcaster_id={args.id}") {
      data
    }
  }
`;

const queryGameInfo = gql`
  query getGameInformation($id: Int) {
    gameInfo(id: $id) @rest(type: "gameInfo", path: "games?id={args.id}") {
      data
    }
  }
`;

module.exports = {
  queryLiveStreams,
  queryVideosByGame,
  queryClipsByUser,
  queryChannelInfo,
  queryGameInfo,
};
