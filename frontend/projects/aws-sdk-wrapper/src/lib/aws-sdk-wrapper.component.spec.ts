import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsSdkWrapperComponent } from './aws-sdk-wrapper.component';

describe('AwsSdkWrapperComponent', () => {
  let component: AwsSdkWrapperComponent;
  let fixture: ComponentFixture<AwsSdkWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwsSdkWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwsSdkWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
