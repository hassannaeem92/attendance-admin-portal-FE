import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAssignUserModalComponent } from './shift-assign-user-modal.component';

describe('ShiftAssignUserModalComponent', () => {
  let component: ShiftAssignUserModalComponent;
  let fixture: ComponentFixture<ShiftAssignUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftAssignUserModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftAssignUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
