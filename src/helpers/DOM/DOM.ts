import { movieData } from '../data-mapper/interfaces/interfaces';
import { renderFilmsCategory } from '../../index';

function createMovieElement(
    movie: movieData,
    movieType: renderFilmsCategory,
    isMovieFavorite = false
): string {
    return `
     <div class="${
         movieType === renderFilmsCategory.favorite
             ? 'col-12 p-2'
             : 'col-lg-3 col-md-4 col-12 p-2'
     }"  data-film_id=${movie.id}>  
                            <div class="card shadow-sm">
                                <img
                                    alt = "poster img"
                                    src= "${movie.poster_path}"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    stroke="red"
                                    fill="${
                                        movieType ===
                                            renderFilmsCategory.favorite ||
                                        isMovieFavorite
                                            ? 'red'
                                            : '#ff000078'
                                    }"
                                    width="50"
                                    height="50"
                                    data-film_id=${movie.id}
                                    class="bi bi-heart-fill position-absolute p-2"
                                    viewBox="0 -2 18 22"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                                    />
                                </svg>
                                <div class="card-body">
                                    <p class="card-text truncate">
                                        ${movie.overview}
                                    </p>
                                    <div
                                        class="
                                            d-flex
                                            justify-content-between
                                            align-items-center
                                        "
                                    >
                                        <small class="text-muted">${
                                            movie.release_date
                                        }</small>
                                    </div>
                                </div>
                            </div>
                        </div>
    `;
}
const getPlaceHolder = (movieType: renderFilmsCategory):string => {
    return `
     <div class=${
         movieType === renderFilmsCategory.favorite
             ? 'col-12 p-2 nothing'
             : 'col-lg-12 col-md-12 col-12 p-12 nothing'
     }>  
     <img src='https://i.ibb.co/8zBWP92/CULES-3.png' alt=CULES-3 width = 100%>
     </div>
    `;
};
const addClickEvent = (
    selector: string | [string],
    callback: (event: HTMLElement | MouseEvent) => void
): void => {
    if (typeof selector === 'object') {
        selector.forEach((currentSelector) => {
            const element: HTMLElement | null =
                document.querySelector(currentSelector);
            element?.addEventListener('click', callback);
        });
        return;
    }
    const element: HTMLElement | null = document.querySelector(selector);
    element?.addEventListener('click', callback);
};

export { createMovieElement, addClickEvent, getPlaceHolder };
