import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomercareIndexComponent } from './customercare-index.component';

describe('CustomercareIndexComponent', () => {
  let component: CustomercareIndexComponent;
  let fixture: ComponentFixture<CustomercareIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomercareIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomercareIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
