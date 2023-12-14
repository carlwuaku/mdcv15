import { Title } from '@angular/platform-browser';

export function extractKeys(object: any, exclude: any[]) {
    const keys = [];
    for (const key in object) {
        if (exclude.indexOf(key) == -1) {
            keys.push(key);
        }

    }
    return keys;
}
/**
 * get the label text. replace underscores with spaces and capitalise
 * @param key any string
 * @returns string
 */
export function getLabelFromKey(key: string) {
    let str1 = replace_underscore(key, ' ');
    return str1.toUpperCase()
}

export function replace_underscore(str:string, sub:string):string {
    return str.replace(/_/g, sub);
}

