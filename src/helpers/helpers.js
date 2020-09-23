export const setParcedUrlSearch = (setSearchString) => {
    const searchString = new URL(window.location.href).searchParams.get('s');
    setSearchString(searchString);
}
