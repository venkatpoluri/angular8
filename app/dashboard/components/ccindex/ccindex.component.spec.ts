import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcindexComponent } from './ccindex.component';

describe('CcindexComponent', () => {
  let component: CcindexComponent;
  let fixture: ComponentFixture<CcindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
