import qs from 'qs';
import { isNumeric } from './text';

/**
 * Wywołuje dekoder, który zamienia typ danych wartości na ten odpowiedni dla niej.
 * @returns Wartość zamienioną na odpowiedni dla niej typ danych.
 */
export function executeCustomQsDecoder(
    str: string,
    type: 'key' | 'value'
): any {
    // Dla klucza, zwraca po prostu jego nazwę.
    if (type === 'key') return str;
    // Dla wartości, trzeba sprawdzić, jaki jest typ danych.
    else if (type === 'value') {
        // string równy 'true'
        if (str === 'true') return true;
        // string równy 'false'
        else if (str === 'false') return false;
        // string w całości wartością numeryczną
        else if (isNumeric(str)) return parseInt(str);
        // string zawierający cokolwiek innego
        else return str;
    }
}

/**
 * Konwertuje string'a na obiekt Qs.
 * @returns Przekonwertowany string na obiekt Qs.
 */
export function parseQueryString(url: string, host: string) {
    return qs.parse(new URL(url, `http://${host}`).search.substring(1), {
        decoder: (str, _defaultDecoder, _charset, type) =>
            executeCustomQsDecoder(str, type),
        depth: 10
    });
}

/**
 * Konwertuje obiekt `obj` na string'a, gotowego do użycia w zapytaniu URL.
 * @param object Obiekt do przekonwertowania na string'a.
 * @returns String gotowy do użycia w zapytaniu URL.
 */
export function stringifyQueryString(object: any): string {
    return qs.stringify(object);
}
