import { useContext, useState } from "react";
import { MovieContext } from "../context/movieContext";
import { useNavigate, useParams } from "react-router-dom";
import { MovieButton } from "../components/MovieButton";

function AddMovieScreen() {  

    const movieContext = useContext(MovieContext);

    const viewedMovies = movieContext.viewedMovies;
    const params = useParams();
    const movieId = params.movieId.slice(1);
    const movie = movieContext.movies.find(movie => { if (movie.id === movieId) return movie; });

    const [movie2, setMovie2] = useState(Math.floor(viewedMovies.length / 2));
    const [highest, setHighest] = useState(-1);
    const [lowest, setLowest] = useState(viewedMovies.length);

    const navigate = useNavigate();

    function pickMovie1() {        
        let newLowest = movie2;        
        let newMovie2 = Math.floor((newLowest + highest) / 2);        
        if (newMovie2 === highest) {
            movieContext.addViewedMovie(movie, viewedMovies[movie2].wins + 1, viewedMovies[movie2].timesRanked + 1);            
            navigate(`/viewmovie/:${movie.id}`);
        } else {
            setMovie2(newMovie2);
            setLowest(newLowest);
        }
    }
    function pickMovie2() {
        let newHighest = movie2;        
        let newMovie2 = Math.floor((lowest + newHighest) / 2);
        if (newMovie2 === newHighest) {
            movieContext.addViewedMovie(movie, viewedMovies[movie2].wins, viewedMovies[movie2].timesRanked);            
            navigate(`/viewmovie/:${movie.id}`);
        } else {
            setMovie2(newMovie2);
            setHighest(newHighest);
        }
    }
    return (
        <div>
            <div className="movieSelectorContainer">                
                <div className="movieButtonsContainer">           
                    <MovieButton onPress={pickMovie1} movie={movie} />                     
                    <MovieButton onPress={pickMovie2} movie={viewedMovies[movie2]} />
                </div>     
            </div>
            {/* <div className="previousContainer">
                { canUndo && <button className="blackButton" onClick={handleUndo}>Undo</button> }
            </div>             */}
        </div>
    );
}

export default AddMovieScreen;