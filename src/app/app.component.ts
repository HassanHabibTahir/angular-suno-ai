import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongListComponent } from './components/song-list/song-list.component';
import { SongPlayerComponent } from './components/song-player/song-player.component';
import { SongFormModalComponent } from './song-form-modal/song-form-modal.component';
import { SocketService } from './services/socket.service';
import { catchError, finalize, of, Subscription, take } from 'rxjs';
import { SongService } from './services/song.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SongListComponent,
    SongPlayerComponent,
    SongFormModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'suno-song-generator-app';
  private eventSubscription: Subscription | undefined;
  constructor(
    private socketService: SocketService,
    private songService: SongService
  ) {}
  selectedSongId: string | null = null;
  showSongFormModal: boolean = false;
  loading:boolean = false;
  @ViewChild(SongListComponent) songListComponent!: SongListComponent;
  onSelectSong(songId: string): void {
    this.selectedSongId = songId;
  }

  ngOnInit(): void {
    const username = 'YOUR_USERNAME';
    this.socketService.joinRoom(username);

    this.eventSubscription = this.socketService
      .on('new-event')
      .subscribe((data) => {
        const { event } = data;
        const { type , parameters } = event;
        const { message, username , amount } = parameters; 
        if(type != 'donation'){
          return
        }
        if(amount && Number(amount) >= 1){
            this.songService.generateSong({
                      prompt: event?.message,
                      tags: '',
                      title: event?.username,
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
                          this.onSongGenerated(song);
                        }
                      },
                      error: (error) => {
                        console.error('Error in subscription:', error);
                      },
                    });
        }
        console.log('Event received in component:', data);
      
      });
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    this.socketService.disconnect();
  }

  openSongFormModal(): void {
    this.showSongFormModal = true;
  }

  closeSongFormModal(): void {
    this.showSongFormModal = false;
  }

  onSongGenerated(song: any): void {
    if (this.songListComponent) {
      this.songListComponent.addSongToTop(song);
    }
    console.log('Song generated:', song);

    this.closeSongFormModal();
  }
}
