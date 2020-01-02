import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsdpTabComponent } from './hsdp-tab.component';

describe('HsdpTabComponent', () => {
  let component: HsdpTabComponent;
  let fixture: ComponentFixture<HsdpTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsdpTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsdpTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
