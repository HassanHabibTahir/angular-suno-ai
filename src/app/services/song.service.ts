import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  public allSongsList = new BehaviorSubject<any>(null);
  allSongsList$ = this.allSongsList.asObservable();

  
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://suno-api-five-seven.vercel.app/api';
  getAllSongs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get`);
  }
  getSongById(songId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get?ids=${songId}`);
  }
  generateSong(prompt: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/custom_generate`, prompt);
  }
} 
