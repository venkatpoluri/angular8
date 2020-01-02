import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadbulkuserComponent } from './uploadbulkuser.component';

describe('UploadbulkuserComponent', () => {
  let component: UploadbulkuserComponent;
  let fixture: ComponentFixture<UploadbulkuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadbulkuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadbulkuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
