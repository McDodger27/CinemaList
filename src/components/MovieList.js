import { useContext, useState } from "react";
import { MovieContext } from "../context/movieContext";
import { useNavigate, useParams } from "react-router-dom";
import PageSelector from "./pageSelector/PageSelector";
import './MovieList.css';
import { ColorContext } from "../context/colorContext";


export function MovieList({ mode }) {    
    const colorCtx = useContext(ColorContext);
    const navigate = useNavigate();

    const params = useParams();

    let currentPage = parseInt(params.page.slice(1));

    const movieContext = useContext(MovieContext);
    let mainList = movieContext.movies;
    let subList = movieContext.viewedMovies;
    let navLink = "/globallist";

    const displayList = [];

    if (mode === "user") {
        mainList = movieContext.viewedMovies;
        subList = movieContext.movies;
        navLink = "/userlist";
    }

    const [searchInput, setSearchInput] = useState('');

    function handleSearch(event) {
        navigate(`${navLink}/:1`);
        setSearchInput(event.target.value);
    }

    function navigateUserList() {
        navigate("/viewed")
    }

    mainList.length > 0 && mainList.sort((a, b) => b.timesRanked - a.timesRanked);
    subList && subList.length > 0 && subList.sort((a, b) => b.timesRanked - a.timesRanked);
    mainList.length > 0 && mainList.sort((a, b) => (b.wins / b.timesRanked) - (a.wins / a.timesRanked));
    subList && subList.length > 0 && subList.sort((a, b) => (b.wins / b.timesRanked) - (a.wins / a.timesRanked));

    mainList.length > 0 && mainList.forEach(mov => {            
        displayList.push(mov);
    });
    if (searchInput) {
        if (searchInput.length > 0) {
            mainList.forEach(mov => {
                if (!mov.title.toLowerCase().includes(searchInput.toLowerCase()) && !mov.director.toLowerCase().includes(searchInput.toLowerCase()) && mov.releaseYear.toString() !== searchInput) {
                    displayList.splice(displayList.indexOf(mov), 1);
                }
            });
        }
    }
           

    let pages = parseInt((displayList.length / 10).toFixed(0));
    if (pages < displayList.length / 10) {pages += 1};

    function TenMovies() {
            const index = (currentPage * 10) - 10;
            const moviesToDisplay = []
            for (let i = 0; i < 10; i++) {
                if (index + i <= displayList.length - 1) {
                    moviesToDisplay.push(displayList[index + i]);
                }                
            }
            if (moviesToDisplay.length > 0) {
                let listNumber = index;
                return (
                    <ol className="movieList">
                        {
                            moviesToDisplay.map((movie) => {
                                listNumber += 1;
                                const clickMovie = () => navigate(`/viewmovie/:${movie.id}`);
                                if (mode !== 'user' || movie.timesRanked > 0) {
                                    let sublistPosition = 0;
                                    if (subList && subList.length > 0) {
                                        sublistPosition = subList.indexOf(subList.find(subMovie => { if (subMovie.id === movie.id) return subMovie; })) + 1;
                                    }                                    
                                    return <li style={{ display: 'flex', flexDirection: 'row'}} value={mainList.indexOf(movie) + 1}  className="movieListItem" key={movie.id}>
                                            <p>{mainList.indexOf(movie) + 1}.</p>
                                            <div className="imageContainer">
                                                <img style={{
                                                    width: '100%',
                                                    borderStyle: 'solid',
                                                    borderRadius: '5px',
                                                    borderWidth: '2px'
                                                }}
                                                    src={movie.poster[0]}>
                                                </img> 
                                            </div> 
                                            <div style={{marginLeft: '10px'}}>
                                                <p onClick={clickMovie}>{movie.title} ({movie.releaseYear})</p>
                                                <p className="subText">
                                                    {((movie.wins / movie.timesRanked) * 100).toFixed(0)}% rated {movie.timesRanked} times, won {movie.wins} times <br /><br />
                                                    { (mode === "user" && sublistPosition > 0) && <span className="subText">Global ranking: {sublistPosition}.</span>}
                                                    { (mode === "global" && sublistPosition > 0) && <span className="altText">Your ranking: <span style={{ color: colorCtx.primary }} >{sublistPosition}</span>.</span>}
                                                </p>
                                            </div>
                                        
                                    </li>;
                                } else {
                                    return;
                                }
                            })
                        }
                    </ol>
                );
            } else {
                return <p>There are no movies to display, please rank some or come back later.</p>
            }
            
    }

    return (
        <div>
            <input className="searchBar" type="text" value={searchInput} onChange={handleSearch} placeholder="search by title, director or year" />
        
            <div className="movieListContainer">
                <TenMovies />
                <div className="listFooter">
                    <PageSelector currentPage={currentPage} navLink={navLink} pages={pages} />
                    { mode === "user" && mainList.length > 0 && <button style={{ borderColor: colorCtx.primary }} className="rankUserListButton" onClick={navigateUserList}>Rank this list</button> }
                </div>
            </div>
        </div>
    )
}