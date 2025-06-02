import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MovieContext } from "../context/movieContext";
import './MovieScreen.css';
import { ColorContext } from "../context/colorContext";
import { AuthContext } from "../context/authContext";
import { fetchMovies, removeMovie } from "../util/http";

function MovieScreen() {
    // get color context
    const colorCtx = useContext(ColorContext);
    // get movie context
    const movieContext = useContext(MovieContext);
    // get authentication context
    const authCtx = useContext(AuthContext);
    // set variable of viewed movies from context
    const viewedMovies = movieContext.viewedMovies;
    // set variable of all movies from context
    const [movies, setMovies] = useState();
    // set navigation function
    const navigate = useNavigate();
    // set parameters from navigation
    const params = useParams();

    const [isLoading, setIsLoading] = useState(true);

    // movie id will be in the nav link  from the movie list it was chosen from
    const movieId = params.movieId.slice(1); // set movie id from params
    const [movie, setMovie] = useState({});

    useEffect(() => {
        async function getMovies() {
            const response = await fetchMovies();
            setMovies(response);
            setIsLoading(false);
        } 
        getMovies();

    }, []);

    useEffect(() => {
        const movieFromContext = movies?.find(mov => mov.id.toString() === movieId);
        if (movieFromContext) {
            setMovie(movieFromContext);
        }
    }, [movies, movieId]);  // Only run when movies or movieId changes  

    const viewedMovieIds = movieContext.viewedMovies.map(mov => { // map all viewed movie ids to an array
        return mov.id;
    });

    function addMovie() {
        // This function handles the add movie button that will only be available if the movie is not on the users list
        if (viewedMovies.length === 0) { // If the list is empty, this movie will be added to the top of the users list
            movieContext.addViewedMovie(movie, 1, 1);
            navigate(`/viewmovie/:${movieId}`); // navigate to reload the page
        } else { // If the list has at least one movie
            if (viewedMovieIds.includes(movieId)) {  // If this movie is already in the user list
                movieContext.removeMovie(viewedMovies.find(mov => { if (mov.id.toString() === movieId) return mov; })); // removes the movie
            }
            navigate(`/addmovie/:${movieId}`); // Navigate to the add movie screen
        }        
    }

    function deleteMovie() { // handles the remove movie button that is only available to a user if the movie is in their list.
        viewedMovieIds.splice(movieId, 1); // remove the id from viewed movie ids
        movieContext.removeMovie(viewedMovies.find(mov => { if (mov.id.toString() === movieId) return mov; })); // remove the movie from viewed movies
        navigate(`/viewmovie/:${movieId}`); // Navigate to reload the page
    }

    function removeFromDatabase() {
        let result = window.confirm("Are you sure you want to delete this movie? Doing so will remove it from every user list in the database.");
        if (result === true) {
            removeMovie(movieId);
          }         
    }

    function navEditMovie() {
        navigate(`/postmovie/:${movie.id}`);
    }

    // Sort all movies to get an accurate placement of all movies.
    movies?.sort((a, b) => b.timesRanked - a.timesRanked);
    viewedMovies.sort((a, b) => b.timesRanked - a.timesRanked);
    movies?.sort((a, b) => (b.wins / b.timesRanked) - (a.wins / a.timesRanked));
    viewedMovies.sort((a, b) => (b.wins / b.timesRanked) - (a.wins / a.timesRanked));

    const movieRuntime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
    
    return (        
        <div className="movieInfoContainer"> 
            {isLoading ? <p>Loading...</p> :    <div>       
            <div style={{ borderColor: colorCtx.primary }} className="movieTitle">{movie.title}</div>
            <div className="movieImageContainer">
            {Array.isArray(movie.poster) && movie.poster.length > 0 ? <img className="movieScreenImage" src={ movie.poster[Math.floor(Math.random() * movie.poster.length)]} /> : <p>Loading movie poster...</p> }
            </div>
                <p className="movieAltText">Global Ranking: {movies.indexOf(movies.find(mov => { if (mov.id.toString() === movieId) return mov; })) + 1}</p>
                <p>
                    Directed by: {movie.director}
                    <br />Release year: {movie.releaseYear}
                    <br />Runtime: {movieRuntime}
                    <br />Rated:  {movie.rating} 
                    <br />Genres: {movie?.genres}
                </p>
                <p>{movie.description}</p>
                { 
                    viewedMovieIds.includes(movieId) 
                        ?
                            <div>
                                <p className="movieAltText">You're ranking: {viewedMovies.indexOf(viewedMovies.find(mov => { if (mov.id === movieId) return mov; })) + 1}</p>
                                
                                <div className="buttonsContainer">
                                    <button className="movieInfoButton" onClick={deleteMovie}>Remove From Your List</button>
                                    { viewedMovieIds.length > 1 && <button className="movieInfoButton" onClick={addMovie}>Re-Rank</button> }
                                </div>
                                <div className="buttonsContainer">
                                    { authCtx.userLevel > 1 && <button className="movieInfoButton" onClick={removeFromDatabase}>Remove From Database</button> }
                                    { authCtx.userLevel > 1 && <button className="movieInfoButton" onClick={navEditMovie}>Edit Movie</button> }
                                </div>
                            </div>
                        :
                           authCtx.isAuthenticated && <button className="movieInfoButton" onClick={addMovie}>Add to Your List</button> 
                }
                </div>
            }
            
        </div>
    );
}

export default MovieScreen;