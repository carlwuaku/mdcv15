import { IFormGenerator } from "../components/form-generator/form-generator-interface";

/**
 * Extracts the keys from an object but excludes the ones that are in the
 * exclude array
 * @param object any object
 * @param exclude array of strings of keys that should be excluded
 * @returns array of strings of object keys
 */
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

/**
 * Determines the input type based on the provided field name.
 * Analyzes the name to identify common patterns and returns a
 * corresponding input type string.
 *
 * @param name - The field name to analyze.
 * @returns A string representing the input type, such as 'textarea',
 * 'text', 'picture', 'date', 'file', 'email', 'password', 'tel', 'url',
 * or 'number'. Defaults to 'text' if no specific type is determined.
 */

export function guessInputType(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('description')) {
    return 'textarea';
  }
  if (lowerName.includes('registration_number') || lowerName.includes('id_number') || lowerName.includes('license_number')) {
    return 'text';
  }

  if (lowerName.includes('picture') || lowerName.includes('photo') || lowerName.includes('image')) {
    return 'picture';
  }

  if (lowerName.includes('date') || lowerName.endsWith('_at') || lowerName.endsWith('_on')) {
    return 'date';
  }

  if (lowerName.includes('file') || lowerName.includes('attachment') || lowerName.includes('document')) {
    return 'file';
  }

  if (lowerName.includes('email')) {
    return 'email';
  }

  if (lowerName.includes('password')) {
    return 'password';
  }

  if (lowerName.includes('phone') || lowerName.includes('mobile')) {
    return 'tel';
  }

  if (lowerName.includes('url') || lowerName.includes('website') || lowerName.includes('link')) {
    return 'url';
  }

  if (lowerName.includes('number') || lowerName.includes('amount') || lowerName.includes('quantity')) {
    return 'number';
  }

  // Default to text for any other cases
  return 'text';
}

/**
 * Replace all occurrences of underscore in a given string with a given substring
 * @param str The string to replace the underscore in
 * @param sub The substring to replace the underscore with
 * @returns The string with all occurrences of underscore replaced
 */
export function replace_underscore(str: string, sub: string): string {
  return str.replace(/_/g, sub);
}

export function goBackHome(message?: string) {
  if (message) {
    alert(message)
  }
  window.location.assign('/')
}

export function goBack() {
  window.history.back();
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

export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function generateFormFieldsFromObject(object: any, exclude: string[] = []): IFormGenerator[] {
  const keys = extractKeys(object, exclude);
  const fields: IFormGenerator[] = [];
  keys.forEach(key => {
    fields.push({
      label: getLabelFromKey(key),
      name: key,
      hint: "",
      options: [],
      type: guessInputType(key),
      value: object[key],
      required: false,
      api_url: "",
      apiKeyProperty: "",
      apiLabelProperty: "",
    });
  });
  return fields;
}

export function getClassFromState(state: string): string {
  const classes: Record<string, string> = {
    "active": "text-green",
    "inactive": "text-red",
    "pending": "text-orange",
    "approved": "text-green",
    "rejected": "text-red",
    "deleted": "text-red",
    "restored": "text-green",
    "In Good Standing": "text-green",
    "Not In Good Standing": "text-red",
  };
  return classes[state] || "text-black";
}
export function openHtmlInNewWindow(htmlContent: string): void {
  // Create a Blob containing the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Open a new window with the URL
  window.open(url, '_blank');

  // Optional: Release the URL object when done
  // You might want to do this in ngOnDestroy or another appropriate lifecycle hook
  // URL.revokeObjectURL(url);
}

/**
 * get the label text from an object using a provided key. replace underscores with spaces and capitalise
 * @param {object} object any object
 * @param {string} labelProperty the keys from the object to use as the label. can be a comma-separated list of keys
 * @returns {string} string
 */
export function getLabel(object: any, labelProperty: string): string {
  if (typeof object === "object") {
    if (labelProperty.includes(",")) {
      const labels = labelProperty.split(",").map((prop: string) => object[prop.trim()]).join(" ");
      return getLabelFromKey(labels);
    } else {
      let value = object[labelProperty];
      if (value === null || value === undefined) {
        return "--Null--";
      }
      if (typeof value === "object") {
        return getLabelFromKey(JSON.stringify(value));
      }
      if (typeof value === "string" && value.trim() === "") {
        return "--Empty Value--";
      }
      return getLabelFromKey(value);
    }
  }
  else {
    if (object === null || object === undefined) {
      return "--Null--";
    }
    if (typeof object === "string" && object.trim() === "") {
      return "--Empty Value--";
    }
    return getLabelFromKey(object);
  }
}

/**
 * Sets the value of a specific form field within a form.
 *
 * @param {IFormGenerator[]} form - The array of form fields.
 * @param {string} name - The name of the field to be updated.
 * @param {any} value - The new value to set for the specified field.
 */

export function setFormFieldValue(form: IFormGenerator[], name: string, value: any) {
  const field = form.find(f => f.name === name);
  if (field) {
    field.value = value;
  }
}

/**
 * Updates a single query param value in a given url.
 * @param {string} url The url to update
 * @param {string} paramName The name of the query param to update
 * @param {string} paramValue The new value for the query param
 * @returns {string} The updated url
 */
export function updateUrlQueryParamValue(url: string, paramName: string, paramValue: string): string {
  if (url.startsWith("http")) {
    const urlObj = new URL(url);
    urlObj.searchParams.set(paramName, paramValue);
    return urlObj.toString();
  }
  else {
    //treat as a normal string that might contain param-like values
    const regex = new RegExp(`(${paramName}=)([^&]*)`);
    const newUrl = url.replace(regex, `$1${paramValue}`);
    return newUrl;
  }

}

export function sortObjectsByField(field: string, sortDirection: string, objects: any[]): any[] {
  if (sortDirection === "asc") {
    return objects.sort((a, b) => a[field] > b[field] ? 1 : -1);
  } else {
    return objects.sort((a, b) => a[field] < b[field] ? 1 : -1);
  }
}

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true
  }
  if (Array.isArray(value)) {
    return value.length === 0
  }
  return typeof value === 'string' && value.trim() === '';
}



