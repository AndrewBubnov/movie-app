import {observable, action, decorate, autorun} from "mobx";
import axios from 'axios';


class Store {
    constructor() {
        autorun(() => {
            this.search = localStorage.getItem('search')
            this.id = localStorage.getItem('id')
            if (this.search) {
                this.moviesNumber = 0;
                this.getMovies(this.search)
                if (this.id) {
                    this.getMovie(this.id)
                }
            }
        })
    }

    movies = [];
    movie = null;
    page = +localStorage.getItem('page') || 1;
    moviesNumber = 0;
    search = '';
    id = null;
    error = '';
    isLoading = false;

    setSearchString = (search) => {
        this.search = search;
        localStorage.setItem('search', search);
    }

    setMovieId = (id) => {
        this.id = id
    }

    setPage = (page) => {
        this.page = page;
        localStorage.setItem('page', page);
        this.getMovies();
    }

    setId = (id) => {
        this.id = id;
        localStorage.setItem('id', id);
    }

    setActiveMovie = (id) => {
        this.movies = this.movies.map(movie => ({
            ...movie,
            isActive: movie.imdbID === id,
        }));
        localStorage.setItem('activeId', id);
    }

    getMovie = async id => {
        this.isLoading = true;
        const movieData = await axios.get(`http://www.omdbapi.com/?apikey=8b47da7b&i=${id}`);
        this.movie = movieData.data;
        this.isLoading = false;
    }

    getMovies = async () => {
        this.isLoading = true;
        try {
            const initialRawData = await axios
                .get(`http://www.omdbapi.com/?apikey=8b47da7b&s=${this.search}&page=${this.page}`);
            const {data} = initialRawData;
            if (!data.Error) {
                this.error = '';
                this.moviesNumber = data.totalResults;
                const activeId = localStorage.getItem('activeId');
                this.movies = data.Search.map(item => ({...item, isActive: item.imdbID === activeId}));
            } else {
                this.error = data.Error;
            }
            this.isLoading = false;
        } catch (e) {
            this.error = e;
        }
    }
}

decorate(Store, {
    movies: observable,
    movie: observable,
    search: observable,
    id: observable,
    error: observable,
    moviesNumber: observable,
    page: observable,
    isLoading: observable,
    getMovies: action,
    setSearchString: action,
    setMovieId: action,
    getMovie: action,
    setPage: action,
    setId: action,
    setActiveMovie: action,
});
export default new Store();
