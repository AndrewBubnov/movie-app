import {observable, action, decorate} from "mobx";


class Store {
    constructor() {
        if (this.search) {
            this.getMovies()
        }
        if (this.id) {
            this.getMovie(this.id)
        }
    }

    movies = [];
    movie = null;
    page = +localStorage.getItem('page') || 1;
    moviesNumber = 0;
    search = localStorage.getItem('search') || '';
    id = localStorage.getItem('id') || null;
    error = '';
    isLoading = false;

    setSearchString = (search) => {
        if (search !== localStorage.getItem('search')) {
            this.page = 1;
            localStorage.setItem('page', '1');
        }
        this.search = search;
        localStorage.setItem('search', search);
        if (search) {
            this.moviesNumber = 0;
            this.getMovies()
        }
    }

    setPage = (page) => {
        this.page = page;
        localStorage.setItem('page', page);
        this.getMovies();
    }

    setId = (id) => {
        this.id = id;
        localStorage.setItem('id', id);
        if (id) {
            this.getMovie(id)
        }
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
        fetch(`http://www.omdbapi.com/?apikey=8b47da7b&i=${id}`)
            .then(response => response.json())
            .then(data => {
                this.movie = data;
                this.isLoading = false
            })
            .catch(error => this.error = error)
    }

    getMovies = async () => {
        this.isLoading = true;
        fetch(`http://www.omdbapi.com/?apikey=8b47da7b&s=${this.search}&page=${this.page}`)
            .then(response => response.json())
            .then(data => {
                if (!data.Error) {
                    this.error = '';
                    this.moviesNumber = data.totalResults;
                    const activeId = localStorage.getItem('activeId');
                    this.movies = data.Search.map(item => ({...item, isActive: item.imdbID === activeId}));
                } else {
                    this.error = data.Error;
                }
                this.isLoading = false;
            })
            .catch(error => this.error = error)
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
    setSearchString: action,
    setPage: action,
    setId: action,
    setActiveMovie: action,
});
export default new Store();
