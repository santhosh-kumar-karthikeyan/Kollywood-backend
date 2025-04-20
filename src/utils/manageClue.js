const { getRandomMovie } = require("./getMovieDetails");
const { getSpotifyAccessToken, getSongName } = require("./getSongDetails");
const clue = require("../models/clue.class");

async function getClue() {
    const {movieId, movieTitle, heroName, heroineName } = await getRandomMovie();
    const spotifyAccessToken = await getSpotifyAccessToken();
    const songName = await getSongName(movieTitle, spotifyAccessToken);
    const clueToSend = new clue(
        movieTitle,
        heroName,
        heroineName,
        songName
    );
    return clueToSend;
}

function verifyClue(clue, guess) {
    return {
        field1 : clue.movieTitle === guess.movieTitle,
        field2 : clue.heroName === guess.heroName,
        field3: clue.heroineName === guess.heroineName,
        field4 : clue.songName === guess.songName
    }
}

function dispatchOscureClue(clue) {
    return new clue(
        clue.movieTitle[0],
        clue.heroName[0],
        clue.heroineName[0],
        clue.songName[0]
    );
}

module.exports = { getClue, verifyClue, dispatchOscureClue};