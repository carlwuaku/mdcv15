import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { DeferModule } from 'primeng/defer';

const modules = [
  ImageModule,

  GalleriaModule,

  MessageModule,
  MessagesModule,

  ToastModule,

  DeferModule
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ...modules
  ],
  exports: [
    CommonModule,
    ...modules
  ],
})
export class PrimeNgUiComponentsModule { }
