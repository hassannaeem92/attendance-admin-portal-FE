import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditHolidayComponent } from './add-edit-holiday.component';

describe('AddEditHolidayComponent', () => {
  let component: AddEditHolidayComponent;
  let fixture: ComponentFixture<AddEditHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditHolidayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
