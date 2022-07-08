interface responseMovieInterface {
    poster_path: string | null;
    readonly adult?: number;
    overview: string;
    readonly release_date: string;
    readonly genre_ids?: [number];
    readonly id: number;
    readonly original_title?: string;
    readonly original_language?: string;
    title: string;
    backdrop_path: string | null;
    readonly popularity?: number;
    readonly vote_count?: boolean;
    readonly video?: boolean;
    readonly vote_average?: number;
    isFavorite: boolean;
    page?: number;
    total_pages: number;
}
interface responseMovieArrayInterface {
    page: number;
    readonly total_result: number;
    readonly results: [responseMovieInterface];
    total_pages: number;
}
interface movieData {
    readonly poster_path: string | null;
    readonly backdrop_path: string | null;
    readonly id: number;
    readonly title: string;
    readonly overview: string;
    readonly release_date: string;
    readonly isFavorite: boolean;
    page?: number;
    total_pages?:number;
}
const requiredFilmProperty: (keyof responseMovieInterface)[] = [
    'poster_path' as keyof responseMovieInterface,
    'backdrop_path' as keyof responseMovieInterface,
    'id' as keyof responseMovieInterface,
    'title' as keyof responseMovieInterface,
    'overview' as keyof responseMovieInterface,
    'release_date' as keyof responseMovieInterface,
    'isFavorite' as keyof responseMovieInterface,
];

export {
    movieData,
    requiredFilmProperty,
    responseMovieInterface,
    responseMovieArrayInterface,
};
