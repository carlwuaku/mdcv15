import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaLibraryService, MediaItem } from '../../services/media-library.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

export interface MediaSelectorConfig {
  title?: string;
  allowedTypes?: string[]; // e.g., ['image/jpeg', 'image/png']
  multiple?: boolean;
}

@Component({
  selector: 'app-media-selector',
  templateUrl: './media-selector.component.html',
  styleUrls: ['./media-selector.component.scss']
})
export class MediaSelectorComponent implements OnInit {
  mediaItems: MediaItem[] = [];
  filteredItems: MediaItem[] = [];
  selectedItems: MediaItem[] = [];
  loading = false;
  searchText = '';
  fileTypeFilter = '';
  uploading = false;

  // Pagination
  limit = 50;
  offset = 0;
  total = 0;

  constructor(
    public dialogRef: MatDialogRef<MediaSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public config: MediaSelectorConfig,
    private mediaService: MediaLibraryService,
    private notify: NotifyService
  ) {
    // Set defaults
    if (!this.config) {
      this.config = {};
    }
    if (!this.config.title) {
      this.config.title = 'Select Media';
    }
    if (this.config.multiple === undefined) {
      this.config.multiple = false;
    }
  }

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading = true;
    this.mediaService.getMediaItems({
      limit: this.limit,
      offset: this.offset,
      search: this.searchText || undefined,
      file_type: this.fileTypeFilter || undefined
    }).subscribe({
      next: (response) => {
        this.mediaItems = response.data;
        this.filteredItems = this.filterByAllowedTypes(response.data);
        this.total = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.notify.failNotification('Failed to load media items');
        console.error('Failed to load media:', error);
        this.loading = false;
      }
    });
  }

  filterByAllowedTypes(items: MediaItem[]): MediaItem[] {
    if (!this.config.allowedTypes || this.config.allowedTypes.length === 0) {
      return items;
    }

    return items.filter(item =>
      this.config.allowedTypes!.some(type => item.file_type.includes(type))
    );
  }

  onSearch(): void {
    this.offset = 0;
    this.loadMedia();
  }

  onFileTypeFilterChange(): void {
    this.offset = 0;
    this.loadMedia();
  }

  selectItem(item: MediaItem): void {
    if (this.config.multiple) {
      const index = this.selectedItems.findIndex(i => i.uuid === item.uuid);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems = [item];
    }
  }

  isSelected(item: MediaItem): boolean {
    return this.selectedItems.some(i => i.uuid === item.uuid);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Check if file type is allowed
      if (this.config.allowedTypes && this.config.allowedTypes.length > 0) {
        const isAllowed = this.config.allowedTypes.some(type => file.type.includes(type));
        if (!isAllowed) {
          this.notify.failNotification(`File type ${file.type} is not allowed`);
          return;
        }
      }

      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    this.uploading = true;
    this.mediaService.uploadMedia(file).subscribe({
      next: (response) => {
        this.notify.successNotification('File uploaded successfully');
        this.uploading = false;
        // Reload media to show the new file
        this.loadMedia();
      },
      error: (error) => {
        this.notify.failNotification('Failed to upload file');
        console.error('Upload error:', error);
        this.uploading = false;
      }
    });
  }

  onConfirm(): void {
    if (this.selectedItems.length === 0) {
      this.notify.failNotification('Please select at least one item');
      return;
    }

    // Return URLs instead of full objects
    const result = this.selectedItems.map(item => item.file_url);
    this.dialogRef.close(this.config.multiple ? result : result[0]);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getFileIcon(fileType: string): string {
    return this.mediaService.getFileIcon(fileType);
  }

  formatFileSize(bytes: number): string {
    return this.mediaService.formatFileSize(bytes);
  }

  isImage(fileType: string): boolean {
    return this.mediaService.isImage(fileType);
  }

  loadMore(): void {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      this.loadMedia();
    }
  }

  hasMore(): boolean {
    return this.offset + this.limit < this.total;
  }
}
