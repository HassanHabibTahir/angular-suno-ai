  import { Component, EventEmitter, OnInit, Output } from '@angular/core';
  import { SongService } from '../../services/song.service';
  import { CommonModule } from '@angular/common';
  @Component({
    selector: 'app-song-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './song-list.component.html',
    styleUrl: './song-list.component.scss'
  })
  export class SongListComponent  implements OnInit{
    songs: any[] = [];
    @Output() selectSong = new EventEmitter<string>();
    constructor(private songService: SongService) {}

    ngOnInit(): void {
      this.fetchSongs();
    }
    onSongSelect(songId: string) {
      this.selectSong.emit(songId);
    }
    fetchSongs() {
      this.songService.getAllSongs().subscribe({
        next: (fetchedSongs) => {
          this.songs = fetchedSongs;
          if (this.songs.length > 0) {
            this.selectSong.emit(this.songs[0].id);
          }

        },
        error: (error) => {
          console.error('Error fetching songs:', error);
        }
      });
    }
    addSongToTop(newSong: any) {
      console.log(newSong,"newSong");
      this.songs = [...newSong, ...this.songs];
      console.log(this.songs);
      // this.selectSong.emit(newSong.id); // Optionally select the new song
    }
  }
