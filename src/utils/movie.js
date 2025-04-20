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
    const movie_id = movieSelected.id;
    const movieName = movieSelected.title;
    return movieSelected; // .id for id , .title for title
}

async function fetchCrew(movieId) {
    const crewFetchURL = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
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
        crew = response.data.crew;
    }
    catch(error) {
        console.error(error);
    }
    if(!crew) {
        return { status : 404, message: "crew not found"};
    }



}


async function getRandomMovie() {
    

    console.log(movie_id);
    console.log(movieName);
    // let crew;
    // try {
    //     const response = await axios.get(crewFetchURL,crewOptions );
    //     crew = response.data.crew;
    //     console.log(crew);
    // } 
    // catch(error) {
    //     console.error(error);
    // }
}
getRandomMovie();