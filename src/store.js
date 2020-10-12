import {flow, types} from "mobx-state-tree";
import {Movie, Id, Search, Visited} from './models'
import {autorun} from "mobx";

const MOVIES_ARRAY_URL = 'http://www.omdbapi.com/?apikey=8b47da7b&s=#text#&page=#page#';
const MOVIE_URL = 'http://www.omdbapi.com/?apikey=8b47da7b&i=#value#';
const blankSearch = {
    text: '',
    page: 1,
};

const MainStore = types.model({
    movies: types.array(Movie),
    movie: types.maybe(Movie),
    moviesNumber: 0,
    search: types.optional(Search, blankSearch),
    error: '',
    isInstantSearchActive: false,
    isLoading: false,
    isInfinite: true,
    filterString: '',
    movieId: types.optional(Id, {
        value: '',
    }),
    visited: types.optional(types.array(Visited),
        JSON.parse(localStorage.getItem('visited')) || []),
})
    .actions(self => ({
        afterCreate() {
            autorun(() => self.search.text && self.search.page && self.getMovies())
            autorun(() => self.movieId.value && self.getMovie())
        },
        setSearchString(searchString) {
            const savedSearchString = localStorage.getItem('search')
                && localStorage.getItem('search').text;
            const search = {
                text: searchString,
                page: searchString === savedSearchString ? self.search.page : 1
            }
            if (searchString !== savedSearchString) {
                this.movies = [];
                this.moviesNumber = 0;
            }
            localStorage.setItem('search', JSON.stringify(search));
            if (self.isInstantSearchActive) {
                self.search = search;
            }
        },
        setSearch() {
            self.isInfinite = false;
            self.search = JSON.parse(localStorage.getItem('search'));
        },
        setPage(page) {
            self.isInfinite = false;
            self.search = {
                ...self.search,
                page,
            };
            localStorage.setItem('search', JSON.stringify(self.search));
        },
        setPageIncrement() {
            self.search = {
                ...self.search,
                page: self.search.page + 1,
            };
            self.isInfinite = true;
            localStorage.setItem('search', JSON.stringify(self.search));
        },
        setId(id) {
            localStorage.setItem('id', JSON.stringify({value: id}))
        },
        setMovieId() {
            self.movieId = JSON.parse(localStorage.getItem('id'));
        },
        setActiveMovie(id) {
            self.movies = self.movies.map(movie => ({
                ...movie,
                isActive: movie.imdbID === id,
            }));
            localStorage.setItem('activeId', id);
        },
        removeVisited(id) {
            const newVisited = self.visited.filter(item => item.id !== id)
            self.visited = newVisited;
            localStorage.setItem('visited', JSON.stringify(newVisited));
        },
        toggleInstantSearch() {
            self.isInstantSearchActive = !self.isInstantSearchActive;
        },
        setFilterString(filterString) {
            self.filterString = filterString;
        },
        getMovies: flow(function* getMovies() {
            const {search: {text, page}} = self;
            const url = MOVIES_ARRAY_URL
                .replace('#text#', text)
                .replace('#page#', page);
            self.isLoading = true;
            try {
                const response = yield fetch(url);
                const data = yield response.json();
                if (data.Error) {
                    return self.error = data.Error;
                }
                const activeId = localStorage.getItem('activeId');
                self.error = '';
                self.moviesNumber = +data.totalResults;
                self.movies = self.isInfinite ? [
                        ...self.movies,
                        ...data.Search.map(item => ({...item, isActive: item.imdbID === activeId}))
                    ]
                    : data.Search.map(item => ({...item, isActive: item.imdbID === activeId}));
            } catch (error) {
                self.error = error;
            } finally {
                self.isLoading = false;
            }
        }),
        getMovie: flow(function* getMovie() {
            const {movieId: {value}} = self;
            const url = MOVIE_URL.replace('#value#', value);
            self.isLoading = true;
            try {
                const {movieId: {value}} = self;
                const response = yield fetch(url);
                const data = yield response.json();
                self.movie = data;
                const {Title, Type, Year} = data;
                self.visited = self.visited.filter(item => item.id !== value);
                self.visited = [
                    {
                        id: value,
                        title: Title,
                        type: Type,
                        year: Year,
                        plot: data.Plot
                    },
                    ...self.visited
                ];
                if (self.visited.length > 10) {
                    self.visited = self.visited.slice(0, self.visited.length - 1)
                }
                localStorage.setItem('visited', JSON.stringify(self.visited));
            } catch (error) {
                self.error = error;
            } finally {
                self.isLoading = false;
            }
        })
    }))
    .views(self => ({
        get filtered() {
            const filterString = self.filterString.toLowerCase()
            return itemTypes.includes(filterString) ?
                self.movies.filter(movie => movie.Type === filterString)
                : self.movies.filter(movie => {
                    return movie.Title.toLowerCase().includes(filterString)
                })
        },
    }))

const store = MainStore.create();

export default store;

const itemTypes = ['movie', 'series', 'game'];
