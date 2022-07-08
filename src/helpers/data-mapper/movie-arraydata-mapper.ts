import {
    movieData,
    requiredFilmProperty,
    responseMovieArrayInterface,
    responseMovieInterface,
} from './interfaces/interfaces';
import { isFilmInFavorite } from '../favoriteFilms/favoriteFilm';

const setDefaultValue = (movie: responseMovieInterface): void => {
    if (!movie.backdrop_path) {
        movie.backdrop_path = 'https://i.ibb.co/5FqNj2T/9.png';
    } else {
        movie.backdrop_path = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
    }
    if (!movie.poster_path) {
        movie.poster_path = 'https://i.ibb.co/5FqNj2T/9.png';
    } else {
        movie.poster_path = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
    }

    if (!movie.overview) {
        movie.overview = "don't provide";
    }

    if (!movie.title) {
        movie.title = "don't provide";
    }

    movie.isFavorite = !!(movie.id && isFilmInFavorite(String(movie.id)));
};
function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const copy = {} as Pick<T, K>;
    keys.forEach((key) => (copy[key] = obj[key]));
    return copy;
}
function instanceOfResponseMovieArrayInterface(
    object: responseMovieArrayInterface | responseMovieInterface
): object is responseMovieArrayInterface {
    return 'results' in object;
}
const movieDataMapper = async (
    serverResponse: Response
): Promise<movieData[]> => {
    const data: responseMovieArrayInterface | responseMovieInterface =
        await serverResponse.json();
    if (instanceOfResponseMovieArrayInterface(data)) {
        const movieArray: [responseMovieInterface] = data.results;
        const result: movieData[] = [];
        for (const currentMovie of movieArray) {
            setDefaultValue(currentMovie);
            const preparedFilm = pick(currentMovie, ...requiredFilmProperty);
            preparedFilm.page = data.page;
            preparedFilm.total_pages = data.total_pages;
            result.push(preparedFilm);
        }
        return result;
    } else {
        setDefaultValue(data);
        const preparedFilm = pick(data, ...requiredFilmProperty);
        return [preparedFilm];
    }
};

export { movieDataMapper };
