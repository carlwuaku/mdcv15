import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isImage',
  pure: true
})
export class IsImagePipe implements PipeTransform {
  transform(content: string | null): boolean {
    // Check if the content is an image URL or a base64-encoded image
    if (typeof content !== 'string' || !content) {
      return false;
    }

    // Check for base64 images
    if (content.startsWith('data:image/')) {
      return true;
    }

    // Check for image URLs
    const isLink = content.startsWith('http') || content.startsWith('www');
    const hasImageExtension = content.endsWith('.png') ||
                              content.endsWith('.jpg') ||
                              content.endsWith('.jpeg');

    return isLink && hasImageExtension;
  }
}
