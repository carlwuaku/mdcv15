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
export function getLabelFromKey(key: string, capitalise?:boolean) {
    let fullName = replace_underscore(key, ' ');
    return capitalise? fullName.toUpperCase() : fullName.charAt(0).toUpperCase() + fullName.split('').slice(1).join('');
}

export function replace_underscore(str:string, sub:string):string {
    return str.replace(/_/g, sub);
}

export function goBackHome(){
    window.location.assign('/')
}

export function replaceSpaceWithUnderscore(str:string|null, stringifyNull:boolean = true):string {
  if(!str){
    return stringifyNull ? "null" : "";
  }
    return str.replace(/ /g, '_');
}



