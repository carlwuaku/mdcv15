import { Component, OnInit } from '@angular/core';
import { MediaLibraryService, MediaItem, MediaStatsResponse } from '../../services/media-library.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.scss']
})
export class MediaLibraryComponent implements OnInit {
  mediaItems: MediaItem[] = [];
  loading = false;
  searchText = '';
  fileTypeFilter = '';
  uploading = false;
  stats: MediaStatsResponse | null = null;

  // Pagination
  limit = 50;
  offset = 0;
  total = 0;

  // View mode
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private mediaService: MediaLibraryService,
    private notify: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadMedia();
    this.loadStats();
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

  loadStats(): void {
    this.mediaService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Failed to load stats:', error);
      }
    });
  }

  onSearch(): void {
    this.offset = 0;
    this.loadMedia();
  }

  onFileTypeFilterChange(): void {
    this.offset = 0;
    this.loadMedia();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    this.uploading = true;
    this.mediaService.uploadMedia(file).subscribe({
      next: (response) => {
        this.notify.successNotification('File uploaded successfully');
        this.uploading = false;
        // Reload media and stats
        this.loadMedia();
        this.loadStats();
      },
      error: (error) => {
        this.notify.failNotification('Failed to upload file');
        console.error('Upload error:', error);
        this.uploading = false;
      }
    });
  }

  deleteItem(item: MediaItem): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Media',
        message: `Are you sure you want to delete "${item.original_filename}"? This action cannot be undone.`,
        icon: 'warning',
        primaryButton: 'Delete',
        secondaryButton: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.mediaService.deleteMedia(item.uuid).subscribe({
          next: () => {
            this.notify.successNotification('Media item deleted successfully');
            this.loadMedia();
            this.loadStats();
          },
          error: (error) => {
            this.notify.failNotification('Failed to delete media item');
            console.error('Delete error:', error);
          }
        });
      }
    });
  }

  copyUrl(item: MediaItem): void {
    navigator.clipboard.writeText(item.file_url).then(() => {
      this.notify.successNotification('URL copied to clipboard');
    }).catch(err => {
      this.notify.failNotification('Failed to copy URL');
      console.error('Copy error:', err);
    });
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

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
