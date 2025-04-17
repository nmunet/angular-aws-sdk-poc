import { Component, OnInit } from '@angular/core';
import { S3Service } from '../s3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  buckets: string[] = [];
  objects: any[] = [];
  selectedBucket = '';

  constructor(private s3Service: S3Service) {}

  ngOnInit() {
    this.s3Service.getBuckets().subscribe((res) => {
      this.buckets = res.buckets;
    });
  }

  loadObjects(bucket: string) {
    this.selectedBucket = bucket;
    this.s3Service.getObjects(bucket).subscribe((res) => {
      this.objects = res.objects || [];
    });
  }
}
