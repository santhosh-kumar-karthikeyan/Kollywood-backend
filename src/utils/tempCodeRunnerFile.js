    const movieId = movie.id;
    const movieTitle = movie.title;
    const crew = await fetchCrew(movieId);
    console.log(crew);