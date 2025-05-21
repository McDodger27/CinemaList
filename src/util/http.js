import axios from "axios";
import { useContext } from "react";
import { MovieContext } from "../context/movieContext";

const DATABASE_URL = 'https://react-native-course-5e175-default-rtdb.firebaseio.com/';

export async function storeMovie(movieData) {
    const response = await axios.post(DATABASE_URL + '/movies.json', movieData);
    const id = response.data.name;
    return id;
}

export function fetchMovieById(id) {
    return axios.get(DATABASE_URL + `/movies/${id}.json`);
}

export async function fetchMovies() {
    const response = await axios.get(DATABASE_URL + '/movies.json');

    const movies = [];

    // Loop through each key-value pair in the response
    for (const key in response.data) {
        if (response.data.hasOwnProperty(key)) {
            const movieData = response.data[key];
            if (movieData) {            
                const movieObj = {
                    id: key,  // Firebase generates unique keys, use them as the id
                    title: movieData.title,
                    director: movieData.director,
                    rating: movieData.rating,
                    runtime: movieData.runtime,
                    description: movieData.description,
                    poster: movieData.poster,
                    wins: movieData.wins,
                    timesRanked: movieData.timesRanked,
                    releaseYear: movieData.releaseYear,
                    genres: movieData.genres
                };

                if (!movies.some(movie => movie.id === movieObj.id)) {
                    movies.push(movieObj);
                }
            }

            
        }
    }

    return movies;
}

export async function editMovie(id, movieData) {
    const usersResponse = await axios.get(DATABASE_URL + 'users.json');
    for (const key in usersResponse.data) {
        if (usersResponse.data.hasOwnProperty(key)) {
            const userMovie = usersResponse.data[key].viewedMovies[id];
            // axios.update(DATABASE_URL + `/users/${key}/viewedMovies/${id}.json`, {...userMovie, ...movieData});
            updateViewedMovie(movieData);
        }
    }
    const movieResponse = axios.get(DATABASE_URL + `/movies/${id}.json`);
    const movie = movieResponse.data
    return axios.put(DATABASE_URL + `/movies/${id}.json`, {...movie, ...movieData});
}

export async function updateMovie(id, movieData) {
    const movieResponse = axios.get(DATABASE_URL + `/movies/${id}.json`);
    const movie = movieResponse.data
    return axios.put(DATABASE_URL + `/movies/${id}.json`, {...movie, ...movieData});
}

export async function updateViewedMovie(movieData) {
    const usersResponse = await axios.get(DATABASE_URL + 'users.json');
    let userKey = '';
        for (const key in usersResponse.data) {
            if (usersResponse.data.hasOwnProperty(key)) {
                const user = usersResponse.data[key];
                if (user.email === sessionStorage.getItem('email')) {
                    userKey = key;
                }
            } 
        }
    return axios.put(DATABASE_URL + `/users/${userKey}/viewedMovies/${movieData.id}.json`, movieData);
}

export async function removeMovie(id) {
    const usersResponse = await axios.get(DATABASE_URL + 'users.json');
    for (const key in usersResponse.data) {
        if (usersResponse.data.hasOwnProperty(key)) {
            console.log(usersResponse.data[key].viewedMovies[id]);
            axios.delete(DATABASE_URL + `/users/${key}/viewedMovies/${id}.json`);
        }
    }
    return axios.delete(DATABASE_URL + `/movies/${id}.json`);
}

export async function deleteViewedMovie(id) {
    const usersResponse = await axios.get(DATABASE_URL + 'users.json');
    let userKey = '';
        for (const key in usersResponse.data) {
            if (usersResponse.data.hasOwnProperty(key)) {
                const user = usersResponse.data[key];
                if (user.email === sessionStorage.getItem('email')) {
                    userKey = key;
                }
            } 
        }
    return axios.delete(DATABASE_URL + `/users/${userKey}/viewedMovies/${id}.json`);
}

export async function fetchUsers() {
    const response = await axios.get(DATABASE_URL + 'users.json');

    const users = []; 
    if (response.data) {
        for (const key in response.data) {
            if (response.data.hasOwnProperty(key)) {
                const user = response.data[key];
                const userObj = {
                    id: key,
                    groups: user.groups,
                    viewedMovies: user.viewedMovies,
                    email: user.email,
                    color: user.color,
                    level: user.level
                }
                users.push(userObj);
            } 
        }
        return users.length > 0 ? users : null;
    } else {
        return null;
    }
    
    
}

export async function fetchUserData() {
    const response = await axios.get(DATABASE_URL + 'users.json');
    if (response.data) {
        console.log(response.data);
        const user = Object.values(response.data).find(user => user.email === sessionStorage.getItem('email'));

        if (user) {
            const userObj = {
                groups: user.groups,
                viewedMovies: user.viewedMovies,
                email: user.email,
                color: user.color,
                level: user.level
            }
            return userObj;
        }
    }
    
    return null;
}

export async function addUser(userData) {
    const response = await axios.post(DATABASE_URL + '/users.json', userData);
    const id = response.data.name;
    return id;
}

export async function storeViewedMovie(movieData) {

    const usersResponse = await axios.get(DATABASE_URL + 'users.json');

    let userKey = '';
        for (const key in usersResponse.data) {
            if (usersResponse.data.hasOwnProperty(key)) {
                const user = usersResponse.data[key];
                if (user.email === sessionStorage.getItem('email')) {
                    userKey = key;
                }
            } 
        }
    const response = await axios.post(DATABASE_URL + `/users/${userKey}/viewedMovies.json`, movieData);
    const id = response.data.name;
    return id;
}

export async function updateColor(color) {
    const usersResponse = await axios.get(DATABASE_URL + 'users.json');
    let userKey = '';
        for (const key in usersResponse.data) {
            if (usersResponse.data.hasOwnProperty(key)) {
                const user = usersResponse.data[key];
                if (user.email === sessionStorage.getItem('email')) {
                    userKey = key;
                }
            } 
        }
    return axios.patch(DATABASE_URL + `/users/${userKey}.json`, { color: color });
}