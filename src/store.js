import {observable, action, decorate, autorun} from "mobx";
import axios from 'axios';

const cache = {};

class Store {
    constructor() {
        autorun(() => {
            this.movies = [];
            if (this.search) {
                if (cache[this.search]) {
                    this.movies = cache[this.search]
                } else {
                    this.searchForMovies(this.search)
                }
            }
        })
    }

    movies = [];
    movie = null;
    search = '';
    noResult = false;

    setSearchString = (search) => {
        this.search = search
    }

    getMovie = async id => {
        const movieData = await axios.get(`http://www.omdbapi.com/?apikey=8b47da7b&i=${id}`);
        console.log('movieData  = ', movieData)
        this.movie = movieData.data;
        console.log(this.movie)
    }

    searchForMovies = async searchString => {
        const initialRawData = await axios.get(`http://www.omdbapi.com/?apikey=8b47da7b&s=${searchString}`);
        const {data} = initialRawData;
        if (!data.Error) {
            this.noResult = false;
            const {totalResults} = data;
            if (totalResults > 10) {
                this.movies = [...this.movies, ...data.Search]
                let page = 2;
                while (page <= Math.ceil(totalResults / 10)) {
                    const pageData = await axios.get(`http://www.omdbapi.com/?apikey=8b47da7b&s=${searchString}&page=${page}`);
                    this.movies = [...this.movies, ...pageData.data.Search]
                    page++;
                }
            }
            cache[this.search] = this.movies;
        } else {
            this.noResult = true;
        }
    }
}

decorate(Store, {
    movies: observable,
    search: observable,
    noResult: observable,
    searchForMovies: action,
    setSearchString: action,
    getMovie: action,
});
export default new Store();
