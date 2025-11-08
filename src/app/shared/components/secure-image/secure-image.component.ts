import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SecureImageService } from 'src/app/core/services/secure-image/secure-image.service';

@Component({
  selector: 'app-secure-image',
  templateUrl: './secure-image.component.html',
  styleUrls: ['./secure-image.component.scss']
})
export class SecureImageComponent implements OnInit, OnDestroy {
  @Input() imageType: string | null = null;  // e.g., 'practitioners_images', 'applications', 'payments'
  @Input() filename: string | null = null;   // e.g., '1762017079_f95807b21b7ffe5dc134.jpg'
  @Input() alt: string = 'Image';
  @Input() cssClass: string = '';
  @Input() width?: string;
  @Input() height?: string;
  @Input() fallbackImage?: string; // Optional fallback image on error

  imageUrl: string | null = null;
  loading: boolean = true;
  error: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private secureImageService: SecureImageService) { }

  ngOnInit(): void {
    if (!this.imageType) {
      //check if the filename is a path. if it is, then the last part of the path is the filename and last but one is the imageType
      //http://localhost:8080/file-server/image-render/applications/1762017079_f95807b21b7ffe5dc134.jpg
      const parts: string[] | undefined = this.filename?.split('/');
      if (parts && parts.length > 2) {
        this.imageType = parts[parts.length - 2];
        this.filename = parts[parts.length - 1];
      }
      if (!this.imageType || !this.filename) {
        console.error('SecureImageComponent: imageType and filename are required');
        this.error = true;
        this.loading = false;
        return;
      }
    }

    this.loadImage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadImage(): void {
    this.secureImageService.getSignedUrl(this.imageType!, this.filename!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (url) => {
          if (url) {
            this.imageUrl = url;
            this.error = false;
          } else {
            this.error = true;
            this.imageUrl = this.fallbackImage || null;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading secure image:', err);
          this.error = true;
          this.imageUrl = this.fallbackImage || null;
          this.loading = false;
        }
      });
  }

  onImageError(): void {
    this.error = true;
    if (this.fallbackImage) {
      this.imageUrl = this.fallbackImage;
    }
  }

}
