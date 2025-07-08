import { TestBed } from '@angular/core/testing';

import { AwsSdkWrapperService } from './aws-sdk-wrapper.service';

describe('AwsSdkWrapperService', () => {
  let service: AwsSdkWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsSdkWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
