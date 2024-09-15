import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, tap, forkJoin } from 'rxjs';
import { ProgressDialogComponent, ProgressItem } from 'src/app/shared/components/progress-dialog/progress-dialog.component';
import { HttpService } from './http.service';

export interface FileUploadResponse { key: string, response: { filePath: string, fullPath: string }, status: string }

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private dialogRef: MatDialogRef<ProgressDialogComponent> | null = null;

  constructor(private dialog: MatDialog, private http: HttpService) { }

  open(title: string, progressItems: ProgressItem[], disableCancel: boolean = false): void {
    this.dialogRef = this.dialog.open(ProgressDialogComponent, {
      data: { title, progressItems, disableCancel },
      disableClose: true
    });
  }

  updateProgress(progressItems: ProgressItem[]): void {
    if (this.dialogRef) {
      this.dialogRef.componentInstance.data.progressItems = progressItems;
    }
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  uploadFiles(files: Map<string, File>, uploadUrl: string): Observable<FileUploadResponse[]> {
    const uploadObservables: Observable<any>[] = [];
    const progressItems: ProgressItem[] = [];

    files.forEach((file, key) => {
      const formData = new FormData();
      formData.append('uploadFile', file, file.name);

      const upload$ = this.http.postWithProgress<FileUploadResponse[]>(uploadUrl, formData).pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round(100 * event.loaded / (event.total ?? 1));
              return { key, progress, status: 'progress' };
            case HttpEventType.Response:
              return { key, status: 'complete', response: event.body };
            default:
              return { key, status: 'unknown' };
          }
        }),
        tap(update => {
          const itemIndex = progressItems.findIndex(item => item.title === key);
          if (itemIndex !== -1) {
            progressItems[itemIndex].progress = update.progress ?? 100;
            this.updateProgress(progressItems);
          }
        })
      );

      uploadObservables.push(upload$);
      progressItems.push({ title: key, progress: 0 });
    });

    this.open('Uploading Files', progressItems);

    return forkJoin(uploadObservables).pipe(
      tap(() => {
        setTimeout(() => this.close(), 1000);
      })
    );
  }
}
