
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
export function getLabelFromKey(key: string, capitalise?: boolean) {
  let fullName = replace_underscore(key, ' ');
  return capitalise ? fullName.toUpperCase() : fullName.charAt(0).toUpperCase() + fullName.split('').slice(1).join('');
}

export function replace_underscore(str: string, sub: string): string {
  return str.replace(/_/g, sub);
}

export function goBackHome() {
  window.location.assign('/')
}

export function replaceSpaceWithUnderscore(str: string | null, stringifyNull: boolean = true): string {
  if (!str) {
    return stringifyNull ? "null" : "";
  }
  return typeof str === 'string' ? str.replace(/ /g, '_') : "";
}

export function printDiv(idName: string): void {
  const printContents = document.getElementById(idName)!.innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow!.document.write('<html><head><title>Print</title></head><body>');
  printWindow!.document.write(printContents);
  printWindow!.document.write('</body></html>');
  printWindow!.document.close();
  printWindow!.onload = function () {
    printWindow!.print();
  };
}

export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value:any):boolean{
  return Array.isArray(value);
}




