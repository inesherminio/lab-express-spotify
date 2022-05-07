require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((data) => {
      const artistResults = data.body.artists.items;
      res.render("artist-search-results", { artistResults });
    })
    .catch((error) =>
      console.log("The error while searching artists occurred: ", error)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const artistAlbums = data.body.items;
      res.render("albums", { artistAlbums });
    })
    .catch((error) =>
      console.log("The error while searching album occurred: ", error)
    );
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      const albumTracks = data.body.items;
      res.render("tracks", { albumTracks });
    })
    .catch((error) => {
      console.log("The error while searching tracks occurred: ", error);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
