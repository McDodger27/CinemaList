import { createContext, useContext, useEffect, useState, useRef } from "react";
import { deleteViewedMovie, fetchMovies, fetchUserData, storeViewedMovie, updateMovie, updateViewedMovie } from "../util/http";
import { AuthContext } from "./authContext";

export const MovieContext = createContext({
    movies: [],
    viewedMovies: [],
    rankMovies: () => {},
    undo: () => {},
    rankViewedMovies: () => {},
    addViewedMovie: () => {},
    removeMovie: () => {},
    previousMovieIds: [],
});

function MovieContextProvider({ children }) {
    const authCtx = useContext(AuthContext);
    /*
    const movies = [
        { id: 'm1', title: 'Jurassic Park', poster: ['https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg', 'https://lh4.googleusercontent.com/proxy/9ygacNO2KY37y-13GBaiCDwfRqs13TUqZZwyCntnouLPvNhwINCW4_od3gKENwwJBcmxB4EIXvr4qexNrO1lIDgu3RN-mXQfgim9Oxenr2MvPpQgsJO7E4W6c9jDPFzov2AJPHtJP4jCjOHPtfkgyFWxnA'], runtime: '122m', rating: 'PG-13', director: 'Steven Spielberg', releaseYear: 1993, wins: 82, timesRanked: 100 },
        // { id: 'm2', title: 'The Martian', runtime: '151m', rating: 'PG-13', director: 'Ridley Scott', releaseYear: 2015, wins: 2, timesRanked: 3 },
        // { id: 'm3', title: 'Rio Bravo', runtime: '141m', rating: 'NR', director: 'Howard Hawks', releaseYear: 1959, wins: 2, timesRanked: 5 },
        // { id: 'm4', title: 'Tron Legacy', runtime: '125m', rating: 'PG', director: 'Joseph Kosinski', releaseYear: 2010, wins: 1, timesRanked: 5 },
        // { id: 'm5', title: 'Interstellar', runtime: '120m', rating: 'PG-13', director: 'Christopher Nolan', releaseYear: 2014, wins: 4, timesRanked: 5 },
        // { id: 'm6', title: 'Signs', runtime: '120m', rating: 'PG-13', director: 'M. Night Shyamalan', releaseYear: 2001, wins: 6, timesRanked: 10 },
        // { id: 'm7', title: 'To Kill a Mockingbird', runtime: '129m', rating: 'NR', director: 'Robert Mulligan', releaseYear: 1962, wins: 9, timesRanked: 11 },
        { id: 'm8', title: 'Jaws', poster: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jaws_movie_poster.jpg/250px-Jaws_movie_poster.jpg'], runtime: '120m', rating: 'PG', director: 'Steven Spielberg', releaseYear: 1975, wins: 9, timesRanked: 10 },
        { id: 'm9', title: 'Dune', poster: ['https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Dune_%282021_film%29.jpg/250px-Dune_%282021_film%29.jpg', 'https://m.media-amazon.com/images/I/51gOxvAKwfL._AC_UF894,1000_QL80_.jpg', 'https://mondoshop.com/cdn/shop/products/Rory_Kurtz_Dune_REG_LARGE_d11245e1-2a0e-4239-b1ef-2caf6b069667_1024x.jpg?v=1667946688'], runtime: '120m', rating: 'PG-13', director: 'Denis Villeneuve', releaseYear: 2021, wins: 2, timesRanked: 4 },
        { id: 'm10', title: 'Dune: Part Two', poster: ['https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_.jpg', 'https://i.ebayimg.com/images/g/dOEAAOSw1T5l-Q0i/s-l400.jpg', 'https://media.themoviedb.org/t/p/w220_and_h330_face/87jZEVp4FW6GwTx56mbbqIQQF75.jpg'], runtime: '120m', rating: 'PG-13', director: 'Denis Villeneuve', releaseYear: 2023, wins: 2, timesRanked: 4 },
        // { id: 'm11', title: 'The Terminator', runtime: '120m', rating: 'R', director: 'James Cameron', releaseYear: 1988, wins: 4, timesRanked: 7 },
        { id: 'm12', title: 'Terminator 2: Judgement Day', poster: ['https://upload.wikimedia.org/wikipedia/en/8/85/Terminator2poster.jpg'], runtime: '120m', rating: 'R', director: 'James Cameron', releaseYear: 1991, wins: 6, timesRanked: 9 },
        // { id: 'm13', title: 'Dunkirk', runtime: '120m', rating: 'PG-13', director: 'Christopher Nolan', releaseYear: 2017, wins: 5, timesRanked: 9 },
        // { id: 'm14', title: 'Batman Begins', runtime: '120m', rating: 'PG-13', director: 'Christopher Nolan', releaseYear: 2005, wins: 2, timesRanked: 3 },
        // { id: 'm15', title: 'The Dark Knight', runtime: '120m', rating: 'PG-13', director: 'Christopher Nolan', releaseYear: 2008, wins: 10, timesRanked: 10 },
        // { id: 'm16', title: 'The Dark Knight Rises', runtime: '120m', rating: 'PG-13', director: 'Christopher Nolan', releaseYear: 2012, wins: 4, timesRanked: 9 },
        // { id: 'm17', title: '1917', runtime: '120m', rating: 'R', director: 'Sam Mendes', releaseYear: 2019, wins: 3, timesRanked: 6 },
        // { id: 'm18', title: 'Gladiator', runtime: '120m', rating: 'R', director: 'Ridley Scott', releaseYear: 2000, wins: 4, timesRanked: 7},
        // { id: 'm19', title: 'Troll 2', runtime: '120m', rating: 'PG', director: 'Claudio Fragasso', releaseYear: 2000, wins: 0, timesRanked: 250 },
        // { id: 'm20', title: 'Miracle', runtime: '135m', rating: 'PG', director: 'Gavin O\'Connor', releaseYear: 2004, wins: 4, timesRanked: 5 },
        { id: 'm21', title: 'The Thing', runtime: '109m', poster: ['https://upload.wikimedia.org/wikipedia/en/e/e3/The_Thing_%281982_film%29.png'], rating: 'R', director: 'John Carpenter', releaseYear: 1982, wins: 82, timesRanked: 100 },
        //{ id: 'm22', title: 'The Shinging', runtime: '120m', rating: 'R', director: 'Stanley Kubrick', releaseYear: 1982, wins: 7, timesRanked: 10 },
        //{ id: 'm23', title: 'Inception', runtime: '120m', rating: 'PG-13', director: 'Christopher Nolan', releaseYear: 2010, wins: 19, timesRanked: 26 },
        //{ id: 'm24', title: 'Insidious', runtime: '120m', rating: 'PG-13', director: 'James Wan', releaseYear: 2010, wins: 7, timesRanked: 13 },
        // { id: 'm25', title: 'The Godfather', releaseYear: 1972, wins: 11, timesRanked: 13 },
        { id: 'm26', title: 'Rise of the Planet of the Apes', poster: ['https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Rise_of_the_Planet_of_the_Apes_Poster.jpg/250px-Rise_of_the_Planet_of_the_Apes_Poster.jpg', 'https://m.media-amazon.com/images/M/MV5BMjAyNDY2NzQ2MF5BMl5BanBnXkFtZTcwNjE3Njk5NQ@@._V1_.jpg', 'https://images.justwatch.com/poster/270557822/s718/rise-of-the-planet-of-the-apes.jpg'], runtime: '120m', rating: 'PG-13', director: 'Rupert Wyatt', releaseYear: 2011, wins: 5, timesRanked: 8 },
        { id: 'm27', title: 'Dawn of the Planet of the Apes', poster: ['https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Dawn_of_the_Planet_of_the_Apes.jpg/250px-Dawn_of_the_Planet_of_the_Apes.jpg', 'https://m.media-amazon.com/images/M/MV5BZWNmODM3ZTMtNDVlZC00ODVmLTk5ZDAtNjljNDY4MWViOTVjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'], runtime: '120m', rating: 'PG-13', director: 'Matt Reeves', releaseYear: 2014, wins: 6, timesRanked: 11 },
        { id: 'm28', title: 'War for the Planet of the Apes', poster: ['https://upload.wikimedia.org/wikipedia/en/d/d7/War_for_the_Planet_of_the_Apes_poster.jpg', 'https://i.ebayimg.com/00/s/MTYwMFgxMTA1/z/ICMAAOSwEVhf4JhQ/$_57.JPG?set_id=8800005007', 'https://www.movieposters.com/cdn/shop/products/fcbdb4c538839b1731e63b35172dbcf2_39ff37ac-955b-4c5c-867e-13b12bfe3802_480x.progressive.jpg?v=1573593759'], runtime: '120m', rating: 'PG-13', director: 'Matt Reeves', releaseYear: 2017, wins: 4, timesRanked: 8 },
        // { id: 'm29', title: 'Mission Impossible', releaseYear: 1996, wins: 5, timesRanked: 8 },
        // { id: 'm30', title: 'Mission Impossible: MI2', releaseYear: 2000, wins: 3, timesRanked: 8 },
        // { id: 'm31', title: 'Iron Man', releaseYear: 2008, wins: 7, timesRanked: 8 },
        // { id: 'm32', title: 'Iron Man 2', releaseYear: 2011, wins: 7, timesRanked: 12 },
        // { id: 'm33', title: 'Iron Man 3', releaseYear: 2013, wins: 4, timesRanked: 13 },
        // { id: 'm34', title: 'Titanic', runtime: '120m', rating: 'R', director: 'James Cameron', releaseYear: 1997, wins: 6, timesRanked: 8 },
        // { id: 'm35', title: 'The Avengers', releaseYear: 2012, wins: 8, timesRanked: 13 },
        // { id: 'm36', title: 'Avengers: Age of Ultron', releaseYear: 2015, wins: 6, timesRanked: 13 },
        // { id: 'm37', title: 'Tombstone', releaseYear: 1993, wins: 5, timesRanked: 8 },
        // { id: 'm38', title: 'Raiders of the Lost Ark', runtime: '120m', rating: 'PG', director: 'Steven Spielberg', releaseYear: 1981, wins: 12, timesRanked: 16 },
        // { id: 'm39', title: 'Indiana Jones and the Temple of Doom', runtime: '120m', rating: 'PG-13', director: 'Steven Spielberg', releaseYear: 1984, wins: 7, timesRanked: 12 },
        // { id: 'm40', title: 'Indiana Jones and the Last Crusade', runtime: '120m', rating: 'PG-13', director: 'Steven Spielberg', releaseYear: 1989, wins: 9, timesRanked: 12 },
        // { id: 'm41', title: 'Transformers', runtime: '120m', rating: 'PG-13', director: 'Michael Bay', releaseYear: 2007, wins: 4, timesRanked: 7 },
        // { id: 'm42', title: 'Alien', runtime: '120m', rating: 'R', director: 'Ridley Scott', releaseYear: 1979, wins: 5, timesRanked: 7},
        // { id: 'm43', title: 'Aliens', runtime: '120m', rating: 'R', director: 'James Cameron', releaseYear: 1986, wins: 5, timesRanked: 8},
        // { id: 'm44', title: 'Arrival', runtime: '120m', rating: 'PG-13', director: 'Denis Villeneuve', releaseYear: 2016, wins: 17, timesRanked: 31 },
        // { id: 'm45', title: 'Insidious: Chapter 2', runtime: '120m', rating: 'PG-13', director: 'James Wan', releaseYear: 2013, wins: 8, timesRanked: 16 },
        // { id: 'm46', title: 'The Batman', runtime: '120m', rating: 'PG-13', director: 'Matt Reeves', releaseYear: 2022, wins: 7, timesRanked: 11 },
        // { id: 'm47', title: 'Napolean Dynamite', runtime: '120m', rating: 'PG', director: 'Jared Hess', releaseYear: 2004, wins: 15, timesRanked: 16 },
        // { id: 'm48', title: 'Nacho Libre', runtime: '120m', rating: 'PG', director: 'Jared Hess', releaseYear: 2007, wins: 13, timesRanked: 16 },
        // { id: 'm49', title: 'A Minecraft Movie', runtime: '120m', rating: 'PG', director: 'Jared Hess', releaseYear: 2025, wins: 18, timesRanked: 16 },
        // { id: 'm50', title: '2001: a Space Odyssey', runtime: '120m', rating: 'PG', director: 'Stanley Kubrick', releaseYear: 1968, wins: 12, timesRanked: 16 },
        // { id: 'm51', title: 'The Lost World: Jurassic Park', runtime: '120m', rating: 'PG-13', director: 'Steven Spielberg', releaseYear: 1997, wins: 10, timesRanked: 18 },
        // { id: 'm52', title: 'E.T. the Extra-Terrestrial', runtime: '120m', rating: 'PG', director: 'Steven Spielberg', releaseYear: 1982, wins: 79, timesRanked: 100 },
        // { id: 'm53', title: 'Star Wars: Episode I - The Phantom Menace', runtime: '120m', rating: 'PG', director: 'George Lucas', releaseYear: 1999, wins: 65, timesRanked: 100 },
        // { id: 'm54', title: 'Star Wars: Episode II - Attack of the Clones', runtime: '120m', rating: 'PG', director: 'George Lucas', releaseYear: 2002, wins: 66, timesRanked: 100 },
        // { id: 'm55', title: 'Star Wars: Episode III - Revenge of the Sith', runtime: '120m', rating: 'PG-13', director: 'George Lucas', releaseYear: 2005, wins: 76, timesRanked: 100 },
        // { id: 'm56', title: 'Star Wars: Episode IV - A New Hope', runtime: '120m', rating: 'PG', director: 'George Lucas', releaseYear: 1977, wins: 86, timesRanked: 100 },
        // { id: 'm57', title: 'Star Wars: Episode V - The Empire Strikes Back', runtime: '120m', rating: 'PG', director: 'Irvin Kershner', releaseYear: 1980, wins: 87, timesRanked: 100 },
        // { id: 'm58', title: 'Star Wars: Episode VI - Return of the Jedi', runtime: '120m', rating: 'PG', director: 'Richard Marquand', releaseYear: 1983, wins: 83, timesRanked: 100 },
        // { id: 'm59', title: 'Star Wars: Episode VII - The Force Awakens', runtime: '120m', rating: 'PG-13', director: 'J.J. Abrams', releaseYear: 2015, wins: 78, timesRanked: 100 },
        // { id: 'm60', title: 'Star Wars: Episode VIII - The Last Jedi', runtime: '120m', rating: 'PG-13', director: 'Ryan Johnson', releaseYear: 2017, wins: 69, timesRanked: 100 },
        // { id: 'm61', title: 'Star Wars: Episode IX - The Rise of Skywalker', runtime: '120m', rating: 'PG-13', director: 'J.J. Abrams', releaseYear: 2019, wins: 64, timesRanked: 100 },
        { id: 'm62', title: 'Rogue One: A Star Wars Story', runtime: '120m', poster: ['https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Rogue_One%2C_A_Star_Wars_Story_poster.png/250px-Rogue_One%2C_A_Star_Wars_Story_poster.png'], rating: 'PG-13', director: 'Gareth Edwards', releaseYear: 2016, wins: 78, timesRanked: 100 },
        { id: 'm63', title: 'Solo: A Star Wars Story', runtime: '135m', poster: ['https://upload.wikimedia.org/wikipedia/en/5/54/Solo_A_Star_Wars_Story_poster.jpg'], rating: 'PG-13', director: 'Ron Howard', releaseYear: 2018, wins: 69, timesRanked: 100 },
        // { id: 'm64', title: 'Indiana Jones and the Kingdom of the Crystal Skull', runtime: '122m', rating: 'PG-13', director: 'Steven Spielberg', releaseYear: 2008, wins: 62, timesRanked: 100 },
    ];
    */
    const [movies, setMovies] = useState([]);
    const [viewedMovies, setViewedMovies] = useState([]);
    const [previousMovieIds, setPreviousMovieIds] = useState([]);
    const viewedMovieIdsRef = useRef(new Set());
    useEffect(() => {
        async function getMovies() {
            const response = await fetchMovies();
            setMovies(response);
        } 
        getMovies();

    }, []);

    useEffect(() => {
        async function getViewedMovies() {
            const userID = sessionStorage.getItem('userID');
            const response = await fetchUserData(userID);
            if (response?.viewedMovies) {
                const movieList = [];

                for (const key in response.viewedMovies) {
                    if (response.viewedMovies.hasOwnProperty(key)) {
                        const movie = response.viewedMovies[key];
                        if (movie?.id) {
                            movieList.push({
                                id: movie.id,  
                                title: movie.title,
                                director: movie.director,
                                rating: movie.rating,
                                runtime: movie.runtime,
                                description: movie.description,
                                poster: movie.poster,
                                wins: movie.wins,
                                timesRanked: movie.timesRanked,
                                releaseYear: movie.releaseYear,
                                genres: movie.genres,
                            });
                        }                        
                    }
                }
                setViewedMovies(movieList);
                viewedMovieIdsRef.current = new Set(movieList.map(m => m.id));
            }
        }
        getViewedMovies();
    }, [authCtx.isAuthenticated, authCtx.refreshToken]); // this dependancy will run this effect every time the user authenticates.

    function addViewedMovie(movie, wins, timesRanked) {

        // get user id from session storage
        const userID = sessionStorage.getItem('userID');

        // This function adds a new movie to the user list based on a different movie.
        const movieData ={
            id: movie.id,
            title: movie.title,
            runtime: movie.runtime,
            rating: movie.rating,
            director: movie.director,
            releaseYear: movie.releaseYear,
            poster: movie.poster,
            wins: wins,
            timesRanked: timesRanked
        };
        // storeViewedMovie(movieData);
        setViewedMovies(prev => {
            const newMovieList = [...prev, movieData];
            return newMovieList;
        });
        viewedMovieIdsRef.current.add(movie.id);
        updateViewedMovie(userID, movieData);
    }

    function rankMovies(winner, loser) {

        // get user id from session storage
        const userID = sessionStorage.getItem('userID');

        // const viewedMovieIds = [];
        // if (viewedMovies) {
        //     viewedMovies.forEach(movie => {
        //         viewedMovieIds.push(movie.id);
        //     });
        // }        
        const betterMovie = movies[winner];
        const otherMovie = movies[loser];
        if (!viewedMovieIdsRef.current.has(betterMovie.id)) {
            addViewedMovie(betterMovie, 1, 1);
        } else {
            viewedMovies.forEach((movie) => {
                if (movie.id === betterMovie.id) {
                    movie.wins += 1;
                    movie.timesRanked += 1;
                    updateViewedMovie(userID, movie);
                }
            });
        }
        if (!viewedMovieIdsRef.current.has(otherMovie.id)) {
            addViewedMovie(otherMovie, 0, 1);
        } else {
            viewedMovies.forEach((movie) => {
                if (movie.id === otherMovie.id) {
                    movie.timesRanked += 1;
                    updateViewedMovie(userID, movie);
                }
            });
        }
        // updating variables locally 
        movies[winner].wins += 1;
        movies[winner].timesRanked += 1;
        movies[loser].timesRanked += 1;
        // updating database instances of winning and losing movies globally
        updateMovie(betterMovie.id, movies[winner]);
        updateMovie(otherMovie.id, movies[loser]);
        // updating database instances of viewedMovies 
        // set previous movie ids 
        setPreviousMovies(movies[winner], movies[loser]);
    }

    function rankViewedMovies(winner, loser) {
        const betterMovie = viewedMovies[winner];
        const otherMovie = viewedMovies[loser];

        movies.forEach(mov => {
            if (mov.id === betterMovie.id) {
                mov.wins += 1;
                mov.timesRanked += 1;
            } else if (mov.id === otherMovie.id) {
                mov.timesRanked += 1;
            }
        });

        viewedMovies[winner].wins += 1;
        viewedMovies[winner].timesRanked += 1;
        viewedMovies[loser].timesRanked += 1;
        setPreviousMovies(viewedMovies[winner], viewedMovies[loser]);
    }

    function removeViewedMovie(movie) {

    // get user id from session storage
    const userID = sessionStorage.getItem('userID');

        viewedMovies.splice(viewedMovies.indexOf(movie), 1);
        viewedMovieIdsRef.current.delete(movie.id);
        deleteViewedMovie(userID, movie.id);
        
    }

    function undo() {
        movies.forEach(movie => {
            if (movie.id === previousMovieIds[0]) /* if it was the winner */ {
                movie.wins -= 1;
                movie.timesRanked -= 1;
            } else if (movie.id === previousMovieIds[1]) /* if it was the loser */ {
                movie.timesRanked -= 1;
            }           
        });

        // create an array of movies to delete
        const moviesToDelete = [];
        // loop through all viewed movies
        viewedMovies.forEach(movie => {
            if (movie.id === previousMovieIds[0]) /* if it was the winner */ {
                // decrement wins and times rated
                movie.wins -= 1;
                movie.timesRanked -= 1;                
            } else if (movie.id === previousMovieIds[1]) /* if it was the loser */ {
                // decrement times rated
                movie.timesRanked -= 1;
            }      
            if (movie.timesRanked === 0) { // if the movie rankings = 0 after decrementing once, it should be deleted
                moviesToDelete.push(movie);
            }      
        });
        moviesToDelete.forEach(movie => removeViewedMovie(movie));

    }

    function setPreviousMovies(movie1, movie2) {
        setPreviousMovieIds([movie1.id, movie2.id]);
    }

    const value = {
        movies: movies,    
        viewedMovies: viewedMovies,
        rankMovies: rankMovies,
        undo: undo,
        rankViewedMovies: rankViewedMovies,
        addViewedMovie: addViewedMovie,
        removeMovie: removeViewedMovie,
        previousMovieIds: previousMovieIds
    }

    return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export default MovieContextProvider;    



