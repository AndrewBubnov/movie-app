import {observable, action, decorate, reaction, computed, autorun, toJS} from "mobx";
import {onAction, onPatch, types} from "mobx-state-tree"

const MOVIES_ARRAY_URL = 'http://www.omdbapi.com/?apikey=8b47da7b&s=#text#&page=#page#';
const MOVIE_URL = 'http://www.omdbapi.com/?apikey=8b47da7b&i=#value#';

const Search = types.model({
    text: types.string,
    page: types.integer,
})

const Id = types.model({
    value: types.string,
})

const Movie = types.model({
    imdbID: types.identifier,
    Title: types.optional(types.string, ''),
    Plot: types.optional(types.string, ''),
    imdbRating: types.optional(types.string, ''),
    Year: types.optional(types.string, ''),
    Runtime: types.optional(types.string, ''),
    Genre: types.optional(types.string, ''),
    isActive: types.optional(types.boolean, false),
})

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
    id: types.optional(Id, {
        value: '',
    }),
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
                self.id = JSON.parse(localStorage.getItem('id'));
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
        }
    ))
    .views(self => ({
        get filtered() {
            return self.movies.filter(movie =>
                movie.Title.toLowerCase().includes(self.filterString.toLowerCase()))
        },
    }))



// class Store {
//     movies = [];
//     movie = null;
//     moviesNumber = 0;
//     search = blankSearch;
//     id = {};
//     error = '';
//     isInstantSearchActive = false;
//     isLoading = false;
//     isInfinite = true;
//     filterString = '';
//     visited = JSON.parse(localStorage.getItem('visited')) || [];
//
//     setSearch = () => {
//         this.search = JSON.parse(localStorage.getItem('search'));
//         this.isInfinite = false;
//     }
//
//     setFilterString = (string) => this.filterString = string;
//
//     toggleInstantSearch = () => this.isInstantSearchActive = !this.isInstantSearchActive;
//
//     get filtered() {
//         return this.movies.filter(movie =>
//             movie.Title.toLowerCase().includes(this.filterString.toLowerCase()))
//     }
//
//     setSearchString = (searchString) => {
//         const savedSearchString = localStorage.getItem('search')
//             && localStorage.getItem('search').text;
//         const search = {
//             text: searchString,
//             page: searchString === savedSearchString ? this.search.page : 1
//         }
//         if (searchString !== savedSearchString) {
//             this.movies = [];
//             this.moviesNumber = 0;
//         }
//         localStorage.setItem('search', JSON.stringify(search));
//         if (this.isInstantSearchActive) {
//             this.search = search;
//         }
//     }
//
//     setPage = (page) => {
//         this.isInfinite = false;
//         this.search = {
//             ...this.search,
//             page,
//         };
//         localStorage.setItem('search', JSON.stringify(this.search));
//     }
//
//     setId = (id) => localStorage.setItem('id', JSON.stringify({value: id}));
//
//     setMovieId = () => {
//         this.id = JSON.parse(localStorage.getItem('id'));
//     }
//
//     setActiveMovie = (id) => {
//         this.movies = this.movies.map(movie => ({
//             ...movie,
//             isActive: movie.imdbID === id,
//         }));
//         localStorage.setItem('activeId', id);
//     }
//
//     setPageIncrement = () => {
//         this.search = {
//             ...this.search,
//             page: this.search.page + 1,
//         };
//         this.isInfinite = true;
//         localStorage.setItem('search', JSON.stringify(this.search));
//     }
//
//     getMovie = () => {
//         this.isLoading = true;
//         fetch(`http://www.omdbapi.com/?apikey=8b47da7b&i=${this.id.value}`)
//             .then(response => response.json())
//             .then(data => {
//                 this.movie = data;
//                 this.isLoading = false;
//                 this.visited = this.visited.filter(item => item.id !== this.id.value);
//                 this.visited = [{id: this.id.value, title: data.Title, plot: data.Plot}, ...this.visited];
//                 if (this.visited.length > 10) {
//                     this.visited = this.visited.slice(0, this.visited.length - 1)
//                 }
//                 localStorage.setItem('visited', JSON.stringify(this.visited))
//             })
//             .catch(error => this.error = error)
//     }
//
//
//     getMovies = () => {
//         this.isLoading = true;
//         const {text, page} = this.search;
//         fetch(`http://www.omdbapi.com/?apikey=8b47da7b&s=${text}&page=${page}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (!data.Error) {
//                     this.error = '';
//                     this.moviesNumber = data.totalResults;
//                     const activeId = localStorage.getItem('activeId');
//                     this.movies = this.isInfinite ? [
//                             ...this.movies,
//                             ...data.Search.map(item => ({...item, isActive: item.imdbID === activeId}))
//                         ]
//                         : data.Search.map(item => ({...item, isActive: item.imdbID === activeId}));
//                 } else {
//                     this.error = data.Error;
//                 }
//                 this.isLoading = false;
//             })
//             .catch(error => this.error = error)
//     }
// }

const store = MainStore.create();

export default store;


reaction(() => store.id, id => id.value && store.getMovie())

onPatch(store, patch => {
    if (patch.path.includes('/search')) {
        getMovies()
    }
    if (patch.path.includes('/id')) {
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
    const {id: {value}, setMovie, setIsLoading } = store;
    const url = MOVIE_URL.replace('#value#', value);
    setIsLoading(true);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            setMovie(data);
            setIsLoading(false);
            // store.visited = this.visited.filter(item => item.id !== this.id.value);
            // store.visited = [{id: this.id.value, title: data.Title, plot: data.Plot}, ...this.visited];
            // if (store.visited.length > 10) {
            //     store.visited = this.visited.slice(0, this.visited.length - 1)
            // }
            // localStorage.setItem('visited', JSON.stringify(this.visited))
        })
        .catch(error => store.setError(error))
}
