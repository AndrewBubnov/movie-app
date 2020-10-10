import { onPatch, types} from "mobx-state-tree";
import { Movie, Id, Search, Visited } from './models'
import {toJS} from "mobx";

const MOVIES_ARRAY_URL = 'http://www.omdbapi.com/?apikey=8b47da7b&s=#text#&page=#page#';
const MOVIE_URL = 'http://www.omdbapi.com/?apikey=8b47da7b&i=#value#';


const MainStore = types.model({
    movies: types.array(Movie),
    movie: types.maybe(Movie),
    moviesNumber: 0,
    search: types.optional(Search, {
        text: '',
        page: 1,
    }),
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
            setSearch () {
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
            setIsLoading(value) {
                self.isLoading = value;
            },
            setError(value) {
                self.error = value;
            },
            setMoviesNumber(value) {
                self.moviesNumber = +value;
            },
            setMovies(data, activeId) {
                self.movies = self.isInfinite ? [
                        ...self.movies,
                        ...data.Search.map(item => ({...item, isActive: item.imdbID === activeId}))
                    ]
                    : data.Search.map(item => ({...item, isActive: item.imdbID === activeId}));
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
            setMovie(movie) {
              self.movie = movie;
            },
            setVisited(data) {
                const {Title, Type, Year} = data;
                let {movieId: {value}} = self;
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
            }
        }
    ))
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

onPatch(store, patch => {
    if (patch.path.includes('/search')) {
        getMovies()
    }
    if (patch.path.includes('/movieId')) {
        getMovie()
    }
})

const getMovies = () => {
    const { search: {text, page }, setError, setMoviesNumber, setMovies, setIsLoading } = store;
    const url = MOVIES_ARRAY_URL
        .replace('#text#', text)
        .replace('#page#', page);
    setIsLoading(true);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.Error) {
                setError('');
                setMoviesNumber(data.totalResults);
                const activeId = localStorage.getItem('activeId');
                setMovies(data, activeId)
            } else {
                setError(data.Error);
            }
            setIsLoading(false);
        })
        .catch(error => setError(error))
}

const getMovie = () => {
    const {movieId: {value}, setMovie, setIsLoading, setVisited } = store;
    const url = MOVIE_URL.replace('#value#', value);
    setIsLoading(true);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            setMovie(data);
            setIsLoading(false);
            setVisited(data);
        })
        .catch(error => store.setError(error))
}

const itemTypes = ['movie', 'series', 'game'];
