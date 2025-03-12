import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOffDayComponent } from './all-off-day.component';

describe('AllOffDayComponent', () => {
  let component: AllOffDayComponent;
  let fixture: ComponentFixture<AllOffDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOffDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOffDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
