import { types } from "mobx-state-tree";

export const Visited = types.model({
    id: types.identifier,
    title: types.string,
    type: types.string,
    year: types.string,
    plot: types.string,
})