import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-player.component.html',
  styleUrls: ['./song-player.component.scss'],
})
export class SongPlayerComponent implements OnChanges, AfterViewInit {
  @Input() songId: string | null = null;
  song: any = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(private songService: SongService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songId'] && this.songId) {
      this.fetchSong(this.songId);
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges(); // Ensure view is updated
  }

  fetchSong(songId: string): void {
    this.songService.getSongById(songId).subscribe({
      next: (fetchedSong) => {
        this.song = fetchedSong[0];
        this.cdr.detectChanges(); // Ensure the view is updated before accessing the DOM

        // Wait for the audio player to be ready
        if (this.audioPlayer && this.audioPlayer.nativeElement) {
          this.audioPlayer.nativeElement.oncanplay = () => {
            this.audioPlayer.nativeElement.play().catch((error) => {
              console.error('Error auto-playing audio:', error);
            });
          };
        }
      },
      error: (error) => {
        console.error('Error fetching song:', error);
      },
    });
  }
}
