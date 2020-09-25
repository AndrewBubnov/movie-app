import {observable, action, decorate, autorun} from "mobx";
import axios from 'axios';


class Store {
    constructor() {
        autorun(() => {
            this.movies = [];
            if (this.search) {
                    this.getMovies(this.search)
                if (this.id) {
                    this.getMovie(this.id)
                }
            } else {
                this.moviesNumber = 0;
            }
        })
    }

    movies = [];
    movie = null;
    page = 1;
    moviesNumber = 0;
    search = '';
    id = null;
    noResult = false;

    setSearchString = (search) => {
        this.search = search
    }

    setMovieId = (id) => {
        this.id = id
    }

    setPage = (page) => {
        this.page = page;
        this.getMovies();
    }

    getMovie = async id => {
        const movieData = await axios.get(`http://www.omdbapi.com/?apikey=8b47da7b&i=${id}`);
        this.movie = movieData.data;
        console.log(this.movie)
    }

    getMovies = async () => {
        const initialRawData = await axios.get(`http://www.omdbapi.com/?apikey=8b47da7b&s=${this.search}&page=${this.page}`);
        const {data} = initialRawData;
        if (!data.Error) {
            this.noResult = false;
            this.moviesNumber = data.totalResults;
            this.movies = data.Search;
        } else {
            this.noResult = true;
        }
    }
}

decorate(Store, {
    movies: observable,
    search: observable,
    id: observable,
    noResult: observable,
    moviesNumber: observable,
    page: observable,
    getMovies: action,
    setSearchString: action,
    setMovieId: action,
    getMovie: action,
    setPage: action,
});
export default new Store();
