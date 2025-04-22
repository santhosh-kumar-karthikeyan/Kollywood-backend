const { getRandomMovie } = require("../utils/getMovieDetails");
const { getSpotifyAccessToken, getSongName } = require("../utils/getSongDetails");

module.exports = class Clue {
    movieName = "";
    heroName = "";
    heroineName = "";
    songName = "";
    async populateClue() {
        const {movieId, movieTitle, heroName, heroineName } = await getRandomMovie();
        const spotifyAccessToken = await getSpotifyAccessToken();
        const songName = await getSongName(movieTitle, spotifyAccessToken);
        this.movieName = movieTitle;
        this.heroName = heroName;
        this.heroineName = heroineName;
        this.songName = songName;
    }
    
    verifyClue(guess) {
        return {
            field1 : this.movieTitle === guess.movieTitle,
            field2 : this.heroName === guess.heroName,
            field3: this.heroineName === guess.heroineName,
            field4 : this.songName === guess.songName,
            allTrue : field1 === field2 === field3 === field4
        }
    }
    dispatchObscureClue() {
        return new clue(
            this.movieTitle[0],
            this.heroName[0],
            this.heroineName[0],
            this.songName[0]
        );
    }
}