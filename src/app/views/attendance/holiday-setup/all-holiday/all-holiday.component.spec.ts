import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHolidayComponent } from './all-holiday.component';

describe('AllHolidayComponent', () => {
  let component: AllHolidayComponent;
  let fixture: ComponentFixture<AllHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllHolidayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
