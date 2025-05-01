export function isNumeric(string: string): boolean {
    if (typeof string != 'string') return false;

    // @ts-ignore
    return !isNaN(string) && !isNaN(parseFloat(string));
}
