import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Observable } from 'rxjs';

export interface MediaItem {
  uuid: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_url: string;
  file_type: string;
  file_extension: string;
  file_size: number;
  uploaded_by?: number;
  created_at: string;
  updated_at: string;
}

export interface MediaListResponse {
  data: MediaItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface MediaStatsResponse {
  total_files: number;
  total_size: number;
  total_size_mb: number;
  file_type_counts: Array<{ file_type: string; count: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class MediaLibraryService {
  private readonly baseUrl = 'media-library';

  constructor(private http: HttpService) { }

  /**
   * Get all media items with pagination and optional filters
   */
  getMediaItems(params?: {
    limit?: number;
    offset?: number;
    search?: string;
    file_type?: string;
  }): Observable<MediaListResponse> {
    let url = this.baseUrl;
    const queryParams: string[] = [];

    if (params) {
      if (params.limit) queryParams.push(`limit=${params.limit}`);
      if (params.offset) queryParams.push(`offset=${params.offset}`);
      if (params.search) queryParams.push(`search=${encodeURIComponent(params.search)}`);
      if (params.file_type) queryParams.push(`file_type=${encodeURIComponent(params.file_type)}`);
    }

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    return this.http.get<MediaListResponse>(url);
  }

  /**
   * Get a single media item by UUID
   */
  getMediaItem(uuid: string): Observable<MediaItem> {
    return this.http.get<MediaItem>(`${this.baseUrl}/${uuid}`);
  }

  /**
   * Upload a new media file
   */
  uploadMedia(file: File): Observable<{ message: string; data: MediaItem }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ message: string; data: MediaItem }>(this.baseUrl, formData);
  }

  /**
   * Delete a media item
   */
  deleteMedia(uuid: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${uuid}`);
  }

  /**
   * Get media library statistics
   */
  getStats(): Observable<MediaStatsResponse> {
    return this.http.get<MediaStatsResponse>(`${this.baseUrl}/stats`);
  }

  /**
   * Get the full URL for a media file
   */
  getMediaUrl(filename: string): string {
    return this.http.constructURL(`file-server/media-library/${filename}`);
  }

  /**
   * Format file size to human-readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Check if a file type is an image
   */
  isImage(fileType: string): boolean {
    return fileType.startsWith('image/');
  }

  /**
   * Get icon class for file type
   */
  getFileIcon(fileType: string): string {
    if (this.isImage(fileType)) return 'image';
    if (fileType === 'application/pdf') return 'picture_as_pdf';
    if (fileType.includes('word')) return 'description';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'table_chart';
    return 'insert_drive_file';
  }
}
