import { movieDataMapper } from '../helpers/data-mapper/movie-arraydata-mapper';
import { movieData } from '../helpers/data-mapper/interfaces/interfaces';

export function api(url: string): Promise<movieData[]> {
    return fetch(url).then((response: Response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return movieDataMapper(response);
    });
}
