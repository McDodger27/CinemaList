import { useContext, useState, useEffect } from "react"
import { ColorContext } from "../context/colorContext"
import { MovieContext } from "../context/movieContext";
import { fetchMovies, editMovie } from "../util/http";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function PostMovieScreen({ mode }) {

    const colorCtx = useContext(ColorContext);
    const movieCtx = useContext(MovieContext);
    const authCtx = useContext(AuthContext);

    const [movies, setMovies] = useState();
    const [isLoading, setIsLoading] = useState(true);



    const navigate = useNavigate();

    const [indexId, setIndexId] = useState();
    const [wins, setWins] = useState();
    const [timesRanked, setTimesRanked] = useState();

    //      State variables for managing form inputs.
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [director, setDirector] = useState();
    const [year, setYear] = useState();
    const [rating, setRating] = useState();
    const [runtime, setRuntime] = useState();
    const [genres, setGenres] = useState();

    const [poster1, setPoster1] = useState();
    const [poster2, setPoster2] = useState();
    const [poster3, setPoster3] = useState();
    const [poster4, setPoster4] = useState();

    const params = useParams();
    

    useEffect(() => {
        if (!movies) {        
            async function getMovies() {
                const response = await fetchMovies();
                const fetchedMovies = response;
                console.log(fetchedMovies);
                fetchedMovies.sort((a, b) => a.id - b.id);    // sort movies by id to get the highest id at the top
                setMovies(fetchedMovies);
                setIndexId(parseInt(fetchedMovies[fetchedMovies.length - 1].id) + 1);
                setIsLoading(false);
            } 
            getMovies();
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const movieId = params.movieId?.slice(1);
        const movie = movies?.find(mov => mov.id.toString() === movieId);
        if (movie) {
            setTitle(movie.title);
            setDescription(movie.description);
            setDirector(movie.director);
            setYear(movie.releaseYear);
            setRating(movie.rating);
            setRuntime(movie.runtime);
            setGenres(movie.genres);
            setIndexId(movie.id);
            setWins(movie.wins);
            setTimesRanked(movie.timesRanked);
            for (let i = 1; i <= movie.poster.length; i++) {
                updatePosters(i, movie.poster[i - 1]);
            }
        }
    }, [movies]);  // Only run when movies or movieId changes  

    function updatePosters(number, enteredValue) {
        switch (number) {
            case 1:
                setPoster1(enteredValue);
                break;
            case 2:
                setPoster2(enteredValue);
                break;
            case 3:
                setPoster3(enteredValue);
                break;
            case 4:
                setPoster4(enteredValue);
                break;
        }
    }

    function handleTitle(event) {
        setTitle(event.target.value);
    }

    function handleDescription(event) {
        setDescription(event.target.value);
    }
    
    function handleDirector(event) {
        setDirector(event.target.value);
    }

    function handleYear(event) {
        setYear(event.target.value);
    }    
    
    function handleRating(event) {
        setRating(event.target.value);
    }

    function handleRuntime(event) {
        setRuntime(event.target.value);
    }   
    
    function handleGenres(event) {
        setGenres(event.target.value);
    }    
    
    function handlePoster1(event) {
        updatePosters(1, event.target.value);
    }
    
    function handlePoster2(event) {
        updatePosters(2, event.target.value);
    }
    
    function handlePoster3(event) {
        updatePosters(3, event.target.value);
    }    

    function handlePoster4(event) {
        updatePosters(4, event.target.value);
    } 
    
    const labelStyle = {
        color: '#ccc',
    }
    const inputStyle = {
        color: '#ccc',
        backgroundColor: '#444',
        borderRadius: '5px',
        borderStyle: 'solid',
        padding: '4px',
        width: '100%',
        maxWidth: '450px'
    }
    const shortInput = {
        ...inputStyle,
        maxWidth: '300px'
    }
    const containerStyle = {
        backgroundColor: '#555',
        paddingLeft: '5%',
        paddingRight: '5%',
        marginLeft: '20%',
        marginRight: '20%',
        display: 'flex',
        flexDirection: 'column',
        borderStyle: 'solid',
        borderColor: '#444',
        borderRadius: '10px',
        textAlign: 'center',
        alignItems: 'center'
    }

    function handleSubmit() {
        if (title && description && director && year && rating && runtime && poster1) {
            const posters = [poster1, poster2, poster3, poster4];
            let movieWins = 0;
            let movieRanks = 0;
            if (mode === "edit") {
                movieWins = wins;
                movieRanks = timesRanked;
            }
            const movieData = {
                description: description,
                director: director,
                genres: genres,
                id: indexId,
                poster: [],
                rating: rating,
                releaseYear: year,
                runtime: runtime,
                timesRanked: movieRanks,
                title: title,
                wins: movieWins
            }

            posters.forEach(poster => {
                if (poster?.length > 0) {
                    movieData.poster.push(poster);
                }
            });
            const userID = sessionStorage.getItem('userID');
            editMovie(indexId, userID, movieData);
            authCtx.refreshData();
            navigate("/"); // navigate to home page.
        } else {
            alert("All fields not marked optional must be filled out. Please verify that all information is accurate before trying to submit again.");
        }
        
    }

    return (
        <div>
            <h1 style={{ color: colorCtx.primary }}>Enter Movie Info</h1>
            <div style={containerStyle}>
                <label style={labelStyle}>Title:</label><input style={shortInput} value={title} onChange={handleTitle} placeholder="Movie Title" />
                <label style={labelStyle}>Description:</label><textarea style={inputStyle} value={description} onChange={handleDescription} placeholder="Description" />
                <label style={labelStyle}>Directed by:</label><input style={shortInput} value={director} onChange={handleDirector} placeholder="Director" />
                <label style={labelStyle}>Release year:</label><input style={shortInput} value={year} onChange={handleYear} placeholder="Year" />
                <label style={labelStyle}>Rating:</label><input style={shortInput} value={rating} onChange={handleRating} placeholder="Rating" />                
                <label style={labelStyle}>Runtime:</label><input style={shortInput} value={runtime} onChange={handleRuntime} placeholder="Runtime" />
                <label style={labelStyle}>Genres:(optional)</label><input style={shortInput} value={genres} onChange={handleGenres} placeholder="Genres" />
                <br />
                <label style={labelStyle}>Poster 1:</label><input style={shortInput} value={poster1} onChange={handlePoster1} placeholder="enter url" />
                <label style={labelStyle}>Poster 2:(optional)</label><input style={shortInput} value={poster2} onChange={handlePoster2} placeholder="enter url" />
                <label style={labelStyle}>Poster 3:(optional)</label><input style={shortInput} value={poster3} onChange={handlePoster3} placeholder="enter url" />
                <label style={labelStyle}>Poster 4:(optional)</label><input style={shortInput} value={poster4} onChange={handlePoster4} placeholder="enter url" />
                <br />
                <button 
                    style={{
                        width: 100, 
                        margin: 'auto', 
                        backgroundColor: '#111', 
                        color: '#ccc', 
                        borderStyle: 'solid', 
                        borderColor: colorCtx.primary, 
                        borderRadius: '5px', 
                        padding: '6px',
                        cursor: 'pointer' 
                    }}
                    onClick={handleSubmit}
                >
                    SUBMIT
                </button>
            </div>
        </div>
    );
}

export default PostMovieScreen;