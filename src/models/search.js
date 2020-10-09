import {types} from "mobx-state-tree";

export const Search = types.model({
    text: types.string,
    page: types.integer,
})