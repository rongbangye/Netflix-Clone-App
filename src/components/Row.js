import React, { useState, useEffect } from "react";
import axios from "../axios";
import "../styles/Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // A snippet of code which runs based on a specific condition/variable
  useEffect(() => {
    // if [], run once when the row loads, and don't run again
    // if [movies], row loads whenever movies change
    async function fetchData() {
      //baseURL: "https://api.themovied.org/3",
      const request = await axios.get(fetchUrl);
      // console.log(request);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]); // if your useEffect use outside dependency, you have to put that in the []

  console.log(movies);
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1
    }
  };

  const handleClick = movie => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then(url => {
          // https://www.youtube.com/watch?v=QWbMckU3AOQ
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      {/* title */}
      <h2 className="row__title">{title}</h2>
      {/* container -> posters */}
      <div className="row__posters">
        {/** row__poster */}
        {movies.map(movie => (
          <img
            onClick={() => handleClick(movie)}
            key={movie.id}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {/* "&&" is condtio means when we have a trailerUrl, the we run the video */}
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}{" "}
    </div>
  );
}

export default Row;
