import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransHeaderComponent } from './trans-header.component';

describe('TransHeaderComponent', () => {
  let component: TransHeaderComponent;
  let fixture: ComponentFixture<TransHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
