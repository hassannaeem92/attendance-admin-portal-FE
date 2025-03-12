import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOffDayComponent } from './add-edit-off-day.component';

describe('AddEditOffDayComponent', () => {
  let component: AddEditOffDayComponent;
  let fixture: ComponentFixture<AddEditOffDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditOffDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditOffDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
