import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtridTransactionsComponent } from './gtrid-transactions.component';

describe('GtridTransactionsComponent', () => {
  let component: GtridTransactionsComponent;
  let fixture: ComponentFixture<GtridTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtridTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtridTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
