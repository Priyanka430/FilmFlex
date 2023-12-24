import React, { useEffect, useState } from 'react';
import './App.css';
/*import MovieCard from './moviecart.jsx';*/

const API_URL = 'http://www.omdbapi.com?apikey=da018ce7';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hideButton, setHideButton] = useState(false);

  const searchMovies = async (title, page = 1) => {
    const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
    const data = await response.json();

    if (data && data.Search && Array.isArray(data.Search)) {
      if (page === 1) {
        setMovies(data.Search);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.Search]);
      }
    } else {
      console.error('Unexpected API response structure:', data);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    const response = await fetch(`${API_URL}&i=${imdbID}`);
    const data = await response.json();
    setSelectedMovie(data);
  };

  useEffect(() => {
    searchMovies(searchTerm);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchTerm]);

  const handleScroll = () => {
    const scrollThreshold = 200;
    setHideButton(window.scrollY > scrollThreshold);
  };

  const handlePosterClick = (imdbID) => {
    fetchMovieDetails(imdbID);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const loadMoreMovies = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    searchMovies(searchTerm, currentPage + 1);
  };

  return (
    <div className='app'>
      <h1>FilmFlex</h1>
      <div className={`search ${hideButton ? 'hide' : ''}`}>
        <input
          placeholder='Search for movies'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.trim())}
        ></input>
        <img
          src="https://raw.githubusercontent.com/gist/adrianhajdin/997a8cdf94234e889fa47be89a4759f1/raw/f13e5a9a0d1e299696aa4a0fe3a0026fa2a387f7/search.svg"
          alt="search"
          onClick={() => {
            setCurrentPage(1);
            searchMovies(searchTerm);
          }}
        />
      </div>
      {movies?.length > 0 && (
        <div className='container'>
          {movies.map((movie, index) => (
            <img
              key={index}
              src={movie.Poster}
              alt={movie.Title}
              onClick={() => handlePosterClick(movie.imdbID)}
            />
          ))}
        </div>
      )}
      <button className={`btn1 ${hideButton ? 'hide' : ''}`} onClick={loadMoreMovies}>
        Load More
      </button>
      {movies?.length === 0 && (
        <div className='Empty'>
          <h2>No movies found</h2>
        </div>
      )}

      {selectedMovie && (
        <div className='modal'>
          <button onClick={closeModal}>Close</button>
          <h2>{selectedMovie.Title}</h2>
          <p>{selectedMovie.Plot}</p>
          <p>Cast: {selectedMovie.Actors}</p>
          <p>Genre: {selectedMovie.Genre}</p>
          <p>Release Year: {selectedMovie.Year}</p>
          
        </div>
      )}
    </div>
  );
};

export default App;