import { useContext } from "react";
import { MovieList } from "../components/MovieList";
import { MovieContext } from "../context/movieContext";
import './ListScreen.css';

export function UserListScreen() {
    //const movieContext = useContext(MovieContext);
    const movieContext = useContext(MovieContext);

    const movieList = movieContext.viewedMovies
    return (
        <div>
            { !!movieList ? <MovieList mode="user" /> : <p className="movieListItem">You have no movies on your list, rank some movies and come back.</p>}
        </div>
    );
}