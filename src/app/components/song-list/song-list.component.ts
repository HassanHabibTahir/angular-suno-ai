import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { SongService } from '../../services/song.service';
import { CommonModule } from '@angular/common';
import { SongPlayerComponent } from '../song-player/song-player.component';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, SongPlayerComponent],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit, AfterViewInit {

  songs: any[] = [];
  currentSongId: any | null = null;
  song: any = null;

  @Output() selectSong = new EventEmitter<any>();
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(private songService: SongService) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.fetchAllSongs();  
    setTimeout(() => {
      if (this.currentSongId) {
        this.playCurrentSong();
      }
    }, 3000);
  }

  onSongSelect(songId: string) {
    this.currentSongId = songId;
    this.fetchSelectedSong(this.currentSongId);
  }

  fetchAllSongs() {
    this.songService.getAllSongs().subscribe({
      next: (fetchedSongs: any[]) => {
        const uniqueSongs: any[] = [];
        const songTitles = new Set<string>();

        fetchedSongs.forEach(song => {
          if (!songTitles.has(song.title)) {
            songTitles.add(song.title);
            uniqueSongs.push(song);
          }
        });

        this.songs = uniqueSongs;
        if (this.songs.length > 0) {
            this.onSongSelect(this.songs[0].id);
     
        }
      },
      error: (error) => {
        console.error('Error fetching songs:', error);
      }
    });
  }

  fetchSelectedSong(songId: any): void {
    this.songService.getSongById(songId).subscribe({
      next: (fetchedSong) => {
        this.song = fetchedSong[0];
        if (this.audioPlayer && this.audioPlayer.nativeElement) {
          this.audioPlayer.nativeElement.oncanplay = () => {
            this.playCurrentSong();
          };

          this.audioPlayer.nativeElement.onended = () => {
            this.onSongEnded();
          };
        } 
      },
      error: (error) => {
        console.error('Error fetching song:', error);
      },
    });
  }

  playCurrentSong() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.play().catch((error) => {
        console.error('Error auto-playing audio:', error);
      });

      this.audioPlayer.nativeElement.onended = () => {
        this.onSongEnded();
      };
    }
  }

  onSongEnded() {
    const currentIndex = this.songs.findIndex(song => song.id === this.currentSongId);
    if (currentIndex < this.songs.length - 1) {
      const nextSongId = this.songs[currentIndex + 1].id;
      this.onSongSelect(nextSongId);
    }
  }

  addSongToTop(newSong: any) {
    console.log('new song received')
    this.songs.push(newSong[0]);
    if (!this.currentSongId) {
      this.onSongSelect(newSong[0].id);
    }
  }
}
