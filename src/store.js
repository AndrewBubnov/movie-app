import {observable, action, computed, decorate, autorun} from "mobx";
import axios from 'axios';

class Store {
    constructor() {
        autorun(() => {
            this.searchForMovies(this.search)
        })
    }
    movies = [];
    search = '';
    isLoading = false;

    setSearchString = (search) => {
        this.search = search
    }

    searchForMovies = async searchString => {
        const initialRawData = await axios.get(`http://www.omdbapi.com/?apikey=8b47da7b&s=${searchString}`);
        const { data } = initialRawData;
        if (data.Response) {
            const { totalResults } = data;
            if (totalResults > 10) {
                this.isLoading = true;
                this.movies = this.movies.concat(data.Search)
                let page = 2;
                while (page <= Math.ceil(totalResults /10)) {
                    const pageData = await axios.get(`http://www.omdbapi.com/?apikey=8b47da7b&s=${searchString}&page=${page}`);
                    this.movies = this.movies.concat(pageData.data.Search)
                    page++;
                }
                this.isLoading = false;
                console.log(this.movies)
            }
        }
    }
}

decorate(Store, {
    results: observable,
    search: observable,
    isLoading: observable,
    setSearchString: action,
});
export default new Store();
