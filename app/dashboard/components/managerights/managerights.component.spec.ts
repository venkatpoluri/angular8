import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerightsComponent } from './managerights.component';

describe('ManagerightsComponent', () => {
  let component: ManagerightsComponent;
  let fixture: ComponentFixture<ManagerightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
