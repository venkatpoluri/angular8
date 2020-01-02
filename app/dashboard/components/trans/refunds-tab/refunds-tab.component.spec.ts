import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundsTabComponent } from './refunds-tab.component';

describe('RefundsTabComponent', () => {
  let component: RefundsTabComponent;
  let fixture: ComponentFixture<RefundsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
