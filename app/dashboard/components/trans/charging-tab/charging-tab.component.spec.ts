import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingTabComponent } from './charging-tab.component';

describe('ChargingTabComponent', () => {
  let component: ChargingTabComponent;
  let fixture: ComponentFixture<ChargingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
