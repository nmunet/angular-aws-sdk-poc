import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class S3Service {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getBuckets() {
    return this.http.get<{ buckets: string[] }>(`${this.baseUrl}/buckets`);
  }

  getObjects(bucket: string) {
    return this.http.get<{ objects: any[] }>(`${this.baseUrl}/objects/${bucket}`);
  }
}
