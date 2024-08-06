import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
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
  @Input() songId: any | null = null;
  @Output() songEnded = new EventEmitter<void>();
  song: any = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(private songService: SongService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songId'] && this.songId) {
      this.fetchSong(this.songId);
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  fetchSong(songId: string): void {
    this.songService.getSongById(songId).subscribe({
      next: (fetchedSong) => {
        this.song = fetchedSong[0];
        this.cdr.detectChanges();

        if (this.audioPlayer && this.audioPlayer.nativeElement) {
          this.audioPlayer.nativeElement.oncanplay = () => {
            this.audioPlayer.nativeElement.play().catch((error) => {
              console.error('Error auto-playing audio:', error);
            });
          };

          this.audioPlayer.nativeElement.onended = () => {
            console.log('song ended emit');
            try {
              this.songEnded.emit();
            } catch (error) {
              console.error('Error emitting songEnded event:', error);
            }
          };
        }
      },
      error: (error) => {
        console.error('Error fetching song:', error);
      },
    });
  }
}
