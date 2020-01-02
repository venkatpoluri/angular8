import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingTabComponent } from './messaging-tab.component';

describe('MessagingTabComponent', () => {
  let component: MessagingTabComponent;
  let fixture: ComponentFixture<MessagingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
