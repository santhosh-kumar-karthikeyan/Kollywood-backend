
// const axiosOptions = {
//     headers: {
//       accept: 'application/json',
//       Authorization: `Bearer ${TMDB_API_KEY}`
//     }
//   };
// async function getRandomMovie() {
//     const randomPage = Math.floor(Math.random() * 10) + 1;
//     const movieFetchURL = "https://api.themoviedb.org/3/discover/movie";
//     const axiosOptions = {
//         headers: {
//             accept: 'application/json',
//             Authorization: `Bearer ${TMDB_API_KEY}`
//         },
//         params: {
//             include_adult : false,
//             include_video : false,
//             language : 'en-US',
//             page : randomPage,
//             sort_by : 'popularity.desc',
//             with_original_language: 'ta'
//         }
//     };
//     const MovieList = await axios.get(movieFetchURL,axiosOptions);
//     console.log(MovieList);
// //     const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_original_language=ta';
// //     const options = {
// //     method: 'GET',
// //     headers: {
// //         accept: 'application/json',
// //         Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWVjNjI1NGZmYjU1NTU3YjkwNzcyYjc3ZTg0YmFlYSIsIm5iZiI6MTc0MjAxMTI5OS42MTksInN1YiI6IjY3ZDRmYmEzNzkwZDc4NjMzYTAxMGZiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GTVKQKFsokk4bfxnxM7OtpgYJZt3nj2ReDpTBBY9a5E'
// //     }
// //     };
// //     fetch(url, options)
// //   .then(res => res.json())
// //   .then(json => console.log(json))
// //   .catch(err => console.error(err));

//     // const url = 'https://api.themoviedb.org/3/discover/movie';

//     // const options = {
//     // method: 'GET',
//     // headers: {
//     //     accept: 'application/json',
//     //     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWVjNjI1NGZmYjU1NTU3YjkwNzcyYjc3ZTg0YmFlYSIsIm5iZiI6MTc0MjAxMTI5OS42MTksInN1YiI6IjY3ZDRmYmEzNzkwZDc4NjMzYTAxMGZiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GTVKQKFsokk4bfxnxM7OtpgYJZt3nj2ReDpTBBY9a5E'
//     // },
//     // params: {
//     //     include_adult: false,
//     //     include_video: false,
//     //     language: 'en-US',
//     //     page: 1,
//     //     sort_by: 'popularity.desc',
//     //     with_original_language: 'ta'
//     // }
//     // };

//     // axios(url, options)
//     // .then(response => console.log(response.data))
//     // .catch(error => console.error(error));

// }
// // const randomMovieIndex = Math.floor(Math.random() * MovieList.results);
// getRandomMovie();