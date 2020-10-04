import { observable, action, decorate, reaction, computed } from "mobx";


class Store {
    movies = [];
    movie = null;
    page = +localStorage.getItem('page') || 1;
    moviesNumber = 0;
    search = '';
    id = '';
    error = '';
    isLiveSearchActive = false;
    isLoading = false;
    isInfinite = true;
    filterString = '';
    visited = JSON.parse(localStorage.getItem('visited')) || [];

    setSearch = () => {
        this.setSearchString(localStorage.getItem('search'))
    }

    setFilterString = (string) => {
        this.filterString = string;
    }

    toggleIsLiveSearchActive = () => {
        this.isLiveSearchActive = !this.isLiveSearchActive;
    }

    get filtered() {
        return this.movies.filter(movie =>
            movie.Title.toLowerCase().includes(this.filterString.toLowerCase()))
    }

    setSearchString = (search) => {
        if (search !== localStorage.getItem('search')) {
            this.search = '';
            this.movies = [];
            this.page = 1;
            this.moviesNumber = 0;
            localStorage.setItem('page', '1');
        }
        this.search = search;
        localStorage.setItem('search', search);
    }

    setPage = (page) => {
        this.isInfinite = false;
        this.page = page;
        localStorage.setItem('page', page);
    }

    setId = (id) => {
        this.id = id;
        localStorage.setItem('id', id);
    }

    setMovieId = () => {
        this.id = localStorage.getItem('id');
    }

    setActiveMovie = (id) => {
        this.movies = this.movies.map(movie => ({
            ...movie,
            isActive: movie.imdbID === id,
        }));
        localStorage.setItem('activeId', id);
    }

    setPageIncrement = () => {
        this.page = this.page + 1;
        this.isInfinite = true;
        localStorage.setItem('page', this.page);
    }

    getMovie = () => {
        this.isLoading = true;
        fetch(`http://www.omdbapi.com/?apikey=8b47da7b&i=${this.id}`)
            .then(response => response.json())
            .then(data => {
                this.movie = data;
                this.isLoading = false;
                this.visited = this.visited.filter(item => item.id !== this.id);
                this.visited = [{id: this.id, title: data.Title, plot: data.Plot}, ...this.visited];
                if (this.visited.length > 10) {
                    this.visited = this.visited.slice(0, this.visited.length - 1)
                }
                localStorage.setItem('visited', JSON.stringify(this.visited))
            })
            .catch(error => this.error = error)
    }


    getMovies = () => {
        this.isLoading = true;
        fetch(`http://www.omdbapi.com/?apikey=8b47da7b&s=${this.search}&page=${this.page}`)
            .then(response => response.json())
            .then(data => {
                if (!data.Error) {
                    this.error = '';
                    this.moviesNumber = data.totalResults;
                    const activeId = localStorage.getItem('activeId');
                    this.movies = this.isInfinite ? [
                            ...this.movies,
                            ...data.Search.map(item => ({...item, isActive: item.imdbID === activeId}))
                        ]
                        : data.Search.map(item => ({...item, isActive: item.imdbID === activeId}));
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
    isLiveSearchActive: observable,
    isLoading: observable,
    visited: observable,
    filterString: observable,
    setSearchString: action,
    setSearch: action,
    setPage: action,
    setId: action,
    setActiveMovie: action,
    setPageIncrement: action,
    toggleIsLiveSearchActive: action,
    setMovieId: action,
    filtered: computed,
});

const store = new Store();

export default store;

reaction(() => store.search, search => search && store.getMovies())

reaction(() => store.page, () => store.getMovies())

reaction(() => store.id, id => id && store.getMovie())
