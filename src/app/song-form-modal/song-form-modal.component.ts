// song-form-modal.component.ts
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {SongService} from '../services/song.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-song-form-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './song-form-modal.component.html',
  styleUrls: ['./song-form-modal.component.scss'],
})
export class SongFormModalComponent {
  @Input() showModal: boolean = false; // Input to control modal visibility
  @Output() songGenerated = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>(); // EventEmitter for closing the modal
  constructor(private songService: SongService) {}
  prompt: string = '';
  tags: string = '';
  title: string = '';
  loading: boolean = false;

  handleSubmit() {
    this.loading = true;

    this.songService.generateSong({
      prompt: this.prompt,
      tags: this.tags,
      title: this.title,
      make_instrumental: true,
      wait_audio: true,
    }).pipe(
      finalize(() => this.loading = false), 
      catchError(error => {
        console.error('Error generating song:', error);
        return of(null); 
      })
    ).subscribe({
      next: (song) => {
        if (song) {
          this.songGenerated.emit(song);
          this.closeModal.emit();
        }
      },
      error: (error) => {
        console.error('Error in subscription:', error);
      },
    });
}
}
