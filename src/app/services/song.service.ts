import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http: HttpClient) {}
  private apiUrl = 'https://suno-test-api.vercel.app/api';
  getAllSongs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get`);
  }
  getSongById(songId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get?ids=${songId}`);
  }
  generateSong(prompt: any): Observable<any> {
    console.log(prompt,"prompt")
    return this.http.post<any>(`${this.apiUrl}/custom_generate`, prompt);
  }
} 
