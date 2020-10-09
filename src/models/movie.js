import {types} from "mobx-state-tree";

export const Movie = types.model({
    imdbID: types.identifier,
    Title: types.optional(types.string, ''),
    Plot: types.optional(types.string, ''),
    imdbRating: types.optional(types.string, ''),
    Year: types.optional(types.string, ''),
    Runtime: types.optional(types.string, ''),
    Genre: types.optional(types.string, ''),
    isActive: types.optional(types.boolean, false),
})