(async () => {
    const accessToken = await getSpotifyAccessToken();
    const trackName = await getSongName("Kannum Kannum Kollaiyadithaal",accessToken);
    console.log(trackName);
})();