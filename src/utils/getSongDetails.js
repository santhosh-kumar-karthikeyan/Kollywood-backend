const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({path: path.resolve("../../.env")});
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyAccessToken() {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
            grant_type: 'client_credentials'
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
            }
        }
    );
    return response.data.access_token;
}

async function getSongName(movieTitle, accessToken) {
    const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }, 
        params: {
            q: `(from ${movieTitle})`,
            type: 'track',
            market: 'IN',
            limit: 1
        }
    });
    if(response.data.tracks.items.length > 0) {
        const tracks = response.data.tracks.items;
        return tracks[0].name;
    }
}

// (async () => {
//     const accessToken = await getSpotifyAccessToken();
//     const trackName = await getSongName("Remo",accessToken);
//     console.log(trackName);
// })();

module.exports = { getSpotifyAccessToken, getSongName}