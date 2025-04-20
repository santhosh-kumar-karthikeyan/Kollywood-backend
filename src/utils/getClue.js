const { getRandomMovie } = require("./getMovieDetails");
const { getSpotifyAccessToken, getSongName } = require("./getSongDetails");
const clue = require("../models/clue");

async function getClue() {
    const {movieId, movieTitle, heroName, heroineName } = await getRandomMovie();
    const spotifyAccessToken = await getSpotifyAccessToken();
    const songName = await getSongName(movieTitle, spotifyAccessToken);
    const clueToSend = new clue({
        movieTitle,
        heroName,
        heroineName,
        songName
    });
    return clueToSend;
}

module.exports = getClue;