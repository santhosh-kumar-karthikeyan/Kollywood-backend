const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv")
dotenv.config({
    path: path.resolve('../../.env')
});
const TMDB_API_KEY = process.env.TMDB_API_KEY.trim();

async function fetchMovie() {
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const movieFetchURL = "https://api.themoviedb.org/3/discover/movie";
    const movieOptions = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_KEY}`
        },
        params: {
            include_adult : false,
            include_video : false,
            language : 'en-US',
            page : randomPage,
            sort_by : 'popularity.desc',
            with_original_language: 'ta'
        }
    };
    let MovieList;
    let MovieCount = 20;
    try {
        const response = await axios.get(movieFetchURL, movieOptions);
        MovieList = response.data.results;
        MovieCount = response.data.results.length;
    } catch (error) {
        console.error(error);
    }      
    const movieSelected = MovieList[Math.floor(Math.random() * MovieCount)];
    return movieSelected; // .id for id , .title for title
}

async function fetchCast(movie_id) {
    const crewFetchURL = `https://api.themoviedb.org/3/movie/${movie_id}/credits`;
    const crewOptions = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_KEY}`
        },
        params: {
            language : 'en-US'
        }
    };
    let crew;
    try {
        const response = await axios.get(crewFetchURL,crewOptions);
        crew = response.data.cast;
    }
    catch(error) {
        console.error(error);
    }
    return crew;
}

async function fetchHeroAndHeroine(cast) {
    const actors = cast.filter((member) => member.known_for_department === "Acting").slice(0,10);
    let hero = null, heroine = null;
    let count = 0;
    while(!hero && !heroine || count <= 10) {
        if(!hero && actors[count].gender === 2)
            hero = actors[count]
        if(!heroine && actors[count].gender === 1)
            heroine = actors[count]
        count++;
    }
    return {hero,heroine};
}

async function getRandomMovie() {
    const movie = await fetchMovie();
    const movieId = movie.id;
    const movieTitle = movie.title;
    console.log(movieTitle);
    const cast = await fetchCast(movieId);
    console.log(movieId);
    fetchHeroAndHeroine(cast);
    const { hero, heroine } = await fetchHeroAndHeroine(cast);
    console.log(hero);
    console.log(heroine);
    
}
getRandomMovie();