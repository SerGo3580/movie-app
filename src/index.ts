import {
    handleFavoriteFilm,
    handleInputChange,
    handleLoadMore,
    handlePopularFilm,
    handleSearch,
    handleSearchFormSubmit,
    handleTopFilm,
    handleUpcomingFilm,
    disableLoadMoreButton,
    enableLoadMoreButton,
} from './eventHandler/eventHandler';
import { movieData } from './helpers/data-mapper/interfaces/interfaces';
import {
    addClickEvent,
    createMovieElement,
    getPlaceHolder,
} from './helpers/DOM/DOM';
import { getFavoriteFilmArray } from './helpers/favoriteFilms/favoriteFilm';
import { api } from './api/api';
import { dontFavoriteFilmLikeButtonFillColor } from './constants/constants';

enum loadMoreFilmCategory {
    popular,
    upcoming,
    top_rated,
    search,
}

enum renderFilmsCategory {
    popular,
    upcoming,
    top_rated,
    search,
    favorite,
    favorite_remove,
    load_more,
}
enum filmSection {
    popular,
    upcoming,
    top_rated,
}

const addEventListener = (): void => {
    addClickEvent('#submit', handleSearch);
    addClickEvent('#button-wrapper label[for="popular"]', handlePopularFilm);
    addClickEvent('#button-wrapper label[for="upcoming"]', handleUpcomingFilm);
    addClickEvent('#button-wrapper label[for="top_rated"]', handleTopFilm);
    addClickEvent('#load-more', handleLoadMore);

    const input: HTMLElement | null = document.getElementById('search');
    input?.addEventListener('input', handleInputChange);

    const form: HTMLElement | null = document.querySelector('form');
    form?.addEventListener('submit', handleSearchFormSubmit);
};
interface appStateInterface {
    page: number;
    total_pages: number;
    current_film_category: loadMoreFilmCategory;
    is_first_run: boolean;
    currentFilmSection: filmSection;
}

const appState: appStateInterface = {
    page: 1,
    total_pages: 0,
    current_film_category: loadMoreFilmCategory.popular,
    is_first_run: true,
    currentFilmSection: filmSection.popular,
};

const start = async (): Promise<void> => {
    const favoriteFilmIdArray: string[] = getFavoriteFilmArray();
    const favoriteFilmArray: movieData[] = [];
    for (const currentFilmId of favoriteFilmIdArray) {
        const url = `https://api.themoviedb.org/3/movie/${currentFilmId}?api_key=59660425c4f0f2a3a0965fe532d1dcb2&language=en-US`;
        const currentFilm: movieData[] = await api(url);
        favoriteFilmArray.push(currentFilm[0]);
    }
    await render(renderFilmsCategory.favorite, favoriteFilmArray);
    await handlePopularFilm();
    addEventListener();
};
const deleteFavoriteMovie = (movieToDeleteFromFavoriteId: string) => {
    const favoriteFilmsArray: Element[] | null = Array.from(
        document.getElementById('favorite-movies')?.children as HTMLCollection
    );
    /* remove favorite film from favorite films container */

    const favoriteMovieContainer: HTMLElement | null =
        document.getElementById('favorite-movies');
    for (
        let movieIndex = 0;
        movieIndex < favoriteFilmsArray.length;
        movieIndex++
    ) {
        const currentMovie = favoriteFilmsArray[movieIndex] as HTMLElement;
        const filmId: string | undefined = currentMovie?.dataset.film_id;
        if (filmId === movieToDeleteFromFavoriteId) {
            favoriteMovieContainer?.removeChild(currentMovie);
        }
    }
    /* change like button color of deleted favorite films in main film container*/
    const filmContainerLikeButtonArray: HTMLElement[] = Array.from(
        document.querySelectorAll('#film-container svg')
    );
    filmContainerLikeButtonArray.forEach((currentLikeButton: HTMLElement) => {
        const currentFilmId: string | undefined =
            currentLikeButton?.dataset.film_id;
        if (!currentFilmId) {
            return;
        }
        if (currentFilmId === movieToDeleteFromFavoriteId) {
            currentLikeButton.style.fill = dontFavoriteFilmLikeButtonFillColor;
        }
    });
    /* if no favorite add placeholder*/
    if (favoriteMovieContainer?.children.length === 0) {
        favoriteMovieContainer.innerHTML = getPlaceHolder(
            renderFilmsCategory.favorite
        );
    }
};
const removePlaceHolder = (container: HTMLElement) => {
    const placeholder: HTMLElement | null = container.querySelector('.nothing');
    placeholder?.remove();
};
const addEventListenerForLikeButton = () => {
    const heartButtonArrayFilmContainer: HTMLElement[] = Array.from(
        document.querySelectorAll('#film-container svg')
    );
    const heartButtonArrayFavoriteMovies: HTMLElement[] = Array.from(
        document.querySelectorAll('#favorite-movies svg')
    );
    const addLikeButtonEvent = (heartButton: HTMLElement) => {
        heartButton.addEventListener('click', handleFavoriteFilm);
    };
    heartButtonArrayFilmContainer.forEach(addLikeButtonEvent);
    heartButtonArrayFavoriteMovies.forEach(addLikeButtonEvent);
};
const renderRandomMovie = (movieToRender: movieData): void => {
    const randomMovieHeaderElement: HTMLElement | null =
        document.getElementById('random-movie-name');
    if (randomMovieHeaderElement) {
        randomMovieHeaderElement.innerHTML = movieToRender.title;
    }

    const randomMovieDescriptionElement: HTMLElement | null =
        document.getElementById('random-movie-description');
    if (randomMovieDescriptionElement) {
        randomMovieDescriptionElement.innerHTML = movieToRender.overview;
    }

    const randomMovieContainer: HTMLElement | null =
        document.getElementById('random-movie');
    if (randomMovieContainer) {
        randomMovieContainer.style.backgroundImage = `url('${movieToRender.backdrop_path}')`;
    }
};

const render = async (
    renderFilmCategory: renderFilmsCategory,
    movieToRender: movieData[],
    movieToDeleteFromFavoriteId: string | null = null
): Promise<void> => {
    // TODO render your app here
    const movieList: string[] = [];
    if (
        movieToDeleteFromFavoriteId &&
        renderFilmCategory === renderFilmsCategory.favorite_remove &&
        movieToDeleteFromFavoriteId?.length > 0
    ) {
        deleteFavoriteMovie(movieToDeleteFromFavoriteId);
        return;
    }
    switch (renderFilmCategory) {
        case renderFilmsCategory.search:
            appState.current_film_category = loadMoreFilmCategory.search;
            break;
        case renderFilmsCategory.popular:
            appState.current_film_category = loadMoreFilmCategory.popular;
            break;
        case renderFilmsCategory.top_rated:
            appState.current_film_category = loadMoreFilmCategory.top_rated;
            break;
        case renderFilmsCategory.upcoming:
            appState.current_film_category = loadMoreFilmCategory.upcoming;
            break;
    }
    if (
        movieToRender.length &&
        movieToRender[0].page &&
        movieToRender[0].total_pages &&
        renderFilmCategory !== renderFilmsCategory.load_more
    ) {
        appState.page = movieToRender[0].page;
        appState.total_pages = movieToRender[0].total_pages;
    }

    for (const currentMovie of movieToRender) {
        const currentFilmElement = createMovieElement(
            currentMovie,
            renderFilmCategory,
            currentMovie.isFavorite
        );
        movieList.push(`${currentFilmElement}`);
    }

    const filmContainer =
        renderFilmCategory === renderFilmsCategory.favorite
            ? (document.getElementById('favorite-movies') as HTMLElement)
            : (document.querySelector(
                  '.container > #film-container'
              ) as HTMLElement);
    if (filmContainer !== null) {
        if (movieList.length === 0 || movieToRender.length === 0) {
            filmContainer.innerHTML = getPlaceHolder(renderFilmCategory);
            disableLoadMoreButton();
        } else if (
            renderFilmCategory === renderFilmsCategory.favorite ||
            renderFilmCategory === renderFilmsCategory.load_more
        ) {
            removePlaceHolder(filmContainer);
            const prevContent: string = filmContainer?.innerHTML;
            filmContainer.innerHTML = `${prevContent} \n ${movieList.join(
                '\n'
            )}`;
        } else {
            removePlaceHolder(filmContainer);
            enableLoadMoreButton();
            filmContainer.innerHTML = movieList.join('\n');
        }
    }
    addEventListenerForLikeButton();
};

export {
    addEventListener,
    render,
    start,
    renderFilmsCategory,
    loadMoreFilmCategory,
    renderRandomMovie,
    filmSection,
    appState,
};
