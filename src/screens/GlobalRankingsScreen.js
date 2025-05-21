import { useContext } from "react";
import { MovieList } from "../components/MovieList";
import { MovieContext } from "../context/movieContext";

export function GlobalRankingsScreen() {
    const movieContext = useContext(MovieContext);   

    return (
        <div>
            <MovieList mode="global" />
        </div>
    );
}