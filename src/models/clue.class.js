const { getRandomMovie } = require("../utils/getMovieDetails");
const { getSpotifyAccessToken, getSongName } = require("../utils/getSongDetails");

module.exports = class Clue {
    values = [];
    constructor() {}
    async populateClue() {
        const {movieTitle, heroName, heroineName } = await getRandomMovie();
        const spotifyAccessToken = await getSpotifyAccessToken();
        const songName = await getSongName(movieTitle, spotifyAccessToken);
        this.values.push(movieTitle);
        this.values.push(heroName);
        this.values.push(heroineName);
        this.values.push(songName);
    }
    
    verifyClue(guess) {
        return [this.movieName === guess.movieName,this.heroName === guess.heroName,this.heroineName === guess.heroineName,this.songName === guess.songName ]
    }
    dispatchObscureClue() {
        return [this.values[0][0],this.values[1][0],this.values[2][0],this.values[3][0]];
    }
}