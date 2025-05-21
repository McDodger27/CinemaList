import { useState, useContext, useEffect } from "react";
import { MovieButton } from '../components/MovieButton';
import { MovieContext } from '../context/movieContext';
import './RankScreen.css';
import { AuthContext } from "../context/authContext";
import { ColorContext } from "../context/colorContext";
import { useNavigate } from "react-router-dom";

export function RankScreen({ mode }) {
    const movieContext = useContext(MovieContext);

    //get authentication context
    const authCtx = useContext(AuthContext);

    //get color context
    const colorCtx = useContext(ColorContext);

    // get navigate using useNavigate hook
    const navigate = useNavigate();

    
    

    const [movies, setMovies] = useState(mode === "viewed" ? movieContext.viewedMovies : movieContext.movies);

    // create two state variables to store the movie options
    const [movie1, setMovie1] = useState(0);
    const [movie2, setMovie2] = useState(1);

    useEffect(() => {
        if (mode === "viewed") {
            setMovies(movieContext.viewedMovies);
        } else {
            setMovies(movieContext.movies);
        }
    }, [mode, movieContext.movies, movieContext.viewedMovies]);

    useEffect(() => {
        setMovie1(Math.floor(Math.random() * movies.length));
        setMovie2(Math.floor(Math.random() * movies.length));
    }, [movies])

    
    const [canUndo, setCanUndo] = useState(false);
    function setMovieOptions() {
        // function to set the 2 random movies by setting a random number between 0 and the movies array length

        // set 2 random numbers
        let rn1 = Math.floor(Math.random() * movies.length); 
        let rn2 = Math.floor(Math.random() * movies.length);

        while (rn1 === movie1) { // This loop will make sure that movies for option one will not repeat
            rn1 = Math.floor(Math.random() * movies.length);
        }
        while (rn2 === movie2) { // This loop repeats the same process for the second number
            rn2 = Math.floor(Math.random() * movies.length);            
        }
        while(rn1 === rn2) { // This loop ensures that the two movie options will not be the same as one another
            rn2 = Math.floor(Math.random() * movies.length);
        }
        
        // update the state variables now that the numbers have been validated
        setMovie1(rn1);
        setMovie2(rn2);
        setCanUndo(true);
    }

    function pickMovie1() {    
        // this function is called when the user pushes option one
        if (mode === "viewed") {
            movieContext.rankViewedMovies(movie1, movie2); // this function adds a win to movie1 in the viewed movies list
        } else {
            movieContext.rankMovies(movie1, movie2); // this function adds a win to movie1 in the all movies
        }        
        setMovieOptions();  
    }

    function pickMovie2() {    
        // this function is called when the user pushes option two
        if (mode === "viewed") {
            movieContext.rankViewedMovies(movie2, movie1); // this function adds a win to movie2 in the viewed movies list
        } else {
            movieContext.rankMovies(movie2, movie1); // this function adds a win to movie2 in the all movies
        }
        setMovieOptions();  
    }


    function reloadMovie1() {
        // this function is called when a user has not seen one of the movie options yet and they want a different option.
        let rn = Math.floor(Math.random() * movies.length);
        while (rn === movie1) {
            rn = Math.floor(Math.random() * movies.length);
            while (rn === movie2) {
                rn = Math.floor(Math.random() * movies.length);
            }
        }
        setMovie1(rn);
    }

    function reloadMovie2() {
        // this function is called when a user has not seen one of the movie options yet and they want a different option.
        let rn = Math.floor(Math.random() * movies.length);
        while (rn === movie2) {
            rn = Math.floor(Math.random() * movies.length);            
        }
        while (rn === movie1) {
            rn = Math.floor(Math.random() * movies.length);
        }
        setMovie2(rn);
    }

    function PreviousMovieInfo() {
        const previousWinnerId = movieContext.previousMovieIds[0];       

        let message = ''
        if (movieContext.viewedMovies && movieContext.viewedMovies.length > 0) {
            movieContext.viewedMovies.sort((a, b) => b.timesRanked - a.timesRanked);
            movieContext.viewedMovies.sort((a, b) => (b.wins / b.timesRanked) - (a.wins / a.timesRanked));
            movieContext.viewedMovies.forEach(movie => {
                if (movie.id === previousWinnerId) {
                    const moviePosition = movieContext.viewedMovies.indexOf(movie) + 1;
                    const lastDigit = moviePosition % 10;
                    // order movies to get the position of the new position of the winner   
                    
                    if (lastDigit === 1 && (moviePosition % 100) !== 11) { // A number ending in 1 that is not 11 will be printed out as 1st/21st and so on.
                        message += movie.title + ' is ranked ' + (moviePosition) + 'st on your list.' ;
                    } else if (lastDigit === 2 && (moviePosition % 100 !== 12)) { // A number ending in 2 that is not 12 will be printed out as 2nd/32nd and so on.
                        message += movie.title + ' is ranked ' + (moviePosition) + 'nd on your list.' ;
                    } else if (lastDigit === 3 && (moviePosition % 100 !== 13)) { // A number ending in 3 that is not 13 will be printed out as 3rd/43rd and so on.
                        message += movie.title + ' is ranked ' + (moviePosition) + 'rd on your list.' ;
                    } else { // All other numbers that were not compatible with the previous conditions will be printed out as 4th/112th and so on.
                        message += movie.title + ' is ranked ' + (moviePosition) + 'th on your list.' ;
                    }
                }
            });
        }
        

        if (message === '') return <p>Pick One!</p>
        else return <p>{message}</p>
    }

    function handleUndo() {
        // this function is called when the user pushes the undo button
        movieContext.undo(); // calls the undo function in movieContext.js
        // loop through all movies
        movies.forEach(movie => {
            if (movie.id === movieContext.previousMovieIds[0]) { // previousMovieIds[0] is set equal to the previous winning movies id
                setMovie1(movies.indexOf(movie)); // set movie 1 to the previous winner
            } else if (movie.id === movieContext.previousMovieIds[1]) { // previousMovieIds[1] is set equal to the previous losing movies id
                setMovie2(movies.indexOf(movie)); // set movie 2 to the previous loser
            }
        });
        setCanUndo(false); // this will remove the undo button from the screen
        // This app only manages one set of previous choices so there is only functionality to undo one choice.
    }

    function navLogin() {
        navigate("/login");
    }

    if (movie1 === movie2) {
        setMovie1(0);
        setMovie2(1);
    }

    if (mode === "viewed" && movies.length < 2) {
        return <p>You need at least 2 movies on your list to use this feature. Please rank more movies and try again.</p>
    } else if (movies.length >= 2) {
        return (
            <div className="rankScreenContainer">
                <div className="movieSelectorContainer"> 
                        { !authCtx.isAuthenticated &&
                            <p style={{ fontSize: '24px', backgroundColor: '#111', width: '300px', margin: 'auto', padding: '10px', borderRadius: '10px'}}>
                                <span style={{ color: colorCtx.primary, cursor: 'pointer' }} onClick={navLogin}>Sign in</span> and get started!
                            </p>
                        }               
                        { authCtx.isAuthenticated ? // If the user is signed in.
                            <div className="movieButtonsContainer">           
                                <MovieButton onPress={pickMovie1} movie={movies[movie1]} />                     
                                <MovieButton onPress={pickMovie2} movie={movies[movie2]} />
                            </div> 
                        : // This takes away the onPress functions if the user is not signed in.
                            <div className="movieButtonsContainer">           
                                <MovieButton movie={movies[movie1]} />                     
                                <MovieButton movie={movies[movie2]} />
                            </div>
                        }
                        {
                            !(mode === "viewed") && authCtx.isAuthenticated &&
                                <div className="unseenButtons">  
                                    <button className="blackButton" onClick={reloadMovie1}>Haven't seen it</button>  
                                    <button className="blackButton" onClick={reloadMovie2}>Haven't seen it</button> 
                                </div>
                        }
                            
                </div>
                { authCtx.isAuthenticated &&
                    <div className="previousContainer">
                        <PreviousMovieInfo /> 
                        { canUndo && <button className="blackButton" onClick={handleUndo}>Undo</button> }
                    </div>     
                }       
            </div>
        );
    } else {
        return <div>
            <p>Loading movies...</p>
        </div>
    }
   
}