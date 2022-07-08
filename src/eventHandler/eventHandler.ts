import {
    addFavoriteFilm,
    deleteFavoriteFilm,
    isFilmInFavorite,
} from '../helpers/favoriteFilms/favoriteFilm';
import { api } from '../api/api';
import { movieData } from '../helpers/data-mapper/interfaces/interfaces';
import {
    appState,
    filmSection,
    loadMoreFilmCategory,
    render,
    renderFilmsCategory,
    renderRandomMovie,
} from '../index';
import { API_KEY } from '../constants/constants';

//const callApiAndRender = async (renderFilmCategory: renderFilmsCategory) => {};
interface createUrlParams {
    readonly filmId?: string;
    readonly value?: string;
    readonly page?: number;
    readonly loadMoreFilmCategory?: loadMoreFilmCategory;
}
const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

const getLoadMoreFilmCategory = (
    loadMoreCategory: loadMoreFilmCategory
): string => {
    switch (loadMoreCategory) {
        case loadMoreFilmCategory.popular:
            return 'popular';
        case loadMoreFilmCategory.search:
            return 'search';
        case loadMoreFilmCategory.upcoming:
            return 'upcoming';
        case loadMoreFilmCategory.top_rated:
            return 'top_rated';
        default:
            return 'popular';
    }
};

const crateUrl = (
    renderFilmCategory: renderFilmsCategory,
    params: createUrlParams
): string => {
    switch (renderFilmCategory) {
        case renderFilmsCategory.favorite:
            return `https://api.themoviedb.org/3/movie/${params.filmId}?api_key=${API_KEY}&language=en-US`;
        case renderFilmsCategory.popular:
            return `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        case renderFilmsCategory.search:
            return `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${
                params.value
            }&page=${params.page ? params.page : 1}&include_adult=false`;
        case renderFilmsCategory.upcoming:
            return `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;
        case renderFilmsCategory.top_rated:
            return `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
        case renderFilmsCategory.favorite_remove:
            return '';
        case renderFilmsCategory.load_more:
            if (params.loadMoreFilmCategory !== undefined) {
                const getMoreCategory = getLoadMoreFilmCategory(
                    params.loadMoreFilmCategory
                );
                return `https://api.themoviedb.org/3/movie/${getMoreCategory}?api_key=59660425c4f0f2a3a0965fe532d1dcb2&language=en-US&page=${params.page}`;
            }
            throw 'error cant load more';
    }
};
const handleSearchFormSubmit = async (event: Event):Promise <void> => {
    event?.preventDefault();
    await handleSearch();
}
const handleFavoriteFilm = async (event: Event): Promise<void> => {
    const eventTarget = event.target as HTMLElement;
    const likeButton = eventTarget?.dataset.film_id
        ? eventTarget
        : eventTarget?.closest('svg');
    const filmId: string | undefined = likeButton?.dataset.film_id;
    if (!filmId || !likeButton) {
        return;
    }
    if (isFilmInFavorite(filmId)) {
        const deletedFavoriteFilm: string | null = deleteFavoriteFilm(filmId);
        if (deletedFavoriteFilm === null) {
            return;
        }
        await render(
            renderFilmsCategory.favorite_remove,
            [],
            deletedFavoriteFilm
        );
        likeButton.style.fill = '#ff000078';
    } else {
        addFavoriteFilm(filmId);
        const url: string = crateUrl(renderFilmsCategory.favorite, { filmId });
        const response: movieData[] = await api(url);
        await render(renderFilmsCategory.favorite, response);
        likeButton.style.fill = 'red';
    }
};

const handleSearch = async (): Promise<void> => {
    const search: HTMLInputElement = <HTMLInputElement>(
        document.getElementById('search')
    );
    const url: string = crateUrl(renderFilmsCategory.search, {
        value: search.value,
        page: 1,
    });
    const response: movieData[] = await api(url);
    await render(renderFilmsCategory.search, response);
};

const handleInputChange = async (): Promise<void> => {
    const search: HTMLInputElement = <HTMLInputElement>(
        document.getElementById('search')
    );
    if (search?.value.trim() === '') {
        switch (appState.currentFilmSection) {
            case filmSection.top_rated:
                await handleTopFilm();
                break;
            case filmSection.upcoming:
                await handleUpcomingFilm();
                break;
            case filmSection.popular:
                await handlePopularFilm();
                break;
        }
    }
};

const handleTopFilm = async (): Promise<void> => {
    const url: string = crateUrl(renderFilmsCategory.top_rated, {});
    const response: movieData[] = await api(url);
    appState.currentFilmSection = filmSection.top_rated;
    await render(renderFilmsCategory.top_rated, response);
};

const handleUpcomingFilm = async (): Promise<void> => {
    const url: string = crateUrl(renderFilmsCategory.upcoming, {});
    const response: movieData[] = await api(url);
    appState.currentFilmSection = filmSection.upcoming;
    await render(renderFilmsCategory.upcoming, response);
};

const handlePopularFilm = async (): Promise<void> => {
    const url: string = crateUrl(renderFilmsCategory.popular, {});
    const response: movieData[] = await api(url);
    appState.currentFilmSection = filmSection.popular;
    if (appState.is_first_run) {
        const randomMovieIndex: number = getRandomInt(0, response.length);
        const randomMovie: movieData = response[randomMovieIndex];
        renderRandomMovie(randomMovie);
        appState.is_first_run = false;
    }

    await render(renderFilmsCategory.popular, response);
};

const handleLoadMore = async (): Promise<void> => {
    appState.page = appState.page + 1;
    if (appState.page <= appState.total_pages) {
        const { page, current_film_category } = appState;
        if (current_film_category === loadMoreFilmCategory.search) {
            const search: HTMLInputElement = <HTMLInputElement>(
                document.getElementById('search')
            );
            const searchValue: string = search.value;
            const url: string = crateUrl(renderFilmsCategory.search, {
                page,
                value: searchValue,
                loadMoreFilmCategory: current_film_category,
            });
            const response: movieData[] = await api(url);

            await render(renderFilmsCategory.load_more, response);
            return;
        }
        const url = crateUrl(renderFilmsCategory.load_more, {
            page,
            loadMoreFilmCategory: current_film_category,
        });
        const response: movieData[] = await api(url);

        await render(renderFilmsCategory.load_more, response);
    }
};

export {
    handleFavoriteFilm,
    handleSearch,
    handleUpcomingFilm,
    handleTopFilm,
    handlePopularFilm,
    handleInputChange,
    handleLoadMore,
    handleSearchFormSubmit,
};
