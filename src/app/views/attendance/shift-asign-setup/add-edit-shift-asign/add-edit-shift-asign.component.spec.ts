import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShiftAsignComponent } from './add-edit-shift-asign.component';

describe('AddEditShiftAsignComponent', () => {
  let component: AddEditShiftAsignComponent;
  let fixture: ComponentFixture<AddEditShiftAsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditShiftAsignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditShiftAsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
