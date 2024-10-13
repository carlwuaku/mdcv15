import { IFormGenerator } from "../components/form-generator/form-generator-interface";

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

export function replace_underscore(str: string, sub: string): string {
  return str.replace(/_/g, sub);
}

export function goBackHome(message?: string) {
  if (message) {
    alert(message)
  }
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




