import qs from 'qs';

import { NodeRequest } from '../types/api.js';

import { isNumeric } from './text.js';

/**
 * Wywołuje dekoder, który zamienia typ danych wartości na ten odpowiedni dla niej.
 * @returns Wartość zamienioną na odpowiedni dla niej typ danych.
 */
export function executeCustomQsDecoder(
    str: string,
    type: 'key' | 'value'
): any {
    if (type === 'key') return str;
    else if (type === 'value') {
        if (str === 'true') return true;
        else if (str === 'false') return false;
        else if (isNumeric(str)) return parseInt(str);
        else return str.replace(/%2F/g, '/');
    }
}

/**
 * Konwertuje string'a na obiekt Qs.
 * @returns Przekonwertowany string na obiekt Qs.
 */
export function parseQueryString(req: NodeRequest) {
    if (req === undefined) return null;

    return qs.parse(
        new URL(req.url, `http://${req.headers.host}`).search.substring(1),
        {
            decoder: (str, _defaultDecoder, _charset, type) =>
                executeCustomQsDecoder(str, type),
            depth: 10
        }
    );
}

/**
 * Konwertuje obiekt `obj` na string'a, gotowego do użycia w zapytaniu URL.
 * @param object Obiekt do przekonwertowania na string'a.
 * @returns String gotowy do użycia w zapytaniu URL.
 */
export function stringifyQueryString(object: any): string {
    return qs.stringify(object);
}
