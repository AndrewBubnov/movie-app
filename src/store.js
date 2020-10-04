import { observable, action, decorate, reaction, computed } from "mobx";


class Store {
    movies = [];
    movie = null;
    moviesNumber = 0;
    search = {
        text: '',
        page: 1,
    };
    id = {
        value: localStorage.getItem('id'),
    };
    error = '';
    isLiveSearchActive = false;
    isLoading = false;
    isInfinite = true;
    filterString = '';
    visited = JSON.parse(localStorage.getItem('visited')) || [];

    setSearch = () => {
        this.search = JSON.parse(localStorage.getItem('search'));
        this.isInfinite = false;
    }

    setFilterString = (string) => this.filterString = string;

    toggleIsLiveSearchActive = () => this.isLiveSearchActive = !this.isLiveSearchActive;

    get filtered() {
        return this.movies.filter(movie =>
            movie.Title.toLowerCase().includes(this.filterString.toLowerCase()))
    }

    setSearchString = (searchString) => {
        const savedSearchString = localStorage.getItem('search')
            && localStorage.getItem('search').text;
        const search = {
            text: searchString,
            page: searchString === savedSearchString ? this.search.page : 1
        }
        if (searchString !== savedSearchString) {
            this.movies = [];
            this.moviesNumber = 0;
        }
        localStorage.setItem('search', JSON.stringify(search));
    }

    setPage = (page) => {
        this.isInfinite = false;
        this.search = {
            ...this.search,
            page,
        };
        localStorage.setItem('search', JSON.stringify(this.search));
    }

    setId = (id) => localStorage.setItem('id', JSON.stringify({value: id}));

    setMovieId = () => {
        this.id = JSON.parse(localStorage.getItem('id'));
    }

    setActiveMovie = (id) => {
        this.movies = this.movies.map(movie => ({
            ...movie,
            isActive: movie.imdbID === id,
        }));
        localStorage.setItem('activeId', id);
    }

    setPageIncrement = () => {
        this.search = {
            ...this.search,
            page: this.search.page + 1,
        };
        this.isInfinite = true;
        localStorage.setItem('search', JSON.stringify(this.search));
    }

    getMovie = () => {
        this.isLoading = true;
        fetch(`http://www.omdbapi.com/?apikey=8b47da7b&i=${this.id.value}`)
            .then(response => response.json())
            .then(data => {
                this.movie = data;
                this.isLoading = false;
                this.visited = this.visited.filter(item => item.id !== this.id.value);
                this.visited = [{id: this.id.value, title: data.Title, plot: data.Plot}, ...this.visited];
                if (this.visited.length > 10) {
                    this.visited = this.visited.slice(0, this.visited.length - 1)
                }
                localStorage.setItem('visited', JSON.stringify(this.visited))
            })
            .catch(error => this.error = error)
    }


    getMovies = () => {
        this.isLoading = true;
        const {text, page} = this.search;
        fetch(`http://www.omdbapi.com/?apikey=8b47da7b&s=${text}&page=${page}`)
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

reaction(() => store.search, search => search.text && store.getMovies())

reaction(() => store.id, id => id.value && store.getMovie())
