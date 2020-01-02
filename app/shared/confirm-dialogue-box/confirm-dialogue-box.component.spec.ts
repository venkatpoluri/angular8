import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogueBoxComponent } from './confirm-dialogue-box.component';

describe('ConfirmDialogueBoxComponent', () => {
  let component: ConfirmDialogueBoxComponent;
  let fixture: ComponentFixture<ConfirmDialogueBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogueBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogueBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
