import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, AfterViewInit, AfterContentInit } from '@angular/core';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

export interface TemplateElement {
  id: number;
  type: 'text' | 'rect' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textAlign: string;
  verticalAlign: string;
  color: string;
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderStyle: string;
  rotation: number;
  zIndex: number;
}

export interface TemplateData {
  elements: TemplateElement[];
  canvasWidth: number;
  canvasHeight: number;
  pageSize: string;
  orientation: string;
  settings: {
    gridSize: number;
    showGrid: boolean;
    snapToGrid: boolean;
  };
}

export interface AlignmentGuide {
  x?: number;
  y?: number;
  type: string;
  label?: string;
}

@Component({
  selector: 'app-template-designer',
  templateUrl: './template-designer.component.html',
  styleUrls: ['./template-designer.component.scss']
})
export class TemplateDesignerComponent implements AfterContentInit {
  @Input() initialHtml?: string;
  @Input() initialData?: TemplateData;
  @Output() templateChange = new EventEmitter<TemplateData>();
  @Output() htmlExport = new EventEmitter<string>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  elements: TemplateElement[] = [];
  selectedElement: number | null = null;
  tool: string = 'select';
  isDragging = false;
  isResizing = false;
  resizeHandle: string | null = null;
  dragStart = { x: 0, y: 0 };
  showGrid = true;
  snapToGrid = false;
  gridSize = 10;
  keyboardStep = 1;
  alignmentGuides: { vertical: AlignmentGuide[], horizontal: AlignmentGuide[] } = { vertical: [], horizontal: [] };
  uploadingImage: number | null = null;
  pageSize = 'A4';
  orientation = 'portrait';
  canvasWidth = 800;
  canvasHeight = 600;
  Math = Math;
  parseFloat = parseFloat;
  parseInt = parseInt;
  Array = Array;
  standardSizes: Record<string, { width: number, height: number }> = {
    'A4': { width: 210, height: 297 },      // Correct A4 portrait dimensions
    'A3': { width: 297, height: 420 },
    'A5': { width: 148, height: 210 },
    'Letter': { width: 216, height: 279 },   // 8.5" x 11"
    'Legal': { width: 216, height: 356 },    // 8.5" x 14"
    'Tabloid': { width: 279, height: 432 }   // 11" x 17"
  };
  pageWidth = 210;   // mm
  pageHeight = 297;  // mm
  scale = 2.5;

  // Key fix: Use print DPI for canvas sizing so elements scale correctly for print
  // 300 DPI = 11.811 pixels per mm (high quality print)
  // 150 DPI = 5.906 pixels per mm (good quality print)
  // 96 DPI = 3.78 pixels per mm (screen DPI)
  printDPI = 150; // Use 150 DPI for good balance of quality and performance
  mmToPixelRatio = this.printDPI / 25.4; // 25.4mm = 1 inch

  // Zoom functionality
  zoomLevel = 1;
  minZoom = 0.1;
  maxZoom = 5;
  zoomStep = 0.1;

  constructor(private notify: NotifyService) {

  }

  ngAfterContentInit() {


    if (this.initialData) {
      this.loadTemplateData(this.initialData);
    } else if (this.initialHtml) {
      // this.loadFromComplexHtml(this.initialHtml);
      this.loadFromSimpleHtml(this.initialHtml);
    }
    this.updateCanvasDimensions(this.pageWidth, this.pageHeight);
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Set default zoom to fit screen after canvas is rendered
    setTimeout(() => {
      this.fitToScreen();
    }, 100);
  }



  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  trackElement(index: number, element: TemplateElement): number {
    return element.id;
  }

  get selectedEl(): TemplateElement | undefined {
    return this.elements.find(el => el.id === this.selectedElement);
  }

  // private updateCanvasDimensions(width: number, height: number) {


  //   if (this.orientation === 'portrait') {
  //     [width, height] = [height, width];
  //   }

  //   const scale = 2.5;
  //   this.canvasWidth = Math.round(width * scale);
  //   this.canvasHeight = Math.round(height * scale);

  //   this.repositionElementsOnResize();
  // }

  private updateCanvasDimensions(width: number, height: number) {
    let actualWidth = width;
    let actualHeight = height;

    // Apply orientation
    if (this.orientation === 'landscape') {
      [actualWidth, actualHeight] = [actualHeight, actualWidth];
    }

    // Convert mm to pixels using print DPI - this ensures elements are properly sized for print
    this.canvasWidth = Math.round(actualWidth * this.mmToPixelRatio);
    this.canvasHeight = Math.round(actualHeight * this.mmToPixelRatio);

    this.repositionElementsOnResize();
  }



  private repositionElementsOnResize() {
    this.elements = this.elements.map(element => {
      let newX = element.x;
      let newY = element.y;
      let newWidth = element.width;
      let newHeight = element.height;

      if (newX + newWidth > this.canvasWidth) {
        newX = Math.max(0, this.canvasWidth - newWidth);
      }
      if (newY + newHeight > this.canvasHeight) {
        newY = Math.max(0, this.canvasHeight - newHeight);
      }

      if (newWidth > this.canvasWidth) {
        newWidth = this.canvasWidth - 20;
        newX = 10;
      }
      if (newHeight > this.canvasHeight) {
        newHeight = this.canvasHeight - 20;
        newY = 10;
      }

      return { ...element, x: newX, y: newY, width: newWidth, height: newHeight };
    });
  }

  // Add this method to your TemplateDesignerComponent class to replace the existing parseHtmlContent method

  private parseComplexHtmlContent(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // First try to find the expected container structure
    let container = doc.querySelector('div[style*="position: relative"]');

    // If not found, use the body or first div as container
    if (!container) {
      container = doc.body.children.length > 0 ? doc.body.children[0] as HTMLElement : doc.body;
    }

    // Set reasonable default canvas dimensions if not specified
    this.canvasWidth = 800;
    this.canvasHeight = 1000; // Taller for document-style templates

    if (container && container.getAttribute('style')) {
      const containerStyle = container.getAttribute('style') || '';
      const widthMatch = containerStyle.match(/width:\s*(\d+)px/);
      const heightMatch = containerStyle.match(/height:\s*(\d+)px/);

      if (widthMatch && heightMatch) {
        this.canvasWidth = parseInt(widthMatch[1]);
        this.canvasHeight = parseInt(heightMatch[1]);
      }
    }

    // Parse elements from the container
    const elements: TemplateElement[] = [];
    let elementIdCounter = Date.now();

    // Helper function to extract text content and create text elements
    const processTextElements = (element: HTMLElement, offsetX = 0, offsetY = 0, zIndex = 0) => {
      // Handle different element types
      if (element.tagName === 'IMG') {
        const rect = this.getElementBounds(element, offsetX, offsetY);
        const imageElement: TemplateElement = {
          id: elementIdCounter++,
          type: 'image',
          x: rect.x,
          y: rect.y,
          width: rect.width || 100,
          height: rect.height || 100,
          content: element.getAttribute('src') || '',
          fontSize: 16,
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'left',
          verticalAlign: 'middle',
          color: '#000000',
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderColor: '#cccccc',
          borderStyle: 'solid',
          rotation: 0,
          zIndex: zIndex
        };
        elements.push(imageElement);
        return;
      }

      // Process text content
      const textContent = this.extractTextContent(element);
      if (textContent.trim()) {
        const rect = this.getElementBounds(element, offsetX, offsetY);
        const computedStyle = this.getComputedStyleFromElement(element);

        const textElement: TemplateElement = {
          id: elementIdCounter++,
          type: 'text',
          x: rect.x,
          y: rect.y,
          width: rect.width || 200,
          height: rect.height || 30,
          content: textContent,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          fontStyle: computedStyle.fontStyle,
          textDecoration: computedStyle.textDecoration,
          textAlign: computedStyle.textAlign,
          verticalAlign: computedStyle.verticalAlign,
          color: computedStyle.color,
          backgroundColor: computedStyle.backgroundColor,
          borderWidth: 0,
          borderColor: '#cccccc',
          borderStyle: 'solid',
          rotation: 0,
          zIndex: zIndex
        };
        elements.push(textElement);
      }

      // Recursively process child elements
      Array.from(element.children).forEach((child, index) => {
        if (child instanceof HTMLElement) {
          const childRect = this.getElementBounds(child, offsetX, offsetY);
          processTextElements(child, childRect.x, childRect.y, zIndex + index + 1);
        }
      });
    };

    // Process the container
    if (container) {
      processTextElements(container as HTMLElement);
    }

    this.elements = elements;
    this.emitTemplateChange();
  }

  private parseHtmlContent(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let container = doc.querySelector('div[style*="position: relative"]');

    if (!container) {
      //use the outermost div
      container = doc.body.children.length > 0 ? doc.body.children[0] as HTMLElement : doc.body;
    };

    const containerStyle = container.getAttribute('style') || '';
    const widthMatch = containerStyle.match(/width:\s*(\d+)px/);
    const heightMatch = containerStyle.match(/height:\s*(\d+)px/);

    if (widthMatch && heightMatch) {
      this.canvasWidth = parseInt(widthMatch[1]);
      this.canvasHeight = parseInt(heightMatch[1]);
    }

    const elements: TemplateElement[] = [];
    const children = Array.from(container.children);

    children.forEach((child, index) => {
      const element = this.parseElementFromHtml(child as HTMLElement, index);
      if (element) {
        elements.push(element);
      }
    });

    this.elements = elements;
    this.emitTemplateChange();
  }

  private extractTextContent(element: HTMLElement): string {
    // Get text content while preserving some structure
    let text = '';

    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const nodeText = node.textContent || '';
        // Clean up excessive whitespace but preserve meaningful spaces
        text += nodeText.replace(/\s+/g, ' ');
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.tagName === 'BR') {
          text += '\n';
        } else if (el.tagName === 'IMG') {
          // Skip images, they're handled separately
          continue;
        } else {
          // For other elements, get their text content
          const innerText = this.extractTextContent(el);
          if (innerText.trim()) {
            text += innerText;
          }
        }
      }
    }

    return text.trim();
  }

  private getElementBounds(element: HTMLElement, offsetX = 0, offsetY = 0) {
    const style = element.getAttribute('style') || '';
    const computedStyle = this.parseStyleString(style);

    // Start with default position
    let x = offsetX;
    let y = offsetY;
    let width = 200;
    let height = 30;

    // Parse positioning from inline styles
    if (computedStyle['position'] === 'absolute') {
      x = parseInt(computedStyle['left']) || x;
      y = parseInt(computedStyle['top']) || y;
    } else if (computedStyle['position'] === 'relative') {
      x += parseInt(computedStyle['left']) || 0;
      y += parseInt(computedStyle['top']) || 0;
    }

    // Parse dimensions
    if (computedStyle['width']) {
      width = parseInt(computedStyle['width']) || width;
    }
    if (computedStyle['height']) {
      height = parseInt(computedStyle['height']) || height;
    }

    // For table cells, estimate dimensions based on content
    if (element.tagName === 'TD') {
      const cellWidth = this.canvasWidth * (parseFloat(computedStyle['width']?.replace('%', '')) || 25) / 100;
      width = cellWidth;
      height = 88; // Based on your min-height

      // Calculate x position based on table structure
      const table = element.closest('table');
      if (table) {
        const row = element.closest('tr');
        if (row) {
          const cellIndex = Array.from(row.children).indexOf(element);
          const cells = Array.from(row.children) as HTMLElement[];

          x = 0;
          for (let i = 0; i < cellIndex; i++) {
            const cellStyle = cells[i].getAttribute('style') || '';
            const cellComputedStyle = this.parseStyleString(cellStyle);
            const cellWidthPercent = parseFloat(cellComputedStyle['width']?.replace('%', '')) || 25;
            x += this.canvasWidth * cellWidthPercent / 100;
          }

          // Estimate y position (you might need to adjust this based on your layout)
          y = offsetY + 200; // Adjust based on where tables appear in your template
        }
      }
    }

    // Handle paragraph positioning
    if (element.tagName === 'P') {
      // Estimate height for paragraphs
      height = Math.max(30, (element.textContent || '').split('\n').length * 20);

      // If it's inside a positioned div, inherit positioning
      const parentDiv = element.closest('div[style*="position"]') as HTMLElement;
      if (parentDiv && parentDiv !== element) {
        const parentStyle = parentDiv.getAttribute('style') || '';
        const parentComputedStyle = this.parseStyleString(parentStyle);

        if (parentComputedStyle['position'] === 'relative') {
          y += parseInt(parentComputedStyle['top']) || 0;
        }
      }
    }

    return { x, y, width, height };
  }

  private getComputedStyleFromElement(element: HTMLElement) {
    const style = element.getAttribute('style') || '';
    const computedStyle = this.parseStyleString(style);

    // Set defaults
    const result = {
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      verticalAlign: 'middle',
      color: '#000000',
      backgroundColor: 'transparent'
    };

    // Extract font properties
    if (computedStyle['fontSize']) {
      result.fontSize = parseInt(computedStyle['fontSize']) || 16;
    }

    if (computedStyle['fontWeight']) {
      result.fontWeight = computedStyle['fontWeight'];
    }

    if (computedStyle['fontStyle']) {
      result.fontStyle = computedStyle['fontStyle'];
    }

    if (computedStyle['textDecoration']) {
      result.textDecoration = computedStyle['textDecoration'];
    }

    if (computedStyle['textAlign']) {
      result.textAlign = computedStyle['textAlign'];
    }

    if (computedStyle['color']) {
      result.color = computedStyle['color'];
    }

    if (computedStyle['backgroundColor']) {
      result.backgroundColor = computedStyle['backgroundColor'];
    }

    // Check for bold/strong elements
    if (element.querySelector('strong, b') || element.tagName === 'STRONG' || element.tagName === 'B') {
      result.fontWeight = 'bold';
    }

    // Check for italic elements
    if (element.querySelector('em, i') || element.tagName === 'EM' || element.tagName === 'I') {
      result.fontStyle = 'italic';
    }

    // Check font family for monospace
    const fontFamily = computedStyle['fontFamily'] || '';
    if (fontFamily.includes('Courier') || fontFamily.includes('monospace')) {
      // You might want to handle monospace fonts differently
    }

    return result;
  }

  // Also add this helper method to better handle your template structure
  loadFromComplexHtml(html: string) {
    // Clean up the HTML first
    const cleanHtml = html
      .replace(/&nbsp;/g, ' ')  // Replace non-breaking spaces
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();

    this.parseComplexHtmlContent(cleanHtml);
  }
  loadFromSimpleHtml(html: string) {
    // Clean up the HTML first
    const cleanHtml = html
      .replace(/&nbsp;/g, ' ')  // Replace non-breaking spaces
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();

    this.parseHtmlContent(cleanHtml);
  }


  private parseElementFromHtml(element: HTMLElement, index: number): TemplateElement | null {
    const style = element.getAttribute('style') || '';
    const computedStyle = this.parseStyleString(style);

    const baseElement: Partial<TemplateElement> = {
      id: Date.now() + index,
      x: parseInt(computedStyle['left']) || 0,
      y: parseInt(computedStyle['top']) || 0,
      width: parseInt(computedStyle['width']) || 100,
      height: parseInt(computedStyle['height']) || 30,
      fontSize: parseInt(computedStyle['fontSize']) || 16,
      fontWeight: computedStyle['fontWeight'] || 'normal',
      fontStyle: computedStyle['fontStyle'] || 'normal',
      textDecoration: computedStyle['textDecoration'] || 'none',
      color: computedStyle['color'] || '#000000',
      backgroundColor: this.parseBackgroundColor(computedStyle['backgroundColor'] || computedStyle['background']),
      borderWidth: this.parseBorderWidth(computedStyle['border'] || computedStyle['borderWidth']),
      borderColor: this.parseBorderColor(computedStyle['border'] || computedStyle['borderColor']),
      borderStyle: this.parseBorderStyle(computedStyle['border'] || computedStyle['borderStyle']),
      rotation: 0,
      zIndex: parseInt(computedStyle['zIndex']) || index,
      textAlign: 'left',
      verticalAlign: 'middle'
    };

    if (element.tagName === 'IMG') {
      return {
        ...baseElement,
        type: 'image',
        content: element.getAttribute('src') || ''
      } as TemplateElement;
    } else if (element.tagName === 'DIV') {
      const textContent = element.textContent?.trim();
      const innerDiv = element.querySelector('div');

      if (textContent || innerDiv) {
        const textAlign = computedStyle['textAlign'] || 'left';
        return {
          ...baseElement,
          type: 'text',
          content: textContent || innerDiv?.textContent || 'Text',
          textAlign,
          verticalAlign: this.inferVerticalAlign(computedStyle['alignItems'])
        } as TemplateElement;
      } else {
        return {
          ...baseElement,
          type: 'rect',
          content: ''
        } as TemplateElement;
      }
    }

    return null;
  }

  private parseStyleString(styleString: string): Record<string, string> {
    const styles: Record<string, string> = {};
    styleString.split(';').forEach(style => {
      const [property, value] = style.split(':').map(s => s.trim());
      if (property && value) {
        const camelCase = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styles[camelCase] = value;
      }
    });
    return styles;
  }

  private inferVerticalAlign(alignItems?: string): string {
    switch (alignItems) {
      case 'flex-start': return 'top';
      case 'flex-end': return 'bottom';
      default: return 'middle';
    }
  }

  private loadTemplateData(data: TemplateData) {
    this.elements = data.elements;
    this.canvasWidth = data.canvasWidth;
    this.canvasHeight = data.canvasHeight;
    this.pageSize = data.pageSize || 'A4';
    this.orientation = data.orientation || 'portrait';
    const { width, height } = this.standardSizes[this.pageSize];
    this.pageHeight = height;
    this.pageWidth = width;

    if (data.settings) {
      this.gridSize = data.settings.gridSize;
      this.showGrid = data.settings.showGrid;
      this.snapToGrid = data.settings.snapToGrid;
    }
  }

  // getDimensionsDisplay(): string {
  //   const scale = 2.5;
  //   const realWidth = Math.round(this.canvasWidth / scale);
  //   const realHeight = Math.round(this.canvasHeight / scale);
  //   return `${realWidth}x${realHeight}mm`;
  // }

  getVerticalAlignment(align: string): string {
    switch (align) {
      case 'top': return 'flex-start';
      case 'bottom': return 'flex-end';
      default: return 'center';
    }
  }

  getHorizontalAlignment(align: string): string {
    switch (align) {
      case 'left': return 'flex-start';
      case 'right': return 'flex-end';
      default: return 'center';
    }
  }

  getImageSize(content: string): number {
    return Math.round(content.length * 0.75 / 1024);
  }

  private snapToGridFn(value: number): number {
    if (!this.snapToGrid) return value;
    return Math.round(value / this.gridSize) * this.gridSize;
  }

  setTool(tool: string) {
    this.tool = tool;
  }

  addElement(type: 'text' | 'rect' | 'image') {
    let x = 50;
    let y = 50;

    if (this.snapToGrid) {
      x = this.snapToGridFn(x);
      y = this.snapToGridFn(y);
    }

    // Set appropriate default fills based on element type
    let defaultFill = 'transparent';
    if (type === 'rect') {
      defaultFill = '#F3F4F6'; // Light gray for rectangles
    } else if (type === 'text') {
      defaultFill = 'transparent'; // Transparent for text by default
    } else if (type === 'image') {
      defaultFill = 'transparent'; // Transparent for images
    }

    const newElement: TemplateElement = {
      id: Date.now(),
      type,
      x,
      y,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 30 : 100,
      content: type === 'text' ? 'Sample Text' : '',
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      verticalAlign: 'middle',
      color: '#000000',
      backgroundColor: defaultFill,
      borderWidth: type === 'rect' ? 1 : 0,
      borderColor: '#000000',
      borderStyle: 'solid',
      rotation: 0,
      zIndex: this.elements.length
    };

    this.elements.push(newElement);
    this.selectedElement = newElement.id;
    this.alignmentGuides = { vertical: [], horizontal: [] };
    this.emitTemplateChange();
  }

  updateElement(id: number, updates: Partial<TemplateElement>) {
    const elementIndex = this.elements.findIndex(el => el.id === id);
    if (elementIndex !== -1) {
      const updatedElement = { ...this.elements[elementIndex], ...updates };

      if (this.snapToGrid && ('x' in updates || 'y' in updates)) {
        if ('x' in updates) updatedElement.x = this.snapToGridFn(updatedElement.x);
        if ('y' in updates) updatedElement.y = this.snapToGridFn(updatedElement.y);
      }

      this.elements[elementIndex] = updatedElement;
      this.emitTemplateChange();
    }
  }

  updateSelectedElement(updates: Partial<TemplateElement>) {
    if (this.selectedElement) {
      this.updateElement(this.selectedElement, updates);
    }
  }

  deleteElement() {
    if (this.selectedElement) {
      this.elements = this.elements.filter(el => el.id !== this.selectedElement);
      this.selectedElement = null;
      this.alignmentGuides = { vertical: [], horizontal: [] };

      // Normalize z-indexes after deletion to prevent gaps
      this.normalizeZIndexes();

      this.emitTemplateChange();
    }
  }

  duplicateElement() {
    if (this.selectedElement) {
      const elementToDuplicate = this.elements.find(el => el.id === this.selectedElement);
      if (elementToDuplicate) {
        let newX = elementToDuplicate.x + 20;
        let newY = elementToDuplicate.y + 20;

        if (this.snapToGrid) {
          newX = this.snapToGridFn(newX);
          newY = this.snapToGridFn(newY);
        }

        const newElement: TemplateElement = {
          ...elementToDuplicate,
          id: Date.now(),
          x: newX,
          y: newY,
          zIndex: this.getMaxZIndex() + 1 // Place duplicate on top
        };

        this.elements.push(newElement);
        this.selectedElement = newElement.id;
        this.alignmentGuides = { vertical: [], horizontal: [] };
        this.emitTemplateChange();
      }
    }
  }

  toggleTextStyle(property: keyof TemplateElement, activeValue: string, inactiveValue: string) {
    if (this.selectedEl) {
      const currentValue = this.selectedEl[property] as string;
      const newValue = currentValue === activeValue ? inactiveValue : activeValue;
      this.updateSelectedElement({ [property]: newValue } as Partial<TemplateElement>);
    }
  }

  onPageSizeChange() {
    //make sure this is a valid size
    if (!this.pageSize || !this.standardSizes[this.pageSize] || this.pageSize === 'Custom') {
      //if not, treat it as custom
      this.pageSize = 'Custom';
      return;
    }
    let { width, height } = this.standardSizes[this.pageSize];
    this.pageHeight = height;
    this.pageWidth = width;
    this.updateCanvasDimensions(this.pageWidth, this.pageHeight);
    this.emitTemplateChange();
  }

  onCustomPageSizeChange(width: string, height: string) {
    //make sure these are valid numbers
    if (!width || width.trim().length < 1 || Number.isNaN(this.parseFloat(width))) {
      this.notify.failNotification('Invalid width');
      return;
    }
    if (!height || height.trim().length < 1 || Number.isNaN(this.parseFloat(height))) {
      this.notify.failNotification('Invalid height');
      return;
    }
    this.pageHeight = this.parseFloat(height);
    this.pageWidth = this.parseFloat(width);
    this.updateCanvasDimensions(this.pageWidth, this.pageHeight);
    this.emitTemplateChange();
  }

  setOrientation(orientation: 'landscape' | 'portrait') {
    this.orientation = orientation;
    this.updateCanvasDimensions(this.pageWidth, this.pageHeight);
    this.emitTemplateChange();
  }

  handleMouseDown(event: MouseEvent, elementId: number) {
    event.stopPropagation();
    if (this.tool === 'select') {
      this.selectedElement = elementId;
      this.isDragging = true;
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      this.dragStart = {
        x: (event.clientX - rect.left) / this.zoomLevel,
        y: (event.clientY - rect.top) / this.zoomLevel
      };
    }
  }

  handleResizeMouseDown(event: MouseEvent, handle: string) {
    event.stopPropagation();
    this.isResizing = true;
    this.resizeHandle = handle;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.dragStart = {
      x: (event.clientX - rect.left) / this.zoomLevel,
      y: (event.clientY - rect.top) / this.zoomLevel
    };
  }

  handleMouseMove(event: MouseEvent) {
    if (this.tool !== 'select') return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const currentX = (event.clientX - rect.left) / this.zoomLevel;
    const currentY = (event.clientY - rect.top) / this.zoomLevel;

    if (this.isResizing && this.selectedElement && this.resizeHandle) {
      this.handleResize(currentX, currentY);
    } else if (this.isDragging && this.selectedElement) {
      this.handleDrag(currentX, currentY);
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
    setTimeout(() => {
      this.alignmentGuides = { vertical: [], horizontal: [] };
    }, 1000);
  }

  handleCanvasClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target === this.canvasRef.nativeElement || target.closest('svg')) {
      if (this.tool !== 'select') {
        this.createElementAtPosition(event);
      } else {
        this.selectedElement = null;
        this.alignmentGuides = { vertical: [], horizontal: [] };
      }
    }
  }

  private handleResize(currentX: number, currentY: number) {
    const element = this.elements.find(el => el.id === this.selectedElement);
    if (!element || !this.resizeHandle) return;

    const deltaX = currentX - this.dragStart.x;
    const deltaY = currentY - this.dragStart.y;

    let newX = element.x;
    let newY = element.y;
    let newWidth = element.width;
    let newHeight = element.height;

    switch (this.resizeHandle) {
      case 'nw':
        newX = element.x + deltaX;
        newY = element.y + deltaY;
        newWidth = element.width - deltaX;
        newHeight = element.height - deltaY;
        break;
      case 'ne':
        newY = element.y + deltaY;
        newWidth = element.width + deltaX;
        newHeight = element.height - deltaY;
        break;
      case 'sw':
        newX = element.x + deltaX;
        newWidth = element.width - deltaX;
        newHeight = element.height + deltaY;
        break;
      case 'se':
        newWidth = element.width + deltaX;
        newHeight = element.height + deltaY;
        break;
      case 'n':
        newY = element.y + deltaY;
        newHeight = element.height - deltaY;
        break;
      case 's':
        newHeight = element.height + deltaY;
        break;
      case 'w':
        newX = element.x + deltaX;
        newWidth = element.width - deltaX;
        break;
      case 'e':
        newWidth = element.width + deltaX;
        break;
    }

    const minSize = 10;
    if (newWidth < minSize) {
      if (this.resizeHandle.includes('w')) {
        newX = element.x + element.width - minSize;
      }
      newWidth = minSize;
    }
    if (newHeight < minSize) {
      if (this.resizeHandle.includes('n')) {
        newY = element.y + element.height - minSize;
      }
      newHeight = minSize;
    }

    newX = Math.max(0, newX);
    newY = Math.max(0, newY);
    newWidth = Math.min(newWidth, this.canvasWidth - newX);
    newHeight = Math.min(newHeight, this.canvasHeight - newY);

    if (this.snapToGrid) {
      newX = this.snapToGridFn(newX);
      newY = this.snapToGridFn(newY);
      newWidth = this.snapToGridFn(newWidth);
      newHeight = this.snapToGridFn(newHeight);
    }

    this.updateElement(this.selectedElement!, {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });

    this.dragStart = { x: currentX, y: currentY };
  }

  private handleDrag(currentX: number, currentY: number) {
    const element = this.elements.find(el => el.id === this.selectedElement);
    if (!element) return;

    const deltaX = currentX - this.dragStart.x;
    const deltaY = currentY - this.dragStart.y;

    let newX = Math.max(0, Math.min(this.canvasWidth - element.width, element.x + deltaX));
    let newY = Math.max(0, Math.min(this.canvasHeight - element.height, element.y + deltaY));

    const tempElement = { ...element, x: newX, y: newY };
    const guides = this.calculateAlignmentGuides(tempElement);

    const snapped = this.snapToGuides(tempElement, guides);
    newX = snapped.x;
    newY = snapped.y;

    if (this.snapToGrid) {
      newX = this.snapToGridFn(newX);
      newY = this.snapToGridFn(newY);
    }

    this.updateElement(this.selectedElement!, { x: newX, y: newY });
    this.alignmentGuides = guides;
    this.dragStart = { x: currentX, y: currentY };
  }

  private createElementAtPosition(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    let x = (event.clientX - rect.left) / this.zoomLevel;
    let y = (event.clientY - rect.top) / this.zoomLevel;

    if (this.snapToGrid) {
      x = this.snapToGridFn(x - 50) + 50;
      y = this.snapToGridFn(y - 25) + 25;
    }

    x = Math.max(0, Math.min(this.canvasWidth - 100, x - 50));
    y = Math.max(0, Math.min(this.canvasHeight - 50, y - 25));

    const newElement: TemplateElement = {
      id: Date.now(),
      type: this.tool as 'text' | 'rect' | 'image',
      x,
      y,
      width: this.tool === 'text' ? 200 : 100,
      height: this.tool === 'text' ? 30 : 100,
      content: this.tool === 'text' ? 'New Text' : '',
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      verticalAlign: 'middle',
      color: '#000000',
      backgroundColor: this.tool === 'rect' ? '#f0f0f0' : 'transparent',
      borderWidth: 1,
      borderColor: '#cccccc',
      borderStyle: 'solid',
      rotation: 0,
      zIndex: this.elements.length
    };

    this.elements.push(newElement);
    this.selectedElement = newElement.id;
    this.tool = 'select';
    this.alignmentGuides = { vertical: [], horizontal: [] };
    this.emitTemplateChange();
  }

  private calculateAlignmentGuides(currentElement: TemplateElement): { vertical: AlignmentGuide[], horizontal: AlignmentGuide[] } {
    if (!currentElement) return { vertical: [], horizontal: [] };

    const guides: { vertical: AlignmentGuide[], horizontal: AlignmentGuide[] } = { vertical: [], horizontal: [] };
    const currentCenterX = currentElement.x + currentElement.width / 2;
    const currentCenterY = currentElement.y + currentElement.height / 2;
    const canvasCenterX = this.canvasWidth / 2;
    const canvasCenterY = this.canvasHeight / 2;
    const snapThreshold = 5;

    if (Math.abs(currentCenterX - canvasCenterX) < snapThreshold) {
      guides.vertical.push({
        x: canvasCenterX,
        type: 'canvas-center',
        label: 'Center'
      });
    }
    if (Math.abs(currentCenterY - canvasCenterY) < snapThreshold) {
      guides.horizontal.push({
        y: canvasCenterY,
        type: 'canvas-center',
        label: 'Center'
      });
    }

    this.elements.forEach(element => {
      if (element.id === currentElement.id) return;

      const elementCenterX = element.x + element.width / 2;
      const elementCenterY = element.y + element.height / 2;
      const elementRight = element.x + element.width;
      const elementBottom = element.y + element.height;

      if (Math.abs(currentElement.x - element.x) < snapThreshold) {
        guides.vertical.push({ x: element.x, type: 'element-left' });
      }
      if (Math.abs(currentElement.x + currentElement.width - elementRight) < snapThreshold) {
        guides.vertical.push({ x: elementRight, type: 'element-right' });
      }
      if (Math.abs(currentCenterX - elementCenterX) < snapThreshold) {
        guides.vertical.push({ x: elementCenterX, type: 'element-center' });
      }

      if (Math.abs(currentElement.y - element.y) < snapThreshold) {
        guides.horizontal.push({ y: element.y, type: 'element-top' });
      }
      if (Math.abs(currentElement.y + currentElement.height - elementBottom) < snapThreshold) {
        guides.horizontal.push({ y: elementBottom, type: 'element-bottom' });
      }
      if (Math.abs(currentCenterY - elementCenterY) < snapThreshold) {
        guides.horizontal.push({ y: elementCenterY, type: 'element-center' });
      }
    });

    return guides;
  }

  private snapToGuides(element: TemplateElement, guides: { vertical: AlignmentGuide[], horizontal: AlignmentGuide[] }): { x: number, y: number } {
    let snappedX = element.x;
    let snappedY = element.y;
    const snapThreshold = 5;

    guides.vertical.forEach(guide => {
      const elementCenterX = element.x + element.width / 2;
      if (guide.type === 'canvas-center' || guide.type === 'element-center') {
        if (Math.abs(elementCenterX - guide.x!) < snapThreshold) {
          snappedX = guide.x! - element.width / 2;
        }
      } else if (guide.type === 'element-left') {
        if (Math.abs(element.x - guide.x!) < snapThreshold) {
          snappedX = guide.x!;
        }
      } else if (guide.type === 'element-right') {
        if (Math.abs(element.x + element.width - guide.x!) < snapThreshold) {
          snappedX = guide.x! - element.width;
        }
      }
    });

    guides.horizontal.forEach(guide => {
      const elementCenterY = element.y + element.height / 2;
      if (guide.type === 'canvas-center' || guide.type === 'element-center') {
        if (Math.abs(elementCenterY - guide.y!) < snapThreshold) {
          snappedY = guide.y! - element.height / 2;
        }
      } else if (guide.type === 'element-top') {
        if (Math.abs(element.y - guide.y!) < snapThreshold) {
          snappedY = guide.y!;
        }
      } else if (guide.type === 'element-bottom') {
        if (Math.abs(element.y + element.height - guide.y!) < snapThreshold) {
          snappedY = guide.y! - element.height;
        }
      }
    });

    return { x: snappedX, y: snappedY };
  }

  triggerImageUpload() {
    if (this.selectedEl) {
      this.uploadingImage = this.selectedEl.id;
      this.fileInputRef.nativeElement.click();
    }
  }

  handleFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && this.uploadingImage) {
      this.handleImageUpload(this.uploadingImage, file);
    }
    target.value = '';
  }

  private handleImageUpload(elementId: number, file: File) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file is too large. Please select an image under 10MB.');
      return;
    }

    this.uploadingImage = elementId;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      this.updateElement(elementId, { content: base64Data });
      this.uploadingImage = null;
    };

    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      this.uploadingImage = null;
    };

    reader.readAsDataURL(file);
  }

  // Keyboard shortcuts for layer management
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const activeElement = document.activeElement;
    const isEditingText = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      (activeElement as HTMLElement).contentEditable === 'true'
    );

    if (isEditingText) return;

    // Print shortcut (Ctrl+P)
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      this.printTemplate();
      event.preventDefault();
      return;
    }

    // Zoom shortcuts (work globally, not just when element is selected)
    if (event.key === '+' || event.key === '=') {
      this.zoomIn();
      event.preventDefault();
      return;
    }
    if (event.key === '-' || event.key === '_') {
      this.zoomOut();
      event.preventDefault();
      return;
    }
    if (event.key === '0') {
      this.resetZoom();
      event.preventDefault();
      return;
    }
    if (event.key === 'f' || event.key === 'F') {
      this.fitToScreen();
      event.preventDefault();
      return;
    }

    if (!this.selectedElement) return;

    const element = this.elements.find(el => el.id === this.selectedElement);
    if (!element) return;

    // Handle layer shortcuts with Ctrl/Cmd
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case ']':
          this.bringForward();
          event.preventDefault();
          return;
        case '[':
          this.sendBackward();
          event.preventDefault();
          return;
        case 'ArrowUp':
          this.bringToFront();
          event.preventDefault();
          return;
        case 'ArrowDown':
          this.sendToBack();
          event.preventDefault();
          return;
      }
    }

    // Existing keyboard movement code
    let step = this.keyboardStep;
    if (event.shiftKey) {
      step = this.gridSize;
    } else if (event.ctrlKey || event.metaKey) {
      step = 0.5;
    }

    let newX = element.x;
    let newY = element.y;
    let shouldUpdate = false;

    switch (event.key) {
      case 'ArrowLeft':
        newX = Math.max(0, element.x - step);
        shouldUpdate = true;
        break;
      case 'ArrowRight':
        newX = Math.min(this.canvasWidth - element.width, element.x + step);
        shouldUpdate = true;
        break;
      case 'ArrowUp':
        newY = Math.max(0, element.y - step);
        shouldUpdate = true;
        break;
      case 'ArrowDown':
        newY = Math.min(this.canvasHeight - element.height, element.y + step);
        shouldUpdate = true;
        break;
      case 'Delete':
      case 'Backspace':
        this.deleteElement();
        shouldUpdate = false;
        break;
      case 'Escape':
        this.selectedElement = null;
        this.alignmentGuides = { vertical: [], horizontal: [] };
        shouldUpdate = false;
        break;
      default:
        return;
    }

    if (shouldUpdate) {
      event.preventDefault();

      if (this.snapToGrid) {
        newX = this.snapToGridFn(newX);
        newY = this.snapToGridFn(newY);
      }
      if (this.selectedElement) {
        this.updateElement(this.selectedElement, { x: newX, y: newY });
      }
      const tempElement = { ...element, x: newX, y: newY };
      const guides = this.calculateAlignmentGuides(tempElement);
      this.alignmentGuides = guides;

      setTimeout(() => {
        this.alignmentGuides = { vertical: [], horizontal: [] };
      }, 500);
    }
  }

  exportTemplate() {
    const templateData: TemplateData = {
      elements: this.elements,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      pageSize: this.pageSize,
      orientation: this.orientation,
      settings: {
        gridSize: this.gridSize,
        showGrid: this.showGrid,
        snapToGrid: this.snapToGrid
      }
    };


    const html = this.generateHTML();

    this.templateChange.emit(templateData);
    this.htmlExport.emit(html);
  }

  //   generateHTML(): string {
  //     const sortedElements = [...this.elements].sort((a, b) => a.zIndex - b.zIndex);

  //     const elementsHTML = sortedElements.map(el => {
  //       const styles = {
  //         position: 'absolute',
  //         left: `${el.x}px`,
  //         top: `${el.y}px`,
  //         width: `${el.width}px`,
  //         height: `${el.height}px`,
  //         fontSize: `${el.fontSize}px`,
  //         fontWeight: el.fontWeight,
  //         fontStyle: el.fontStyle,
  //         textDecoration: el.textDecoration,
  //         textAlign: el.textAlign,
  //         color: el.color,
  //         backgroundColor: el.backgroundColor,
  //         border: el.borderWidth > 0 ? `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}` : 'none',
  //         transform: `rotate(${el.rotation}deg)`,
  //         zIndex: el.zIndex.toString()
  //       };

  //       const styleString = Object.entries(styles)
  //         .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
  //         .join('; ');

  //       if (el.type === 'text') {
  //         const flexAlign = el.verticalAlign === 'top' ? 'flex-start' :
  //           el.verticalAlign === 'middle' ? 'center' : 'flex-end';
  //         const justifyContent = el.textAlign === 'left' ? 'flex-start' :
  //           el.textAlign === 'center' ? 'center' : 'flex-end';

  //         return `<div style="${styleString}display: flex; align-items: ${flexAlign}; justify-content: ${justifyContent}; padding: 4px;">
  // <div style="width: 100%; text-align: ${el.textAlign};">${el.content}</div>
  // </div>`;
  //       } else if (el.type === 'rect') {
  //         return `<div style="${styleString}"></div>`;
  //       } else if (el.type === 'image') {
  //         return `<img src="${el.content || 'placeholder.jpg'}" style="${styleString}" alt="Template Image" />`;
  //       }
  //       return '';
  //     }).join('\n');

  //     return `<div style="position: relative; width: ${this.canvasWidth}px; height: ${this.canvasHeight}px; margin: 0 auto; background: white;">
  // ${elementsHTML}
  // </div>`;
  //   }

  generateHTML(): string {
    const sortedElements = [...this.elements].sort((a, b) => a.zIndex - b.zIndex);

    // Get actual page dimensions for print
    const actualPageWidth = this.orientation === 'portrait' ? this.pageWidth : this.pageHeight;
    const actualPageHeight = this.orientation === 'portrait' ? this.pageHeight : this.pageWidth;

    const elementsHTML = sortedElements.map(el => {
      const styles = {
        position: 'absolute',
        left: `${el.x}px`,
        top: `${el.y}px`,
        width: `${el.width}px`,
        height: `${el.height}px`,
        fontSize: `${el.fontSize}px`,
        fontWeight: el.fontWeight,
        fontStyle: el.fontStyle,
        textDecoration: el.textDecoration,
        textAlign: el.textAlign,
        color: el.color,
        backgroundColor: el.backgroundColor,
        border: el.borderWidth > 0 ? `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}` : 'none',
        transform: `rotate(${el.rotation}deg)`,
        zIndex: el.zIndex.toString(),
        boxSizing: 'border-box'
      };

      const styleString = Object.entries(styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');

      if (el.type === 'text') {
        const flexAlign = el.verticalAlign === 'top' ? 'flex-start' :
          el.verticalAlign === 'middle' ? 'center' : 'flex-end';
        const justifyContent = el.textAlign === 'left' ? 'flex-start' :
          el.textAlign === 'center' ? 'center' : 'flex-end';

        return `<div style="${styleString} display: flex; align-items: ${flexAlign}; justify-content: ${justifyContent}; padding: 4px;">
<div style="width: 100%; text-align: ${el.textAlign};">${el.content}</div>
</div>`;
      } else if (el.type === 'rect') {
        return `<div style="${styleString}"></div>`;
      } else if (el.type === 'image') {
        return `<img src="${el.content || 'placeholder.jpg'}" style="${styleString}" alt="Template Image" />`;
      }
      return '';
    }).join('\n');

    // Calculate the scale factor to convert from canvas pixels to actual print size
    // const scaleFactor = 25.4 / this.printDPI; // Convert back to actual mm size

    // Container inline styles for print compatibility
    const containerStyles = [
      'position: relative',
      'background: white',
      `width: ${this.canvasWidth}px`,
      `height: ${this.canvasHeight}px`,
      'margin: 0 auto',
      'box-sizing: border-box',
      'page-break-inside: avoid',
      // Print-specific styles using CSS custom properties for media queries won't work inline

    ].join('; ');

    return `<div style="${containerStyles}" data-page-width="${actualPageWidth}" data-page-height="${actualPageHeight}" data-orientation="${this.orientation}" class="template-page">
${elementsHTML}
</div>`;
  }

  // Helper method to get the scaling factor for print
  private getPrintScaleFactor(): number {
    // This scales the pixel-based design to millimeters for print
    return 25.4 / this.printDPI; // Convert from print DPI back to actual size
  }

  // Updated display methods
  getDimensionsDisplay(): string {
    const actualWidth = this.orientation === 'portrait' ? this.pageWidth : this.pageHeight;
    const actualHeight = this.orientation === 'portrait' ? this.pageHeight : this.pageWidth;
    return `${actualWidth}x${actualHeight}mm`;
  }

  getCanvasInfo(): string {
    const actualWidth = this.orientation === 'portrait' ? this.pageWidth : this.pageHeight;
    const actualHeight = this.orientation === 'portrait' ? this.pageHeight : this.pageWidth;
    return `${this.canvasWidth}x${this.canvasHeight}px → ${actualWidth}x${actualHeight}mm print`;
  }

  loadTemplate(data: TemplateData) {
    this.loadTemplateData(data);
    this.emitTemplateChange();
  }

  loadFromHtml(html: string) {
    this.parseHtmlContent(html);
  }


  // Update the border property handling in updateSelectedElement
  updateSelectedElementBorder(borderProperty: 'borderWidth' | 'borderColor' | 'borderStyle', value: any) {
    console.log('borderProperty:', borderProperty, 'value:', value);
    if (this.selectedEl) {
      this.updateSelectedElement({ [borderProperty]: value });
    }
  }

  // Helper method to get border style options
  getBorderStyleOptions(): Array<{ value: string, label: string }> {
    return [
      { value: 'none', label: 'None' },
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'dotted', label: 'Dotted' },
      { value: 'double', label: 'Double' },
      { value: 'groove', label: 'Groove' },
      { value: 'ridge', label: 'Ridge' },
      { value: 'inset', label: 'Inset' },
      { value: 'outset', label: 'Outset' }
    ];
  }

  // Helper method to get border width presets
  getBorderWidthOptions(): Array<{ value: number, label: string }> {
    return [
      { value: 0, label: 'None' },
      { value: 1, label: 'Thin (1px)' },
      { value: 2, label: 'Medium (2px)' },
      { value: 3, label: 'Thick (3px)' },
      { value: 4, label: 'Extra Thick (4px)' },
      { value: 5, label: 'Heavy (5px)' }
    ];
  }

  // Helper method for border preview
  getBorderPreview(element: TemplateElement): string {
    if (element.borderWidth === 0 || element.borderStyle === 'none') {
      return 'No Border';
    }
    return `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`;
  }

  // Helper methods for parsing border properties
  private parseBorderWidth(borderValue: string): number {
    if (!borderValue) return 0;

    // Handle shorthand border property (e.g., "1px solid black")
    if (borderValue.includes('px')) {
      const match = borderValue.match(/(\d+)px/);
      return match ? parseInt(match[1]) : 1;
    }

    // Handle named widths
    switch (borderValue.toLowerCase()) {
      case 'thin': return 1;
      case 'medium': return 2;
      case 'thick': return 3;
      default: return 1;
    }
  }

  private parseBorderColor(borderValue: string): string {
    if (!borderValue) return '#000000';

    // Handle shorthand border property
    const colorMatch = borderValue.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)|[a-zA-Z]+/);
    if (colorMatch) {
      return this.normalizeColor(colorMatch[0]);
    }

    return '#000000';
  }

  private parseBorderStyle(borderValue: string): string {
    if (!borderValue) return 'solid';

    const styles = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];
    for (const style of styles) {
      if (borderValue.toLowerCase().includes(style)) {
        return style;
      }
    }

    return 'solid';
  }

  private normalizeColor(color: string): string {
    // Convert named colors to hex
    const namedColors: Record<string, string> = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'green': '#008000',
      'blue': '#0000FF',
      'gray': '#808080',
      'grey': '#808080'
    };

    const lowerColor = color.toLowerCase();
    if (namedColors[lowerColor]) {
      return namedColors[lowerColor];
    }

    // If it's already a valid hex or rgb, return as is
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return color;
    }

    return '#000000';
  }

  // Helper method to get fill color presets
  getFillColorPresets(): Array<{ color: string, label: string }> {
    return [
      { color: 'transparent', label: 'Transparent' },
      { color: '#FFFFFF', label: 'White' },
      { color: '#000000', label: 'Black' },
      { color: '#F3F4F6', label: 'Light Gray' },
      { color: '#6B7280', label: 'Gray' },
      { color: '#1F2937', label: 'Dark Gray' },
      { color: '#EF4444', label: 'Red' },
      { color: '#10B981', label: 'Green' },
      { color: '#3B82F6', label: 'Blue' },
      { color: '#F59E0B', label: 'Yellow' },
      { color: '#8B5CF6', label: 'Purple' },
      { color: '#F97316', label: 'Orange' }
    ];
  }

  // Helper method to check if color is transparent
  isTransparentColor(color: string): boolean {
    return color === 'transparent' ||
      color === 'rgba(0,0,0,0)' ||
      color === 'rgba(0, 0, 0, 0)' ||
      color === '';
  }

  // Helper method to get color opacity
  getColorOpacity(color: string): number {
    if (this.isTransparentColor(color)) return 0;

    // Parse rgba values
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      return rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
    }

    return 1;
  }

  // Helper method to convert color to rgba with opacity
  convertToRgba(color: string, opacity: number): string {
    if (color === 'transparent' && opacity === 0) return 'transparent';

    // Convert hex to rgba
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // If already rgba, update opacity
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const r = rgbaMatch[1];
      const g = rgbaMatch[2];
      const b = rgbaMatch[3];
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Return as is for named colors
    return color;
  }

  // Update fill color with opacity support
  updateFillColor(color: string, opacity?: number) {
    if (this.selectedEl) {
      if (opacity !== undefined) {
        const rgbaColor = this.convertToRgba(color, opacity);
        this.updateSelectedElement({ backgroundColor: rgbaColor });
      } else {
        this.updateSelectedElement({ backgroundColor: color });
      }
    }
  }

  // Set transparent fill
  setTransparentFill() {
    if (this.selectedEl) {
      this.updateSelectedElement({ backgroundColor: 'transparent' });
    }
  }

  // Get fill color for display (without opacity)
  getBaseFillColor(): string {
    if (!this.selectedEl) return '#FFFFFF';

    const color = this.selectedEl.backgroundColor;
    if (this.isTransparentColor(color)) return '#FFFFFF';

    // Convert rgba to hex for color picker
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    return color;
  }

  // Get current opacity
  getCurrentOpacity(): number {
    if (!this.selectedEl) return 1;
    return this.getColorOpacity(this.selectedEl.backgroundColor);
  }

  // Helper method to get fill preview text
  getFillPreview(): string {
    if (!this.selectedEl) return 'No Fill';

    const color = this.selectedEl.backgroundColor;
    if (this.isTransparentColor(color)) {
      return 'Transparent';
    }

    const opacity = this.getColorOpacity(color);
    if (opacity < 1) {
      return `${color} (${Math.round(opacity * 100)}% opacity)`;
    }

    return color;
  }

  private parseBackgroundColor(bgValue: string): string {
    if (!bgValue || bgValue === 'none' || bgValue === 'initial' || bgValue === 'inherit') {
      return 'transparent';
    }

    // Handle transparent values
    if (bgValue === 'transparent' || bgValue === 'rgba(0,0,0,0)') {
      return 'transparent';
    }

    // Handle rgba/rgb values
    if (bgValue.startsWith('rgb')) {
      return bgValue;
    }

    // Handle hex values
    if (bgValue.startsWith('#')) {
      return bgValue;
    }

    // Handle named colors
    return this.normalizeColor(bgValue);
  }

  // Get all elements sorted by z-index for display
  getElementsByZIndex(): TemplateElement[] {
    return [...this.elements].sort((a, b) => a.zIndex - b.zIndex);
  }

  // Get the maximum z-index in use
  getMaxZIndex(): number {
    return this.elements.length > 0 ? Math.max(...this.elements.map(el => el.zIndex)) : 0;
  }

  // Get the minimum z-index in use
  getMinZIndex(): number {
    return this.elements.length > 0 ? Math.min(...this.elements.map(el => el.zIndex)) : 0;
  }

  // Move element to front (highest z-index)
  bringToFront() {
    if (this.selectedElement) {
      const maxZ = this.getMaxZIndex();
      this.updateElement(this.selectedElement, { zIndex: maxZ + 1 });
    }
  }

  // Move element to back (lowest z-index)
  sendToBack() {
    if (this.selectedElement) {
      const minZ = this.getMinZIndex();
      this.updateElement(this.selectedElement, { zIndex: minZ - 1 });
    }
  }

  // Move element forward one layer
  bringForward() {
    if (this.selectedElement) {
      const currentElement = this.elements.find(el => el.id === this.selectedElement);
      if (!currentElement) return;

      // Find the element directly in front of this one
      const elementsAbove = this.elements
        .filter(el => el.zIndex > currentElement.zIndex)
        .sort((a, b) => a.zIndex - b.zIndex);

      if (elementsAbove.length > 0) {
        const nextElement = elementsAbove[0];
        // Swap z-index values
        this.updateElement(this.selectedElement, { zIndex: nextElement.zIndex });
        this.updateElement(nextElement.id, { zIndex: currentElement.zIndex });
      }
    }
  }

  // Move element backward one layer
  sendBackward() {
    if (this.selectedElement) {
      const currentElement = this.elements.find(el => el.id === this.selectedElement);
      if (!currentElement) return;

      // Find the element directly behind this one
      const elementsBelow = this.elements
        .filter(el => el.zIndex < currentElement.zIndex)
        .sort((a, b) => b.zIndex - a.zIndex);

      if (elementsBelow.length > 0) {
        const prevElement = elementsBelow[0];
        // Swap z-index values
        this.updateElement(this.selectedElement, { zIndex: prevElement.zIndex });
        this.updateElement(prevElement.id, { zIndex: currentElement.zIndex });
      }
    }
  }

  // Set specific z-index
  setZIndex(zIndex: number) {
    if (this.selectedElement) {
      this.updateElement(this.selectedElement, { zIndex });
    }
  }

  // Get element's position in layer order (1-based)
  getElementLayerPosition(elementId: number): number {
    const sortedElements = this.getElementsByZIndex();
    return sortedElements.findIndex(el => el.id === elementId) + 1;
  }

  // Get total number of layers
  getTotalLayers(): number {
    return this.elements.length;
  }

  // Normalize z-indexes to prevent gaps and ensure proper ordering
  normalizeZIndexes() {
    const sortedElements = this.getElementsByZIndex();
    sortedElements.forEach((element, index) => {
      this.updateElement(element.id, { zIndex: index });
    });
  }

  // Move to specific layer position (1-based)
  moveToLayer(position: number) {
    if (!this.selectedElement || position < 1 || position > this.elements.length) return;

    const currentElement = this.elements.find(el => el.id === this.selectedElement);
    if (!currentElement) return;

    // Get all other elements sorted by z-index
    const otherElements = this.elements
      .filter(el => el.id !== this.selectedElement)
      .sort((a, b) => a.zIndex - b.zIndex);

    // Insert current element at the desired position
    const newOrder: TemplateElement[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      if (i === position - 1) {
        newOrder.push(currentElement);
      } else {
        const otherIndex = i < position - 1 ? i : i - 1;
        if (otherElements[otherIndex]) {
          newOrder.push(otherElements[otherIndex]);
        }
      }
    }

    // Update z-indexes based on new order
    newOrder.forEach((element, index) => {
      this.updateElement(element.id, { zIndex: index });
    });
  }

  // Get layer information for display
  getLayerInfo(): Array<{ element: TemplateElement, position: number, isSelected: boolean }> {
    const sortedElements = this.getElementsByZIndex();
    return sortedElements.map((element, index) => ({
      element,
      position: index + 1,
      isSelected: this.selectedElement === element.id
    })).reverse(); // Reverse to show front elements first
  }

  // Select element by clicking in layer panel
  selectElementFromLayer(elementId: number) {
    this.selectedElement = elementId;
    this.alignmentGuides = { vertical: [], horizontal: [] };
  }

  canMoveUp(): boolean {
    if (!this.selectedElement) return false;
    const currentElement = this.elements.find(el => el.id === this.selectedElement);
    if (!currentElement) return false;
    return currentElement.zIndex < this.getMaxZIndex();
  }

  canMoveDown(): boolean {
    if (!this.selectedElement) return false;
    const currentElement = this.elements.find(el => el.id === this.selectedElement);
    if (!currentElement) return false;
    return currentElement.zIndex > this.getMinZIndex();
  }


  // Get element display name for layer panel
  getElementDisplayName(element: TemplateElement): string {
    switch (element.type) {
      case 'text':
        const content = element.content.length > 20
          ? element.content.substring(0, 20) + '...'
          : element.content;
        return content || 'Text Element';
      case 'rect':
        return 'Rectangle';
      case 'image':
        return element.content ? 'Image' : 'Empty Image';
      default:
        return 'Element';
    }
  }

  getTemplateData(): TemplateData {
    return {
      elements: this.elements,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      pageSize: this.pageSize,
      orientation: this.orientation,
      settings: {
        gridSize: this.gridSize,
        showGrid: this.showGrid,
        snapToGrid: this.snapToGrid
      }
    };
  }

  getHtml(): string {
    return this.generateHTML();
  }

  private emitTemplateChange() {
    this.templateChange.emit(this.getTemplateData());
    this.htmlExport.emit(this.getHtml());
  }

  // Zoom methods
  zoomIn() {
    const newZoom = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
    this.setZoomLevel(newZoom);
  }

  zoomOut() {
    const newZoom = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
    this.setZoomLevel(newZoom);
  }

  resetZoom() {
    this.setZoomLevel(1);
  }

  fitToScreen() {
    if (!this.canvasRef) return;

    // Get the wrapper div (parent of canvas)
    const wrapper = this.canvasRef.nativeElement.parentElement;
    if (!wrapper) return;

    // Get the scrollable container (parent of wrapper)
    const container = wrapper.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth - 64; // Subtract padding
    const containerHeight = container.clientHeight - 64;

    const scaleX = containerWidth / this.canvasWidth;
    const scaleY = containerHeight / this.canvasHeight;

    const optimalZoom = Math.min(scaleX, scaleY, this.maxZoom);
    this.setZoomLevel(Math.max(optimalZoom, this.minZoom));
  }

  setZoomLevel(level: number) {
    this.zoomLevel = Math.max(this.minZoom, Math.min(level, this.maxZoom));
  }

  getZoomPercentage(): number {
    return Math.round(this.zoomLevel * 100);
  }

  // Print functionality
  printTemplate() {
    // Create a temporary container for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.notify.failNotification('Please allow popups to print the template');
      return;
    }

    // Get actual page dimensions
    const actualPageWidth = this.orientation === 'portrait' ? this.pageWidth : this.pageHeight;
    const actualPageHeight = this.orientation === 'portrait' ? this.pageHeight : this.pageWidth;

    // Generate the HTML content
    const htmlContent = this.generateHTML();

    // Create print styles
    const printStyles = `
      <style>
        @page {
          size: ${actualPageWidth}mm ${actualPageHeight}mm;
          margin: 0;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: white;
        }

        .template-page {
          width: ${this.canvasWidth}px;
          height: ${this.canvasHeight}px;
          position: relative;
          background: white;
          page-break-inside: avoid;
        }

        @media print {
          body {
            margin: 0;
            padding: 0;
          }

          .template-page {
            width: ${this.canvasWidth}px !important;
            height: ${this.canvasHeight}px !important;
          }
        }
      </style>
    `;

    // Build the complete HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Print Template</title>
          ${printStyles}
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Write to the print window
    printWindow.document.write(fullHtml);
    printWindow.document.close();

    // Wait for images to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing (user can cancel)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 250);
    };
  }
}
