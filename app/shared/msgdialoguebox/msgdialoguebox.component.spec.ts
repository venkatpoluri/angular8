import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgdialogueboxComponent } from './msgdialoguebox.component';

describe('MsgdialogueboxComponent', () => {
  let component: MsgdialogueboxComponent;
  let fixture: ComponentFixture<MsgdialogueboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgdialogueboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgdialogueboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
