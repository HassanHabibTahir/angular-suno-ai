import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-player.component.html',
  styleUrls: ['./song-player.component.scss']
})
export class SongPlayerComponent implements OnChanges {
  @Input() songId: string | null = null;
  song: any = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(private songService: SongService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songId'] && this.songId) {
      this.fetchSong(this.songId);
    }
  }

  ngAfterViewInit(): void {
    // Attempt to play the audio when it's available
    if (this.song && this.audioPlayer && this.audioPlayer.nativeElement) {
      setTimeout(() => {
        this.audioPlayer.nativeElement.play().catch((error) => {
          console.error('Error auto-playing audio:', error);
        });
      }, 0);
    }
  }
  fetchSong(songId: string): void {
    this.songService.getSongById(songId).subscribe({
      next: (fetchedSong) => {
        this.song = fetchedSong[0];
        if (this.audioPlayer && this.audioPlayer.nativeElement) {
          this.audioPlayer.nativeElement.play().catch((error) => {
            console.error('Error auto-playing audio:', error);
          });
        }
      },
      error: (error) => {
        console.error('Error fetching song:', error);
      }
    });
  }
}
