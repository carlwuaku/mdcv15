import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnChanges {
  @Input() jsonObject: any = {};
  @Input() initialValue: string | object | any[] = {};
  @Input() schema: any; // Schema definition for validation
  @Input() isArray: boolean = false; // Whether the expected structure is an array
  @Output() valueChanged = new EventEmitter<any>();

  jsonText: string = '';
  isValid: boolean = true;
  errorMessage: string = '';
  validationErrors: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jsonObject'] && changes['jsonObject'].currentValue) {
      this.updateJsonText(changes['jsonObject'].currentValue);
    }
    if (changes['initialValue'] && changes['initialValue'].currentValue) {
      if (typeof changes['initialValue'].currentValue === 'string') {
        this.jsonText = changes['initialValue'].currentValue;
        this.validateAndEmit();
      } else {
        this.updateJsonText(changes['initialValue'].currentValue);
      }
    }
  }

  private updateJsonText(value: any): void {
    try {
      this.jsonText = JSON.stringify(value, null, 2);
      this.isValid = true;
      this.errorMessage = '';
    } catch (error: any) {
      this.jsonText = '';
      this.isValid = false;
      this.errorMessage = 'Unable to stringify value';
    }
  }

  onTextChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.jsonText = target.value;
    this.validateAndEmit();
  }

  private validateAndEmit(): void {
    if (!this.jsonText.trim()) {
      this.isValid = false;
      this.errorMessage = 'JSON cannot be empty';
      this.validationErrors = [];
      return;
    }

    try {
      const parsed = JSON.parse(this.jsonText);

      // Validate against schema if provided
      if (this.schema) {
        const schemaValidation = this.validateAgainstSchema(parsed, this.schema);
        if (!schemaValidation.isValid) {
          this.isValid = false;
          this.errorMessage = 'Schema validation failed';
          this.validationErrors = schemaValidation.errors;
          return;
        }
      }

      this.isValid = true;
      this.errorMessage = '';
      this.validationErrors = [];
      this.jsonObject = parsed;
      this.valueChanged.emit(parsed);
    } catch (error: any) {
      this.isValid = false;
      this.errorMessage = this.parseJsonError(error.message);
      this.validationErrors = [];
    }
  }

  private parseJsonError(errorMessage: string): string {
    // Make error messages more user-friendly
    if (errorMessage.includes('Unexpected token')) {
      return `Invalid JSON syntax: ${errorMessage}`;
    }
    if (errorMessage.includes('position')) {
      return `Syntax error: ${errorMessage}`;
    }
    return `Invalid JSON: ${errorMessage}`;
  }

  formatJson(): void {
    if (this.isValid && this.jsonObject) {
      try {
        this.jsonText = JSON.stringify(this.jsonObject, null, 2);
      } catch (error) {
        // Silently fail if formatting doesn't work
      }
    }
  }

  private validateAgainstSchema(data: any, schema: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.isArray && !Array.isArray(data)) {
      errors.push('Expected an array');
      return { isValid: false, errors };
    }

    if (this.isArray && Array.isArray(data)) {
      // Validate each item in the array against the schema
      data.forEach((item, index) => {
        const itemErrors = this.validateObject(item, schema, `[${index}]`);
        errors.push(...itemErrors);
      });
    } else if (!this.isArray) {
      // Validate the object against the schema
      const objectErrors = this.validateObject(data, schema, '');
      errors.push(...objectErrors);
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateObject(obj: any, schema: any, path: string): string[] {
    const errors: string[] = [];

    if (typeof obj !== 'object' || obj === null) {
      errors.push(`${path}: Expected an object, got ${typeof obj}`);
      return errors;
    }

    // Check for required fields from schema
    Object.keys(schema).forEach(key => {
      const fullPath = path ? `${path}.${key}` : key;

      if (!(key in obj)) {
        errors.push(`${fullPath}: Missing required field`);
      } else {
        // Type checking
        if (schema[key] !== null && schema[key] !== undefined) {
          if (Array.isArray(schema[key]) && !Array.isArray(obj[key])) {
            errors.push(`${fullPath}: Expected array`);
          } else if (typeof schema[key] === 'object' && !Array.isArray(schema[key]) && schema[key] !== null) {
            // Nested object validation
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              const nestedErrors = this.validateObject(obj[key], schema[key], fullPath);
              errors.push(...nestedErrors);
            } else if (obj[key] !== null) {
              errors.push(`${fullPath}: Expected nested object`);
            }
          }
        }
      }
    });

    return errors;
  }

  addObject(): void {
    if (!this.isArray) {
      return;
    }

    try {
      const currentData = this.jsonText.trim() ? JSON.parse(this.jsonText) : [];
      const newArray = Array.isArray(currentData) ? currentData : [];

      // Create a new object based on the schema
      const newObject = this.schema ? this.createObjectFromSchema(this.schema) : {};
      newArray.push(newObject);

      this.updateJsonText(newArray);
      this.validateAndEmit();
    } catch (error) {
      // If parsing fails, create a new array with one object
      const newObject = this.schema ? this.createObjectFromSchema(this.schema) : {};
      this.updateJsonText([newObject]);
      this.validateAndEmit();
    }
  }

  private createObjectFromSchema(schema: any): any {
    const obj: any = {};

    Object.keys(schema).forEach(key => {
      const value = schema[key];

      if (value === null || value === undefined) {
        obj[key] = null;
      } else if (Array.isArray(value)) {
        obj[key] = [];
      } else if (typeof value === 'object') {
        obj[key] = this.createObjectFromSchema(value);
      } else if (typeof value === 'string') {
        obj[key] = '';
      } else if (typeof value === 'number') {
        obj[key] = 0;
      } else if (typeof value === 'boolean') {
        obj[key] = false;
      } else {
        obj[key] = null;
      }
    });

    return obj;
  }

  clearValue(): void {
    this.jsonText = '';
    this.isValid = false;
    this.errorMessage = 'JSON cannot be empty';
    this.validationErrors = [];
    this.jsonObject = null;
    this.valueChanged.emit(null);
  }
}
