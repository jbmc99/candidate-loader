import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates';

  constructor(private http: HttpClient) {}

  uploadCandidateData(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
