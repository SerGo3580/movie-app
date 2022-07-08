export function addFavoriteFilm(filmId: string | undefined): void {
    if (filmId === undefined) {
        throw 'error film element must have film id';
    }
    if (localStorage.getItem('favorite')) {
        const prevFavorite: string[] | null = JSON.parse(
            localStorage.getItem('favorite') as string
        );
        if (!prevFavorite?.includes(filmId)) {
            prevFavorite?.push(filmId);
        }
        localStorage.setItem('favorite', JSON.stringify(prevFavorite));
        return;
    }
    localStorage.setItem('favorite', JSON.stringify([filmId]));
}
export const getFavoriteFilmArray = (): string[] => {
    const dataFromLocalStorage: string | null =
        localStorage.getItem('favorite');
    const favoriteFilmArray: string[] | null = JSON.parse(
        dataFromLocalStorage as string
    );
    if (favoriteFilmArray === null || dataFromLocalStorage === null) {
        localStorage.setItem('favorite', JSON.stringify([]));
        return [];
    }
    return favoriteFilmArray;
};
export const isFilmInFavorite = (filmId: string): boolean => {
    const favoriteFilmArray = getFavoriteFilmArray();
    return favoriteFilmArray.includes(filmId);
};
export const deleteFavoriteFilm = (filmId: string): string | null => {
    const favoriteFilmArray: string[] = getFavoriteFilmArray();
    const deleteFilmIdIndex:number = favoriteFilmArray.indexOf(filmId);
    if (favoriteFilmArray.length === 0 || deleteFilmIdIndex === -1) {
        return null;
    }
    favoriteFilmArray.splice(deleteFilmIdIndex, 1);
    localStorage.setItem('favorite', JSON.stringify(favoriteFilmArray));
    return filmId;
};
